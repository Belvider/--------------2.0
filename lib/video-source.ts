export function getVideoSource(rawUrl: string, provider?: string): { kind: "video" | "iframe"; url: string } | null {
  try {
    const url = new URL(rawUrl, "https://portal.invalid");
    if (!["http:", "https:"].includes(url.protocol)) return null;
    if (provider === "html5" || /\.(mp4|webm|ogg)$/i.test(url.pathname)) return { kind: "video", url: rawUrl };
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    if (["youtube.com", "m.youtube.com", "youtube-nocookie.com", "youtu.be"].includes(host)) {
      const id = host === "youtu.be" ? url.pathname.split("/")[1]
        : url.searchParams.get("v") || url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1];
      if (!id || !/^[\w-]{11}$/.test(id)) return null;
      return { kind: "iframe", url: `https://www.youtube-nocookie.com/embed/${id}` };
    }
    if (["vimeo.com", "player.vimeo.com"].includes(host)) {
      const id = url.pathname.match(/(?:^|\/)(\d+)(?:\/|$)/)?.[1];
      return id ? { kind: "iframe", url: `https://player.vimeo.com/video/${id}` } : null;
    }
    return { kind: "iframe", url: rawUrl };
  } catch { return null; }
}
