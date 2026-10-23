// Frame transparent product packshots consistently without changing the original assets.
type ProductImageFrame = { naturalWidth: number; naturalHeight: number; x: number; y: number; width: number; height: number };

const iphoneFrames = [
  { prefix: "/materials/iphone/2026/18-pro/", naturalWidth: 940, naturalHeight: 1112, x: 145, y: 200, width: 650, height: 772 },
  { prefix: "/materials/iphone/2026/duo/", naturalWidth: 940, naturalHeight: 1112, x: 49, y: 272, width: 841, height: 568 },
  { prefix: "/materials/iphone/2026/17e/", naturalWidth: 940, naturalHeight: 1112, x: 116, y: 132, width: 708, height: 849 }
];

const packshotFrames: Record<string, ProductImageFrame> = {
  "/materials/apple-peripherals/2026/airtag-2.webp": {
    "naturalWidth": 450,
    "naturalHeight": 450,
    "x": 0,
    "y": 55,
    "width": 450,
    "height": 340
  },
  "/materials/playstation-gaming-consoles/2026/switch-2.webp": {
    "naturalWidth": 450,
    "naturalHeight": 450,
    "x": 23,
    "y": 67,
    "width": 408,
    "height": 301
  },
  "/materials/playstation-gaming-consoles/2026/portal-white.webp": {
    "naturalWidth": 450,
    "naturalHeight": 450,
    "x": 0,
    "y": 104,
    "width": 450,
    "height": 241
  },
  "/materials/playstation-gaming-consoles/2026/portal-midnight-black.webp": {
    "naturalWidth": 450,
    "naturalHeight": 450,
    "x": 0,
    "y": 130,
    "width": 450,
    "height": 190
  },
  "/materials/playstation-gaming-consoles/2026/rog-xbox-ally-white.webp": {
    "naturalWidth": 450,
    "naturalHeight": 450,
    "x": 13,
    "y": 128,
    "width": 425,
    "height": 195
  },
  "/materials/playstation-gaming-consoles/2026/legion-go-2-black.webp": {
    "naturalWidth": 450,
    "naturalHeight": 450,
    "x": 15,
    "y": 119,
    "width": 421,
    "height": 212
  },
  "/materials/playstation-gaming-consoles/2026/legion-go-s-black.webp": {
    "naturalWidth": 450,
    "naturalHeight": 450,
    "x": 13,
    "y": 124,
    "width": 426,
    "height": 202
  },
  "/materials/playstation-gaming-consoles/2026/rog-xbox-ally-x-black.webp": {
    "naturalWidth": 450,
    "naturalHeight": 450,
    "x": 10,
    "y": 126,
    "width": 431,
    "height": 198
  },
  "/materials/cameras-digital-cameras/2026/instax-mini-13-lagoon-green.webp": {
    "naturalWidth": 450,
    "naturalHeight": 450,
    "x": 22,
    "y": 0,
    "width": 407,
    "height": 450
  },
  "/materials/cameras-digital-cameras/2026/instax-mini-13-frost-blue.webp": {
    "naturalWidth": 450,
    "naturalHeight": 450,
    "x": 22,
    "y": 0,
    "width": 405,
    "height": 450
  },
  "/materials/cameras-digital-cameras/2026/instax-mini-13-candy-pink.webp": {
    "naturalWidth": 450,
    "naturalHeight": 450,
    "x": 21,
    "y": 0,
    "width": 407,
    "height": 450
  },
  "/materials/cameras-digital-cameras/2026/instax-mini-13-dreamy-purple.webp": {
    "naturalWidth": 450,
    "naturalHeight": 450,
    "x": 21,
    "y": 0,
    "width": 407,
    "height": 450
  },
  "/materials/cameras-digital-cameras/2026/instax-mini-13-clay-white.webp": {
    "naturalWidth": 450,
    "naturalHeight": 450,
    "x": 21,
    "y": 0,
    "width": 407,
    "height": 450
  },
  "/materials/cameras-digital-cameras/2026/canon-g7-x-mark-iii-black.webp": {
    "naturalWidth": 450,
    "naturalHeight": 450,
    "x": 28,
    "y": 104,
    "width": 394,
    "height": 242
  },
  "/materials/cameras-digital-cameras/2026/canon-g7-x-mark-iii-silver.webp": {
    "naturalWidth": 450,
    "naturalHeight": 450,
    "x": 8,
    "y": 92,
    "width": 432,
    "height": 266
  },
  "/materials/cameras-go-pro/2026/gopro-hero-2024.webp": {
    "naturalWidth": 450,
    "naturalHeight": 450,
    "x": 44,
    "y": 71,
    "width": 362,
    "height": 308
  },
  "/materials/cameras-go-pro/2026/gopro-lit-hero.webp": {
    "naturalWidth": 450,
    "naturalHeight": 450,
    "x": 54,
    "y": 40,
    "width": 342,
    "height": 370
  },
  "/materials/dyson-hair-stylers/2026/supersonic-r/ceramic-pink-rose-gold.webp": {
    "naturalWidth": 450,
    "naturalHeight": 450,
    "x": 135,
    "y": 8,
    "width": 181,
    "height": 433
  },
  "/materials/dyson-vacuums/2026/v12-detect-slim/nickel-black.webp": {
    "naturalWidth": 283,
    "naturalHeight": 472,
    "x": 0,
    "y": 0,
    "width": 283,
    "height": 472
  },
  "/materials/dyson-vacuums/2026/v16-piston-animal/gold.webp": {
    "naturalWidth": 450,
    "naturalHeight": 450,
    "x": 104,
    "y": 8,
    "width": 242,
    "height": 423
  },
  "/materials/dyson-vacuums/2026/v16-piston-animal-submarine/gold.webp": {
    "naturalWidth": 450,
    "naturalHeight": 450,
    "x": 120,
    "y": 8,
    "width": 213,
    "height": 432
  },
  "/materials/dyson-air-purifiers/2026/bp04/prussian-blue-gold.png": {
    "naturalWidth": 800,
    "naturalHeight": 1200,
    "x": 120,
    "y": 69,
    "width": 561,
    "height": 1063
  },
  "/materials/dyson-air-purifiers/2026/ph2-de-nox/nickel-gold.png": {
    "naturalWidth": 800,
    "naturalHeight": 1200,
    "x": 214,
    "y": 95,
    "width": 372,
    "height": 1008
  },
  "/materials/jbl-bluetooth-speakers/2026/jbl-go-5-black.webp": {
    "naturalWidth": 644,
    "naturalHeight": 644,
    "x": 93,
    "y": 169,
    "width": 458,
    "height": 306
  },
  "/materials/jbl-bluetooth-speakers/2026/jbl-clip-5-black.webp": {
    "naturalWidth": 644,
    "naturalHeight": 644,
    "x": 152,
    "y": 58,
    "width": 340,
    "height": 528
  },
  "/materials/jbl-bluetooth-speakers/2026/jbl-flip-7-black.webp": {
    "naturalWidth": 644,
    "naturalHeight": 644,
    "x": 27,
    "y": 201,
    "width": 590,
    "height": 241
  },
  "/materials/jbl-bluetooth-speakers/2026/jbl-charge-6-black.webp": {
    "naturalWidth": 644,
    "naturalHeight": 644,
    "x": 25,
    "y": 179,
    "width": 595,
    "height": 286
  },
  "/materials/jbl-bluetooth-speakers/2026/jbl-xtreme-4-black.webp": {
    "naturalWidth": 644,
    "naturalHeight": 644,
    "x": 27,
    "y": 158,
    "width": 590,
    "height": 328
  },
  "/materials/jbl-bluetooth-speakers/2026/jbl-xtreme-5-black.webp": {
    "naturalWidth": 644,
    "naturalHeight": 644,
    "x": 28,
    "y": 156,
    "width": 588,
    "height": 332
  },
  "/materials/jbl-bluetooth-speakers/2026/jbl-boombox-4-black.webp": {
    "naturalWidth": 644,
    "naturalHeight": 644,
    "x": 29,
    "y": 148,
    "width": 586,
    "height": 348
  },
  "/materials/jbl-bluetooth-speakers/2026/jbl-partybox-130-black.webp": {
    "naturalWidth": 644,
    "naturalHeight": 644,
    "x": 161,
    "y": 30,
    "width": 323,
    "height": 585
  },
  "/materials/jbl-bluetooth-speakers/2026/jbl-partybox-520-black.webp": {
    "naturalWidth": 644,
    "naturalHeight": 644,
    "x": 179,
    "y": 4,
    "width": 286,
    "height": 635
  },
  "/materials/jbl-bluetooth-speakers/2026/jbl-partybox-720-black.webp": {
    "naturalWidth": 644,
    "naturalHeight": 644,
    "x": 151,
    "y": 13,
    "width": 342,
    "height": 618
  },
  "/materials/jbl-bluetooth-speakers/2026/jbl-partybox-ultimate-black.webp": {
    "naturalWidth": 644,
    "naturalHeight": 644,
    "x": 151,
    "y": 0,
    "width": 342,
    "height": 644
  }
};

export function getProductImageFrame(imageUrl?: string): ProductImageFrame | undefined {
  if (!imageUrl) return undefined;
  return packshotFrames[imageUrl] ?? iphoneFrames.find(frame => imageUrl.startsWith(frame.prefix));
}
