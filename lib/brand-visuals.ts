type BrandVisual = {
  src: string;
  cardImageClassName?: string;
  headerImageClassName?: string;
};

const BRAND_VISUALS: Record<string, BrandVisual> = {
  apple: {
    src: "/brand-selection/apple.png",
    cardImageClassName: "object-contain p-6 sm:p-7",
    headerImageClassName: "object-contain p-5 sm:p-6"
  },
  dyson: {
    src: "/brand-selection/dyson.png",
    cardImageClassName: "object-contain p-1",
    headerImageClassName: "object-contain p-3"
  },
  garmin: {
    src: "/brand-selection/garmin.png",
    cardImageClassName: "object-contain p-1",
    headerImageClassName: "object-contain p-3"
  },
  marshall: {
    src: "/brand-selection/marshall.png",
    cardImageClassName: "object-contain p-1 sm:p-2",
    headerImageClassName: "object-contain p-2 sm:p-3"
  },
  jbl: {
    src: "/brand-selection/jbl.png",
    cardImageClassName: "object-contain p-1",
    headerImageClassName: "object-contain p-3"
  },
  playstation: {
    src: "/brand-selection/playstation.png",
    cardImageClassName: "object-contain p-2",
    headerImageClassName: "object-contain p-4"
  },
  cameras: {
    src: "/brand-selection/cameras.png",
    cardImageClassName: "object-contain p-3 sm:p-4",
    headerImageClassName: "object-contain p-4 sm:p-5"
  },
  smeg: {
    src: "/brand-selection/smeg.png",
    cardImageClassName: "object-contain p-1",
    headerImageClassName: "object-contain p-3"
  },
  harman: {
    src: "/logos/harman.svg",
    cardImageClassName: "object-contain p-1 sm:p-2",
    headerImageClassName: "object-contain p-2 sm:p-3"
  },
  whoop: {
    src: "/logos/whoop.svg",
    cardImageClassName: "object-contain p-2 sm:p-3",
    headerImageClassName: "object-contain p-3 sm:p-4"
  },
  "portable-power": {
    src: "/brand-selection/portable-power-old.png",
    cardImageClassName: "object-cover",
    headerImageClassName: "object-cover"
  }
};

export function getBrandVisual(slug: string, fallbackSrc: string): BrandVisual {
  return BRAND_VISUALS[slug] ?? {
    src: fallbackSrc || "/logos/apple.svg",
    cardImageClassName: "object-contain p-3",
    headerImageClassName: "object-contain p-4"
  };
}
