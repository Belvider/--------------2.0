/** The stored record contains an ID, never arbitrary iframe HTML or URLs. */
export function getSketchfabEmbedUrl(uid: unknown) {
  return typeof uid === "string" && /^[a-f0-9]{32}$/.test(uid)
    ? `https://sketchfab.com/models/${uid}/embed?autostart=1`
    : null;
}
