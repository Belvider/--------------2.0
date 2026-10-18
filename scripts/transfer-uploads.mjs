import * as fs from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const CONTENT_TYPES = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp',
  avif: 'image/avif', svg: 'image/svg+xml', pdf: 'application/pdf'
};

function inside(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative !== '' && relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}

export function isSafeUploadPathname(key) {
  return typeof key === 'string' && key.length > 0 && !/[\\:\u0000%?#]/.test(key)
    && key.split('/').every((part) => part && part.trim() === part && part !== '.' && part !== '..');
}

async function existingStat(filename, io) {
  try { return await io.lstat(filename); } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
}

async function requireRealDirectory(directory, io) {
  const entry = await existingStat(directory, io);
  if (!entry) return false;
  if (entry.isSymbolicLink() || !entry.isDirectory()) throw new Error('Unsafe source directory');
  return true;
}

async function collectUploads(projectRoot, io) {
  const publicRoot = path.join(projectRoot, 'public');
  const uploadRoot = path.join(publicRoot, 'uploads');
  if (!await requireRealDirectory(publicRoot, io) || !await requireRealDirectory(uploadRoot, io)) return [];
  const realRoot = await io.realpath(uploadRoot);
  if (!inside(projectRoot, realRoot)) throw new Error('Source leaves project directory');
  const files = [];

  async function walk(directory) {
    const entries = await io.readdir(directory, { withFileTypes: true });
    entries.sort((left, right) => left.name < right.name ? -1 : left.name > right.name ? 1 : 0);
    for (const entry of entries) {
      const filename = path.resolve(directory, entry.name);
      if (!inside(uploadRoot, filename) || path.basename(entry.name) !== entry.name) throw new Error('Unsafe source path');
      const key = path.relative(uploadRoot, filename).split(path.sep).join('/');
      if (!isSafeUploadPathname(key)) throw new Error('Unsafe upload pathname');
      const entryStat = await io.lstat(filename);
      if (entry.isSymbolicLink() || entryStat.isSymbolicLink()) throw new Error('Symbolic links are not transferable');
      if (!inside(realRoot, await io.realpath(filename))) throw new Error('Source leaves upload directory');
      if (entryStat.isDirectory()) await walk(filename);
      else if (entryStat.isFile()) files.push({ filename, key, size: entryStat.size, realRoot });
      else throw new Error('Only regular files are transferable');
    }
  }

  await walk(uploadRoot);
  return files;
}

async function readSource(file, io) {
  const entry = await io.lstat(file.filename);
  if (!entry.isFile() || entry.isSymbolicLink() || !inside(file.realRoot, await io.realpath(file.filename))) {
    throw new Error('Source changed during transfer');
  }
  const handle = await io.open(file.filename, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
  try {
    const opened = await handle.stat();
    if (!opened.isFile()) throw new Error('Source is no longer a regular file');
    const bytes = await handle.readFile();
    if (bytes.length !== file.size) throw new Error('Source changed during transfer');
    return bytes;
  } finally {
    await handle.close();
  }
}

function digest(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

async function listTarget(sdk) {
  const existing = new Set();
  let cursor;
  do {
    const page = await sdk.list({ cursor });
    for (const blob of page.blobs) existing.add(blob.pathname);
    if (!page.hasMore) break;
    if (!page.cursor || page.cursor === cursor) throw new Error('Invalid pagination cursor');
    cursor = page.cursor;
  } while (cursor);
  return existing;
}

async function writeReport(projectRoot, report, io) {
  const reports = path.join(projectRoot, 'reports');
  const entry = await existingStat(reports, io);
  if (entry && (entry.isSymbolicLink() || !entry.isDirectory())) throw new Error('Unsafe reports directory');
  if (!entry) await io.mkdir(reports, { recursive: true });
  if (!inside(projectRoot, await io.realpath(reports))) throw new Error('Reports leave project directory');
  const filename = path.join(reports, `upload-transfer-${report.startedAt.replace(/[:.]/g, '-')}-${randomUUID()}.json`);
  // Reports contain counts and byte totals, never file contents, tokens or URLs.
  await io.writeFile(filename, JSON.stringify(report, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
  return filename;
}

export class UploadTransferError extends Error {
  constructor(report, reportPath) {
    super(`Upload transfer stopped during ${report.failureStage}. No existing target files were overwritten or deleted.`);
    this.name = 'UploadTransferError';
    this.report = report;
    this.reportPath = reportPath;
  }
}

export async function transferUploads({
  projectRoot = process.cwd(), apply = false, env = process.env, sdk, io = fs
} = {}) {
  const root = await io.realpath(path.resolve(projectRoot));
  const report = {
    version: 1, startedAt: new Date().toISOString(), finishedAt: null,
    status: apply ? 'running' : 'dry-run', source: 'public/uploads', target: 'private-vercel-blob',
    local: { files: 0, bytes: 0 }, uploaded: { files: 0, bytes: 0 }, identical: { files: 0, bytes: 0 }
  };
  let stage = 'source validation';
  let failed = false;
  try {
    const files = await collectUploads(root, io);
    report.local = { files: files.length, bytes: files.reduce((sum, file) => sum + file.size, 0) };
    if (apply) {
      stage = 'storage configuration';
      if (!env.BLOB_READ_WRITE_TOKEN && !(env.BLOB_STORE_ID && env.VERCEL_OIDC_TOKEN)) {
        throw new Error('Connect a private Vercel Blob store before applying');
      }
      const client = sdk ?? await import('@vercel/blob');
      stage = 'target listing';
      const existing = await listTarget(client);
      const pending = [];
      stage = 'content comparison';
      // Finish every conflict check before creating the first new object.
      for (const file of files) {
        const bytes = await readSource(file, io);
        file.sha256 = digest(bytes);
        if (existing.has(file.key)) {
          const target = await client.get(file.key, { access: 'private', useCache: false });
          if (target?.statusCode !== 200 || !target.stream) throw new Error('Existing upload could not be verified');
          const remote = Buffer.from(await new Response(target.stream).arrayBuffer());
          if (remote.length !== file.size || digest(remote) !== file.sha256) {
            stage = 'conflict detection';
            throw new Error('Existing upload differs');
          }
          report.identical.files++;
          report.identical.bytes += file.size;
        } else pending.push(file);
      }

      stage = 'upload';
      for (const file of pending) {
        const bytes = await readSource(file, io);
        if (digest(bytes) !== file.sha256) throw new Error('Source changed after comparison');
        await client.put(file.key, bytes, {
          access: 'private', addRandomSuffix: false, allowOverwrite: false,
          contentType: CONTENT_TYPES[path.extname(file.key).slice(1).toLowerCase()] ?? 'application/octet-stream'
        });
        report.uploaded.files++;
        report.uploaded.bytes += file.size;
      }
      report.status = 'complete';
    }
  } catch {
    // Provider errors may contain authorization details; keep them out of logs
    // and reports. The stage plus counters are enough to safely retry.
    failed = true;
    report.status = 'failed';
    report.failureStage = stage;
  }
  report.finishedAt = new Date().toISOString();
  const reportPath = await writeReport(root, report, io);
  if (failed) throw new UploadTransferError(report, reportPath);
  return { report, reportPath };
}

export async function main(argv = process.argv.slice(2)) {
  if (argv.includes('--help')) {
    console.log('Usage: node scripts/transfer-uploads.mjs [--dry-run | --apply]');
    console.log('Default: local inventory only. --apply copies files to private Vercel Blob without overwriting or deleting.');
    return;
  }
  if (argv.some((value) => !['--apply', '--dry-run'].includes(value)) || (argv.includes('--apply') && argv.includes('--dry-run'))) {
    throw new Error('Use --dry-run (default) or --apply.');
  }
  const { report, reportPath } = await transferUploads({ apply: argv.includes('--apply') });
  console.log(`${report.status}: ${report.local.files} local files (${report.local.bytes} bytes); ${report.uploaded.files} uploaded; ${report.identical.files} already identical.`);
  console.log(`Report: ${path.relative(process.cwd(), reportPath)}`);
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  main().catch((error) => {
    if (error instanceof UploadTransferError) {
      console.error(error.message);
      console.error(`Report: ${path.relative(process.cwd(), error.reportPath)}`);
    } else console.error('Upload transfer could not run. Check arguments, source directory and reports permissions.');
    process.exitCode = 1;
  });
}
