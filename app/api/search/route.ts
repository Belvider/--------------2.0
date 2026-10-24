import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildPortalSearchIndex, searchPortalIndex, type PortalSearchIndex } from "@/lib/portal-search";
import { getPortalPageSettingKey, parsePortalPageContent, portalPageSlugs } from "@/lib/portal-pages";

export type { SearchResult, SearchResultType } from "@/lib/search-types";

// Reuse the visible-content index across keystrokes. A short, bounded lifetime
// also picks up direct content edits and publications without a separate sync.
const INDEX_TTL_MS = 10_000;
let snapshot: { expiresAt: number; promise: Promise<PortalSearchIndex> } | null = null;

async function getSearchIndex() {
  if (snapshot && snapshot.expiresAt > Date.now()) return snapshot.promise;
  const pending = Promise.all([
    prisma.module.findMany({
      where: { isPublished: true }, orderBy: { id: "asc" },
      select: { id: true, title: true, description: true, durationMin: true, contentBlocks: true,
        category: { select: { name: true, slug: true, brand: { select: { name: true, slug: true } } } } }
    }),
    prisma.brand.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }], select: { id: true, name: true, slug: true, description: true } }),
    prisma.category.findMany({ orderBy: { id: "asc" }, select: { id: true, name: true, slug: true, description: true, brand: { select: { name: true, slug: true } } } }),
    prisma.appSetting.findMany({ where: { key: { in: portalPageSlugs.map(getPortalPageSettingKey) } }, select: { key: true, value: true } })
  ]).then(([modules, brands, categories, settings]) => {
    const byKey = new Map(settings.map(setting => [setting.key, setting.value]));
    return buildPortalSearchIndex({ modules, brands, categories, portalPages: portalPageSlugs.map(slug => parsePortalPageContent(slug, byKey.get(getPortalPageSettingKey(slug)))) });
  });
  const current = { expiresAt: Date.now() + INDEX_TTL_MS, promise: pending };
  snapshot = current;
  pending.catch(() => { if (snapshot === current) snapshot = null; });
  return pending;
}

export async function GET(request: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Потрібно увійти в акаунт" }, { status: 401 });
  const params = new URL(request.url).searchParams;
  const query = params.get("q")?.trim() ?? "";
  const offset = Number(params.get("offset") ?? 0);
  const limit = Number(params.get("limit") ?? 12);
  if (query.length > 160 || !Number.isSafeInteger(offset) || offset < 0 || !Number.isSafeInteger(limit) || limit < 1 || limit > 30) {
    return NextResponse.json({ error: "Уточніть запит: до 160 символів, від 1 до 30 результатів за раз." }, { status: 400 });
  }
  try {
    const index = query.length >= 2 ? await getSearchIndex() : [];
    return NextResponse.json(searchPortalIndex(index, query, { offset, limit }), { headers: { "cache-control": "private, no-store" } });
  } catch {
    console.error("Portal search index unavailable.");
    return NextResponse.json({ error: "Пошук тимчасово недоступний. Спробуйте ще раз." }, { status: 503 });
  }
}
