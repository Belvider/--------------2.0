/** Only reviewed, locally hosted assets can be selected by stored metadata. */
export const LOCAL_LEARNING_MODEL_ASSETS = {
  "iphone-15-pro-max": {
    title: "iPhone 15 Pro Max",
    path: "/models/iphone-15-pro-max.glb",
    presentation: {
      url: "https://support.apple.com/en-us/111828",
      variant: "Незалежна авторська 3D-візуалізація iPhone 15 Pro Max.",
      note: "Огляд форми корпусу, камер і кнопок. Кольори, комплектацію та характеристики звіряйте за офіційною специфікацією."
    },
    uid: "df17520841214c1792fb8a44c6783ee7",
    author: "polyman Studio",
    authorUrl: "https://sketchfab.com/Polyman_3D",
    sourceUrl: "https://sketchfab.com/3d-models/apple-iphone-15-pro-max-black-df17520841214c1792fb8a44c6783ee7",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/"
  }
} as const;

export type LearningModelAssetId = keyof typeof LOCAL_LEARNING_MODEL_ASSETS;

export function getLearningModelAsset(assetId: unknown) {
  return typeof assetId === "string" && Object.hasOwn(LOCAL_LEARNING_MODEL_ASSETS, assetId)
    ? LOCAL_LEARNING_MODEL_ASSETS[assetId as LearningModelAssetId] : undefined;
}

export function getLocalLearningModelViewer(assetId: LearningModelAssetId) {
  const { title: _title, path: _path, presentation: _presentation, ...credits } = LOCAL_LEARNING_MODEL_ASSETS[assetId];
  return { provider: "local" as const, assetId, ...credits };
}
