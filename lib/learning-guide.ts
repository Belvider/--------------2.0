export type LearningSource = { id: string; title: string; url: string; scope: string; anchors: string[] };
export type LearningRouteItem = { title: string; anchor: string };
export type LearningPractice = { id: string; title: string; situation: string; prompt: string; explanation: string; sourceIds: string[] };
export type LearningVideo = { title: string; url: string; author: string; summary: string[]; exercise?: string };
export type LearningModelLink = { title: string; url: string; variant: string; note: string };
export type LearningGuide = {
  version: 1; reviewedAt: string; objectives: string[]; prerequisites: string;
  route: LearningRouteItem[]; reference: LearningRouteItem[]; sources: LearningSource[];
  video?: LearningVideo; practice: LearningPractice[]; models3d?: LearningModelLink[];
};

const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);
const string = (value: unknown, limit = 300): value is string => typeof value === "string" && value.trim().length > 0 && value.length <= limit;
const strings = (value: unknown, maxItems = 6, limit = 300): value is string[] => Array.isArray(value) && value.length <= maxItems && value.every(item => string(item, limit));
const id = (value: unknown): value is string => typeof value === "string" && /^[a-z0-9][a-z0-9-]{0,63}$/.test(value);
const anchor = (value: unknown): value is string => typeof value === "string" && /^module-[1-9]\d*-topic-[1-9]\d*(?:-[a-z0-9]+)*$/.test(value);
const httpsUrl = (value: unknown): value is string => {
  if (!string(value, 1600)) return false;
  try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password; } catch { return false; }
};
const videoUrl = (value: unknown) => {
  if (!httpsUrl(value)) return false;
  const url = new URL(value);
  return ["youtube.com", "www.youtube.com", "youtu.be", "youtube-nocookie.com", "www.youtube-nocookie.com", "vimeo.com", "player.vimeo.com"].includes(url.hostname)
    || /\.(?:mp4|webm|ogg)$/i.test(url.pathname);
};

/** Validate stored metadata before rendering it or returning it to the editor. */
export function parseLearningGuide(value: unknown, moduleId?: number): LearningGuide | null {
  if (!record(value) || value.version !== 1 || !string(value.reviewedAt, 10)
    || !/^\d{4}-\d{2}-\d{2}$/.test(value.reviewedAt) || Number.isNaN(Date.parse(value.reviewedAt))
    || new Date(value.reviewedAt).toISOString().slice(0, 10) !== value.reviewedAt
    || !strings(value.objectives, 3) || !value.objectives.length || !string(value.prerequisites, 500)) return null;
  const localAnchor = (value: unknown) => anchor(value) && (moduleId === undefined || value.startsWith(`module-${moduleId}-topic-`));
  const routes = (items: unknown): items is LearningRouteItem[] => Array.isArray(items) && items.length <= 16
    && items.every(item => record(item) && string(item.title, 140) && localAnchor(item.anchor));
  if (!routes(value.route) || !routes(value.reference) || !Array.isArray(value.sources) || value.sources.length > 60) return null;
  if (!value.sources.every(source => record(source) && id(source.id) && string(source.title, 160) && httpsUrl(source.url)
    && string(source.scope, 600) && Array.isArray(source.anchors) && source.anchors.length <= 40 && source.anchors.every(localAnchor))) return null;
  const sourceIds = new Set(value.sources.map(source => source.id));
  if (sourceIds.size !== value.sources.length) return null;
  if (!Array.isArray(value.practice) || value.practice.length > 4 || !value.practice.every(item => record(item)
    && id(item.id) && string(item.title, 140) && string(item.situation, 900) && string(item.prompt, 500) && string(item.explanation, 1400)
    && Array.isArray(item.sourceIds) && item.sourceIds.length <= 8 && item.sourceIds.every(sourceId => id(sourceId) && sourceIds.has(sourceId)))) return null;
  if (new Set(value.practice.map(item => item.id)).size !== value.practice.length) return null;
  if (value.video !== undefined && (!record(value.video) || !string(value.video.title, 180) || !videoUrl(value.video.url)
    || !string(value.video.author, 100) || !strings(value.video.summary, 5, 500)
    || (value.video.exercise !== undefined && !string(value.video.exercise, 600)))) return null;
  if (value.models3d !== undefined && (!Array.isArray(value.models3d) || value.models3d.length > 4 || !value.models3d.every(item => record(item)
    && string(item.title, 140) && httpsUrl(item.url) && string(item.variant, 240) && string(item.note, 600)))) return null;
  return value as unknown as LearningGuide;
}

export function getModuleLearningGuide(blocks: readonly { learningGuide?: unknown }[], moduleId?: number) {
  for (const block of blocks) { const guide = parseLearningGuide(block.learningGuide, moduleId); if (guide) return guide; }
  return null;
}

export function getLearningGuideAnchor(moduleId: number, section: "overview" | "video" | "sources" | "models" | "practice", itemId?: string) {
  return `module-${moduleId}-guide-${section}${itemId ? `-${itemId}` : ""}`;
}
