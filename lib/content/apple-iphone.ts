import type { ModuleCatalogProduct, ModuleContentBlock } from "../module-content";
import { parseLearningGuide } from "../learning-guide";
import iphoneLearningGuides from "../../content/learning-guides/iphone.json";

export const iphoneProductCatalog: ModuleCatalogProduct[] = [
  {
    slug: "iphone-1",
    title: "iPhone X (2017)",
    overview: ["Діагональ: 5.8″", "Кольори: Space Gray, Silver", "Пам’ять: 64 GB, 256 GB"],
    highlights: [
  "Super Retina HD",
  "True Tone",
  "Face ID",
  "A11 Bionic",
  "2 стереодинаміки",
  "Сталева рамка, скляний глянцевий корпус",
  "Основна камера 12 Мп + телефото",
  "Портретний режим",
  "Фронтальна камера TrueDepth",
  "IP67 (до 1 м на 30 хв)",
  "До 13 год відтворення відео за методикою Apple"
],
    colors: [
      { label: "Space Gray", imageUrl: "/materials/iphone/Color/X/SpaceGray-Photoroom.png", caption: "Колір: Space Gray", default: true },
      { label: "Silver", imageUrl: "/materials/iphone/Color/X/Silver-Photoroom.png", caption: "Колір: Silver" }
    ]
  },
  {
    slug: "iphone-2",
    title: "iPhone XS / iPhone XS Max (2018)",
    overview: ["Діагональ: XS — 5.8″; XS Max — 6.5″", "Кольори: Space Gray, Silver, Gold", "Пам’ять: 64 GB, 256 GB, 512 GB"],
    highlights: [
  "OLED Super Retina HD",
  "True Tone",
  "Face ID",
  "A12 Bionic",
  "2 стереодинаміки",
  "Сталева рамка, скляний глянцевий корпус",
  "Основна камера 12 Мп + телефото",
  "Портретний режим",
  "Фронтальна камера TrueDepth",
  "IP68 (до 2 м на 30 хв)",
  "Відтворення відео: XS — до 14 год; XS Max — до 15 год за методикою Apple"
],
    colors: [
      { label: "Space Gray", imageUrl: "/materials/iphone/Color/Xs_XsMax/SpaceGray-Photoroom.png", caption: "Колір: Space Gray", default: true },
      { label: "Silver", imageUrl: "/materials/iphone/Color/Xs_XsMax/Silver-Photoroom.png", caption: "Колір: Silver" },
      { label: "Gold", imageUrl: "/materials/iphone/Color/Xs_XsMax/Gold-Photoroom.png", caption: "Колір: Gold" }
    ]
  },
  {
    slug: "iphone-3",
    title: "iPhone XR (2018)",
    overview: ["Діагональ: 6.1″", "Кольори: Black, White, Red, Blue, Yellow, Coral", "Пам’ять: 64 GB, 128 GB, 256 GB"],
    highlights: [
      "IPS Liquid Retina HD 6.1″",
      "True Tone",
      "Face ID",
      "A12 Bionic",
      "2 стереодинаміки",
      "Алюмінієва рамка, скляний глянцевий корпус",
      "Основна камера 12 Мп",
      "Портретний режим (програмний)",
      "Фронтальна камера TrueDepth",
      "IP67 (до 1 м на 30 хв)",
      "До 16 год відтворення відео"
    ],
    colors: [
      { label: "Black", imageUrl: "/materials/iphone/Color/XR/Black-Photoroom.png", caption: "Колір: Black", default: true },
      { label: "White", imageUrl: "/materials/iphone/Color/XR/White-Photoroom.png", caption: "Колір: White" },
      { label: "Red", imageUrl: "/materials/iphone/Color/XR/Red-Photoroom.png", caption: "Колір: Red" },
      { label: "Blue", imageUrl: "/materials/iphone/Color/XR/Blue-Photoroom.png", caption: "Колір: Blue" },
      { label: "Yellow", imageUrl: "/materials/iphone/Color/XR/Yellow-Photoroom.png", caption: "Колір: Yellow" },
      { label: "Coral", imageUrl: "/materials/iphone/Color/XR/Corale-Photoroom.png", caption: "Колір: Coral" }
    ]
  },
  {
    slug: "iphone-4",
    title: "iPhone 11 (2019)",
    overview: ["Діагональ: 6.1″", "Пам’ять: 64 GB, 128 GB, 256 GB"],
    highlights: [
      "IPS Liquid Retina HD 6.1″",
      "True Tone",
      "Face ID",
      "A13 Bionic",
      "2 стереодинаміки",
      "Алюмінієва рамка, скляний глянцевий корпус",
      "Основна камера: 12 Мп + ультраширока 12 Мп",
      "Портретний режим",
      "Нічний режим",
      "Фронтальна камера TrueDepth",
      "IP68 (до 2 м на 30 хв)",
      "До 17 год відтворення відео"
    ],
    colors: [
      { label: "Black", imageUrl: "/materials/iphone/Color/11/Black-Photoroom.png", caption: "Колір: Black", default: true },
      { label: "White", imageUrl: "/materials/iphone/Color/11/iphone11-white-select-2019-1397x1397.jpg-Photoroom.png", caption: "Колір: White" },
      { label: "Yellow", imageUrl: "/materials/iphone/Color/11/Yellow-Photoroom.png", caption: "Колір: Yellow" },
      { label: "Red", imageUrl: "/materials/iphone/Color/11/Red-Photoroom.png", caption: "Колір: Red" },
      { label: "Purple", imageUrl: "/materials/iphone/Color/11/Purple-Photoroom.png", caption: "Колір: Purple" },
      { label: "Green", imageUrl: "/materials/iphone/Color/11/Green-Photoroom.png", caption: "Колір: Green" }
    ]
  },
  {
    slug: "iphone-5",
    title: "iPhone 11 Pro / iPhone 11 Pro Max (2019)",
    family: "Pro / Pro Max",
    overview: ["Діагональ: Pro — 5.8″; Pro Max — 6.5″", "Кольори: Space Gray, Silver, Gold, Midnight Green", "Пам’ять: 64 GB, 256 GB, 512 GB"],
    highlights: [
      "OLED Super Retina XDR",
      "True Tone",
      "Face ID",
      "A13 Bionic",
      "2 стереодинаміки",
      "Сталева рамка, скляний матовий корпус",
      "Потрійна камера 12 Мп (широка, ультраширока, телефото)",
      "Портретний режим",
      "Нічний режим",
      "Фронтальна камера TrueDepth",
      "IP68 (до 4 м на 30 хв у лабораторних умовах)"
    ],
    colors: [
      { label: "Space Gray", imageUrl: "/materials/iphone/Color/11Pro_ProMax/SpaceGray-Photoroom.png", caption: "Колір: Space Gray", default: true },
      { label: "Silver", imageUrl: "/materials/iphone/Color/11Pro_ProMax/Silver-Photoroom.png", caption: "Колір: Silver" },
      { label: "Gold", imageUrl: "/materials/iphone/Color/11Pro_ProMax/Gold-Photoroom.png", caption: "Колір: Gold" },
      { label: "Midnight Green", imageUrl: "/materials/iphone/Color/11Pro_ProMax/green-Photoroom.png", caption: "Колір: Midnight Green" }
    ]
  },
  {
    slug: "iphone-6",
    title: "iPhone SE 2-го покоління (2020)",
    overview: ["Діагональ: 4.7″", "Кольори: Black, White, Red", "Пам’ять: 64 GB, 128 GB, 256 GB"],
    highlights: [
  "IPS Retina 4.7″",
  "True Tone",
  "Touch ID",
  "A13 Bionic",
  "2 стереодинаміки",
  "Алюмінієва рамка, скляний глянцевий корпус",
  "Основна камера 12 Мп",
  "Фронтальна камера 7 Мп",
  "Портретний режим (програмний)",
  "IP67 (до 1 м на 30 хв)",
  "До 13 год відтворення відео за методикою Apple"
],
    colors: [
      { label: "Black", imageUrl: "/materials/iphone/Color/SE2020/Black-Photoroom.png", caption: "Колір: Black", default: true },
      { label: "White", imageUrl: "/materials/iphone/Color/SE2020/White-Photoroom.png", caption: "Колір: White" },
      { label: "Red", imageUrl: "/materials/iphone/Color/SE2020/red-Photoroom.png", caption: "Колір: Red" }
    ]
  },
  {
    slug: "iphone-7",
    title: "iPhone SE 3-го покоління (2022)",
    overview: ["Діагональ: 4.7″", "Кольори: Midnight, Starlight, Red", "Пам’ять: 64 GB, 128 GB, 256 GB"],
    highlights: [
      "IPS Retina 4.7″",
      "True Tone",
      "Touch ID",
      "A15 Bionic",
      "2 стереодинаміки",
      "Алюмінієва рамка, скляний глянцевий корпус",
      "Основна камера 12 Мп",
      "Фронтальна камера 7 Мп",
      "Портретний режим (програмний)",
      "IP67 (до 1 м на 30 хв)",
      "До 15 год відтворення відео"
    ],
    colors: [
      { label: "Midnight", imageUrl: "/materials/iphone/Color/SE2022/Midnight.png", caption: "Колір: Midnight", default: true },
      { label: "Starlight", imageUrl: "/materials/iphone/Color/SE2022/white.png", caption: "Колір: Starlight" },
      { label: "Red", imageUrl: "/materials/iphone/Color/SE2022/Red.png", caption: "Колір: Red" }
    ]
  },
  {
    slug: "iphone-8",
    title: "iPhone 12 mini / iPhone 12 (2020)",
    overview: ["Діагональ: Mini — 5.4″; 12 — 6.1″", "Кольори: Black, White, Blue, Red, Purple, Green", "Пам’ять: 64 GB, 128 GB, 256 GB"],
    highlights: [
      "OLED Super Retina XDR",
      "True Tone",
      "Face ID",
      "MagSafe",
      "A14 Bionic",
      "2 стереодинаміки",
      "Алюмінієва рамка",
      "Основна камера: 12 Мп + ультраширока 12 Мп",
      "Портретний режим",
      "Нічний режим",
      "Фронтальна камера TrueDepth",
      "Ceramic Shield",
      "IP68 (до 6 м на 30 хв)"
    ],
    colors: [
      { label: "Black", imageUrl: "/materials/iphone/Color/12/Black-Photoroom.png", caption: "Колір: Black", default: true },
      { label: "White", imageUrl: "/materials/iphone/Color/12/White-Photoroom.png", caption: "Колір: White" },
      { label: "Blue", imageUrl: "/materials/iphone/Color/12/Blue-Photoroom.png", caption: "Колір: Blue" },
      { label: "Red", imageUrl: "/materials/iphone/Color/12/Red-Photoroom.png", caption: "Колір: Red" },
      { label: "Purple", imageUrl: "/materials/iphone/Color/12/Purple-Photoroom.png", caption: "Колір: Purple" },
      { label: "Green", imageUrl: "/materials/iphone/Color/12/Green-Photoroom%20(1).png", caption: "Колір: Green" }
    ]
  },
  {
    slug: "iphone-9",
    title: "iPhone 12 Pro / iPhone 12 Pro Max (2020)",
    family: "Pro / Pro Max",
    overview: ["Діагональ: Pro — 6.1″; Pro Max — 6.7″", "Кольори: Graphite, Silver, Gold, Pacific Blue", "Пам’ять: 128 GB, 256 GB, 512 GB"],
    highlights: [
      "OLED Super Retina XDR",
      "True Tone",
      "Face ID",
      "MagSafe",
      "A14 Bionic",
      "2 стереодинаміки",
      "Сталева рамка, матовий корпус",
      "Потрійна камера 12 Мп (широка, ультраширока, телефото) + LiDAR",
      "Портретний режим",
      "Нічний режим",
      "Фронтальна камера TrueDepth",
      "Ceramic Shield",
      "IP68 (до 6 м на 30 хв)"
    ],
    colors: [
      { label: "Graphite", imageUrl: "/materials/iphone/Color/12Pro_ProMax/Graphite-Photoroom.png", caption: "Колір: Graphite", default: true },
      { label: "Silver", imageUrl: "/materials/iphone/Color/12Pro_ProMax/silver-Photoroom%20(1).png", caption: "Колір: Silver" },
      { label: "Gold", imageUrl: "/materials/iphone/Color/12Pro_ProMax/Gold-Photoroom.png", caption: "Колір: Gold" },
      { label: "Pacific Blue", imageUrl: "/materials/iphone/Color/12Pro_ProMax/PacificBlue-Photoroom.png", caption: "Колір: Pacific Blue" }
    ]
  },
  {
    slug: "iphone-10",
    title: "iPhone 13 mini / iPhone 13 (2021)",
    overview: ["Діагональ: Mini — 5.4″; 13 — 6.1″", "Кольори: Starlight, Midnight, Blue, Pink, Red, Green", "Пам’ять: 128 GB, 256 GB, 512 GB"],
    highlights: [
  "OLED Super Retina XDR",
  "True Tone",
  "Face ID",
  "MagSafe",
  "A15 Bionic",
  "2 стереодинаміки",
  "Алюмінієва рамка",
  "Основна камера: 12 Мп + ультраширока 12 Мп",
  "Портретний режим",
  "Нічний режим",
  "Кінематографічний режим",
  "Фронтальна камера TrueDepth",
  "Ceramic Shield",
  "IP68 (до 6 м на 30 хв)"
],
    colors: [
      { label: "Starlight", imageUrl: "/materials/iphone/Color/13/Starlight-Photoroom.png", caption: "Колір: Starlight", default: true },
      { label: "Midnight", imageUrl: "/materials/iphone/Color/13/Midnight-Photoroom.png", caption: "Колір: Midnight" },
      { label: "Blue", imageUrl: "/materials/iphone/Color/13/Blue-Photoroom.png", caption: "Колір: Blue" },
      { label: "Pink", imageUrl: "/materials/iphone/Color/13/Pink-Photoroom.png", caption: "Колір: Pink" },
      { label: "Red", imageUrl: "/materials/iphone/Color/13/Red-Photoroom.png", caption: "Колір: Red" },
      { label: "Green", imageUrl: "/materials/iphone/Color/13/Green-Photoroom.png", caption: "Колір: Green" }
    ]
  },
  {
    slug: "iphone-11",
    title: "iPhone 13 Pro / iPhone 13 Pro Max (2021)",
    family: "Pro / Pro Max",
    overview: ["Діагональ: Pro — 6.1″; Pro Max — 6.7″", "Кольори: Graphite, Silver, Gold, Sierra Blue, Alpine Green", "Пам’ять: 128 GB, 256 GB, 512 GB, 1 TB"],
    highlights: [
      "OLED Super Retina XDR з ProMotion",
      "True Tone",
      "Face ID",
      "MagSafe",
      "A15 Bionic",
      "Сталева рамка",
      "Потрійна камера 12 Мп (широка, ультраширока, телефото) + LiDAR",
      "Портретний режим",
      "Нічний режим",
      "Кінематографічний режим",
      "Фронтальна камера TrueDepth",
      "Ceramic Shield",
      "IP68 (до 6 м на 30 хв)"
    ],
    colors: [
      { label: "Graphite", imageUrl: "/materials/iphone/Color/13Pro_ProMax/Graphite-Photoroom%20(1).png", caption: "Колір: Graphite", default: true },
      { label: "Silver", imageUrl: "/materials/iphone/Color/13Pro_ProMax/SIlver-Photoroom.png", caption: "Колір: Silver" },
      { label: "Gold", imageUrl: "/materials/iphone/Color/13Pro_ProMax/GOld-Photoroom%20(1).png", caption: "Колір: Gold" },
      { label: "Sierra Blue", imageUrl: "/materials/iphone/Color/13Pro_ProMax/SierraBlue-Photoroom.png", caption: "Колір: Sierra Blue" },
      { label: "Alpine Green", imageUrl: "/materials/iphone/Color/13Pro_ProMax/MidnightGreen-Photoroom.png", caption: "Колір: Alpine Green" }
    ]
  },
  {
    slug: "iphone-12",
    title: "iPhone 14 / iPhone 14 Plus (2022)",
    overview: ["Діагональ: 14 — 6.1″; 14 Plus — 6.7″", "Кольори: Starlight, Midnight, Blue, Purple, Red, Yellow", "Пам’ять: 128 GB, 256 GB, 512 GB"],
    highlights: [
      "OLED Super Retina XDR",
      "True Tone",
      "Face ID",
      "A15 Bionic (5-ядерний GPU)",
      "2 стереодинаміки",
      "Алюмінієва рамка, скляний глянцевий корпус",
      "MagSafe",
      "Основна камера: 12 Мп + ультраширока 12 Мп",
      "Dolby Vision відео",
      "Портретний режим, нічний режим",
      "Режим «Швидкий рух»",
      "Фронтальна камера TrueDepth з автофокусом",
      "Photonic Engine",
      "Ceramic Shield",
      "IP68 (до 6 м на 30 хв)"
    ],
    colors: [
      { label: "Starlight", imageUrl: "/materials/iphone/Color/14/Starlight-Photoroom.png", caption: "Колір: Starlight", default: true },
      { label: "Midnight", imageUrl: "/materials/iphone/Color/14/Midnight-Photoroom.png", caption: "Колір: Midnight" },
      { label: "Blue", imageUrl: "/materials/iphone/Color/14/Blue-Photoroom.png", caption: "Колір: Blue" },
      { label: "Purple", imageUrl: "/materials/iphone/Color/14/Purple-Photoroom.png", caption: "Колір: Purple" },
      { label: "Red", imageUrl: "/materials/iphone/Color/14/Red-Photoroom.png", caption: "Колір: Red" },
      { label: "Yellow", imageUrl: "/materials/iphone/Color/14/Yellow-Photoroom.png", caption: "Колір: Yellow" }
    ]
  },
  {
    slug: "iphone-13",
    title: "iPhone 14 Pro / iPhone 14 Pro Max (2022)",
    family: "Pro / Pro Max",
    overview: ["Діагональ: Pro — 6.1″; Pro Max — 6.7″", "Кольори: Space Black, Silver, Gold, Deep Purple", "Пам’ять: 128 GB, 256 GB, 512 GB, 1 TB"],
    highlights: [
      "OLED Super Retina XDR з ProMotion",
      "True Tone",
      "Always‑On Display",
      "Dynamic Island",
      "Face ID",
      "A16 Bionic",
      "2 стереодинаміки",
      "Сталева рамка, матовий корпус",
      "MagSafe",
      "Основна камера: 48 Мп + ультраширока 12 Мп + телефото 12 Мп",
      "LiDAR",
      "Портретний режим",
      "Нічний режим",
      "Dolby Vision",
      "Режим «Швидкий рух»",
      "Фронтальна камера TrueDepth з автофокусом",
      "Photonic Engine",
      "Ceramic Shield"
    ],
    colors: [
      { label: "Space Black", imageUrl: "/materials/iphone/Color/14Pro_ProMax/SpaceBlack-Photoroom.png", caption: "Колір: Space Black", default: true },
      { label: "Silver", imageUrl: "/materials/iphone/Color/14Pro_ProMax/Silver-Photoroom.png", caption: "Колір: Silver" },
      { label: "Gold", imageUrl: "/materials/iphone/Color/14Pro_ProMax/Gold-Photoroom.png", caption: "Колір: Gold" },
      { label: "Deep Purple", imageUrl: "/materials/iphone/Color/14Pro_ProMax/DeepPurple-Photoroom.png", caption: "Колір: Deep Purple" }
    ]
  },
  {
    slug: "iphone-14",
    title: "iPhone 15 / iPhone 15 Plus (2023)",
    overview: ["Діагональ: 15 — 6.1″; 15 Plus — 6.7″", "Кольори: Black, Blue, Green, Yellow, Pink", "Пам’ять: 128 GB, 256 GB, 512 GB"],
    highlights: [
  "OLED Super Retina XDR",
  "True Tone",
  "Dynamic Island",
  "Face ID",
  "A16 Bionic",
  "2 стереодинаміки",
  "Алюмінієва рамка, матовий корпус",
  "MagSafe",
  "Основна камера: 48 Мп + ультраширока 12 Мп, наближення 2× оптичної якості з основного сенсора",
  "Портрети нового покоління",
  "Нічний режим",
  "Dolby Vision",
  "Режим «Швидкий рух»",
  "Фронтальна камера TrueDepth з автофокусом",
  "Photonic Engine",
  "Ceramic Shield",
  "IP68 (до 6 м на 30 хв)",
  "USB‑C"
],
    colors: [
      { label: "Black", imageUrl: "/materials/iphone/Color/15/Black-Photoroom.png", caption: "Колір: Black", default: true },
      { label: "Blue", imageUrl: "/materials/iphone/Color/15/Blue-Photoroom.png", caption: "Колір: Blue" },
      { label: "Green", imageUrl: "/materials/iphone/Color/15/Green-Photoroom.png", caption: "Колір: Green" },
      { label: "Yellow", imageUrl: "/materials/iphone/Color/15/Yellow-Photoroom.png", caption: "Колір: Yellow" },
      { label: "Pink", imageUrl: "/materials/iphone/Color/15/Pink-Photoroom.png", caption: "Колір: Pink" }
    ]
  },
  {
    slug: "iphone-15",
    title: "iPhone 15 Pro / iPhone 15 Pro Max (2023)",
    family: "Pro / Pro Max",
    overview: ["Діагональ: Pro — 6.1″; Pro Max — 6.7″", "Кольори: Black Titanium, White Titanium, Blue Titanium, Natural Titanium", "Пам’ять: Pro — 128/256/512 GB, 1 TB; Pro Max — 256/512 GB, 1 TB"],
    highlights: [
  "OLED Super Retina XDR з ProMotion",
  "True Tone",
  "Always‑On Display",
  "Dynamic Island",
  "Face ID",
  "A17 Pro",
  "Титанові рамки",
  "Action Button",
  "MagSafe",
  "Основна камера: 48 Мп + ультраширока 12 Мп + телефото 12 Мп (до 3 х Pro / 5 х Pro Max)",
  "LiDAR",
  "Портрети нового покоління",
  "Нічний режим",
  "Dolby Vision",
  "Режим «Швидкий рух»",
  "Фронтальна камера TrueDepth з автофокусом",
  "Photonic Engine",
  "Ceramic Shield",
  "IP68",
  "Відтворення відео: Pro — до 23 год; Pro Max — до 29 год за методикою Apple",
  "USB‑C"
],
    colors: [
      { label: "Black Titanium", imageUrl: "/materials/iphone/Color/15Pro_ProMax/Black-Photoroom%20(1).png", caption: "Колір: Black Titanium", default: true },
      { label: "White Titanium", imageUrl: "/materials/iphone/Color/15Pro_ProMax/White-Photoroom.png", caption: "Колір: White Titanium" },
      { label: "Blue Titanium", imageUrl: "/materials/iphone/Color/15Pro_ProMax/BLue-Photoroom%20(1).png", caption: "Колір: Blue Titanium" },
      { label: "Natural Titanium", imageUrl: "/materials/iphone/Color/15Pro_ProMax/Natural-Photoroom.png", caption: "Колір: Natural Titanium" }
    ]
  },
  {
    slug: "iphone-16",
    title: "iPhone 16 / iPhone 16 Plus (2024)",
    overview: ["Діагональ: 16 — 6.1″; 16 Plus — 6.7″", "Кольори: Black, White, Teal, Ultramarine, Pink", "Пам’ять: 128 GB, 256 GB, 512 GB"],
    highlights: [
  "OLED Super Retina XDR",
  "True Tone, Dynamic Island",
  "Face ID, A18",
  "2 стереодинаміки, алюмінієва рамка",
  "MagSafe, кнопка дії та Camera Control",
  "Основна камера: 48 Мп + ультраширока 12 Мп, наближення 2× оптичної якості з основного сенсора",
  "Портрети нового покоління, нічний режим",
  "Dolby Vision",
  "Режим «Швидкий рух»",
  "Фронтальна камера TrueDepth з автофокусом",
  "Photonic Engine",
  "Ceramic Shield",
  "IP68",
  "USB‑C"
],
    colors: [
      { label: "Black", imageUrl: "/materials/iphone/Color/16/Black-Photoroom%20(1).png", caption: "Колір: Black", default: true },
      { label: "White", imageUrl: "/materials/iphone/Color/16/White-Photoroom%20(1).png", caption: "Колір: White" },
      { label: "Teal", imageUrl: "/materials/iphone/Color/16/Teal-Photoroom.png", caption: "Колір: Teal" },
      { label: "Ultramarine", imageUrl: "/materials/iphone/Color/16/Ultramarine-Photoroom.png", caption: "Колір: Ultramarine" },
      { label: "Pink", imageUrl: "/materials/iphone/Color/16/Pink-Photoroom.png", caption: "Колір: Pink" }
    ]
  },
  {
    slug: "iphone-17",
    title: "iPhone 16 Pro / iPhone 16 Pro Max (2024)",
    family: "Pro / Pro Max",
    overview: ["Діагональ: Pro — 6.3″; Pro Max — 6.9″", "Кольори: Black Titanium, White Titanium, Desert Titanium, Natural Titanium", "Пам’ять: Pro — 128/256/512 GB, 1 TB; Pro Max — 256/512 GB, 1 TB"],
    highlights: [
      "OLED Super Retina XDR з ProMotion",
      "True Tone",
      "Always‑On Display",
      "Dynamic Island",
      "Face ID",
      "A18 Pro",
      "2 стереодинаміки",
      "Титанові рамки",
      "Кнопка дії та Camera Control",
      "MagSafe",
      "Камери: основна 48 Мп Fusion + ультраширока 48 Мп + телефото 12 Мп з оптичним наближенням 5×",
      "LiDAR",
      "Портрети нового покоління",
      "Нічний режим",
      "Dolby Vision",
      "Режим «Швидкий рух»",
      "Фронтальна камера TrueDepth з автофокусом",
      "Photonic Engine",
      "Ceramic Shield",
      "IP68",
      "Відтворення відео: Pro — до 27 год; Pro Max — до 33 год за методикою Apple",
      "USB‑C"
    ],
    colors: [
      { label: "Black Titanium", imageUrl: "/materials/iphone/Color/16Pro_ProMax/Black-Photoroom.png", caption: "Колір: Black Titanium", default: true },
      { label: "White Titanium", imageUrl: "/materials/iphone/Color/16Pro_ProMax/White-Photoroom.png", caption: "Колір: White Titanium" },
      { label: "Desert Titanium", imageUrl: "/materials/iphone/Color/16Pro_ProMax/Desert-Photoroom.png", caption: "Колір: Desert Titanium" },
      { label: "Natural Titanium", imageUrl: "/materials/iphone/Color/16Pro_ProMax/Natural-Photoroom.png", caption: "Колір: Natural Titanium" }
    ]
  },
  {
    slug: "iphone-18",
    title: "iPhone 16e (2025)",
    overview: ["Кольори: Black, White", "Пам’ять: 128 GB, 256 GB, 512 GB"],
    highlights: [
      "OLED Super Retina XDR 6.1″ (2532×1170, 460 ppi)",
      "HDR10, Dolby Vision, True Tone",
      "Apple A18 (4‑ядерний GPU)",
      "Основна камера: 48 Мп Fusion f/1.6 з OIS",
      "Фронтальна камера: 12 Мп TrueDepth f/1.9 з автофокусом",
      "Photonic Engine, Deep Fusion, Photographic Styles, Night Mode",
      "До 26 год відео, до 90 год аудіо",
      "Qi бездротова зарядка до 7.5 Вт",
      "IP68",
      "Action Button",
      "USB‑C",
      "Без MagSafe",
      "Підтримка Apple Intelligence; доступність функцій залежить від мови та регіону"
    ],
    colors: [
      { label: "Black", imageUrl: "/materials/iphone/Color/16e/Black-Photoroom.png", caption: "Колір: Black", default: true },
      { label: "White", imageUrl: "/materials/iphone/Color/16e/White-Photoroom.png", caption: "Колір: White" }
    ]
  },
  {
    slug: "iphone-19",
    title: "iPhone 17 Pro / iPhone 17 Pro Max (2025)",
    family: "Pro / Pro Max",
    overview: ["Діагональ: Pro — 6.3″; Pro Max — 6.9″", "Кольори: Silver, Cosmic Orange, Deep Blue", "Пам’ять: Pro — 256/512 GB, 1 TB; Pro Max — 256/512 GB, 1 TB, 2 TB"],
    highlights: [
      "OLED Super Retina XDR з ProMotion до 120 Гц, до 3000 ніт на сонці",
      "True Tone, Always‑On Display, Dynamic Island",
      "Face ID, A19 Pro",
      "2 стереодинаміки, алюмінієвий unibody корпус",
      "Action Button, MagSafe",
      "Камери: три модулі по 48 Мп; телефото 4× та 8× оптичної якості, цифрове наближення до 40×",
      "LiDAR, портрети нового покоління, нічний режим",
      "Dolby Vision, «Швидкий рух»",
      "Фронтальна камера: 18 Мп Center Stage з автофокусом",
      "Photonic Engine, Ceramic Shield 2",
      "IP68, USB‑C",
      "Відтворення відео: Pro — до 33 год; Pro Max — до 39 год у версіях eSIM за методикою Apple; інші регіональні версії можуть відрізнятися"
    ],
    colors: [
      { label: "Silver", imageUrl: "/materials/iphone/Color/17Pro_ProMax/Silver-Photoroom.png", caption: "Колір: Silver", default: true },
      { label: "Cosmic Orange", imageUrl: "/materials/iphone/Color/17Pro_ProMax/Orange-Photoroom.png", caption: "Колір: Cosmic Orange" },
      { label: "Deep Blue", imageUrl: "/materials/iphone/Color/17Pro_ProMax/DeepBlue-Photoroom.png", caption: "Колір: Deep Blue" }
    ]
  },
  {
    slug: "iphone-20",
    title: "iPhone Air (2025)",
    family: "Air",
    summary: "Для тих, хто обирає тонкий і легкий корпус. Під час порівняння враховуйте одну основну камеру та роботу лише з eSIM.",
    overview: ["Діагональ: 6.5″", "Кольори: Space Black, Cloud White, Light Gold, Sky Blue", "Пам’ять: 256/512 GB, 1 TB"],
    highlights: [
      "OLED Super Retina XDR з ProMotion до 120 Гц",
      "True Tone",
      "Always‑On Display",
      "Dynamic Island",
      "Face ID, A19 Pro",
      "Один вбудований динамік",
      "Титановий корпус: товщина 5,64 мм, маса 165 г",
      "MagSafe",
      "Основна камера: 48 Мп Fusion (цифровий зум до 10х)",
      "Портрети нового покоління, нічний режим",
      "Dolby Vision, «Швидкий рух»",
      "Фронтальна камера: 18 Мп Center Stage з автофокусом",
      "Photonic Engine",
      "Ceramic Shield 2 (передня панель), Ceramic Shield (задня)",
      "IP68",
      "До 27 год відтворення відео за методикою Apple",
      "USB‑C, лише eSIM"
    ],
    colors: [
      { label: "Space Black", imageUrl: "/materials/iphone/Color/17Air/Black-Photoroom%20(1).png", caption: "Колір: Space Black", default: true },
      { label: "Cloud White", imageUrl: "/materials/iphone/Color/17Air/White-Photoroom%20(1).png", caption: "Колір: Cloud White" },
      { label: "Light Gold", imageUrl: "/materials/iphone/Color/17Air/LightGold-Photoroom.png", caption: "Колір: Light Gold" },
      { label: "Sky Blue", imageUrl: "/materials/iphone/Color/17Air/SkyBlue-Photoroom.png", caption: "Колір: Sky Blue" }
    ]
  },
  {
    slug: "iphone-21",
    title: "iPhone 17 (2025)",
    overview: ["Діагональ: 6.3″", "Кольори: Lavender, Sage, Mist Blue, Black, White", "Пам’ять: 256/512 GB"],
    highlights: [
      "OLED Super Retina XDR з ProMotion до 120 Гц, HDR10, до 3000 ніт на сонці",
      "True Tone",
      "Always‑On Display",
      "Dynamic Island",
      "Face ID",
      "A19",
      "2 стереодинаміки",
      "Алюмінієвий корпус",
      "Action Button",
      "MagSafe; 48 Мп Fusion Main + 48 Мп Ultra Wide",
      "Портрети нового покоління",
      "Нічний режим",
      "Dolby Vision",
      "«Швидкий рух»",
      "Фронтальна камера 18 Мп Center Stage з автофокусом",
      "Photonic Engine",
      "Ceramic Shield 2 спереду, скляна задня панель",
      "IP68",
      "До 30 год відео",
      "USB‑C"
    ],
    colors: [
      { label: "Lavender", imageUrl: "/materials/iphone/Color/17/Lavander-Photoroom.png", caption: "Колір: Lavender", default: true },
      { label: "Sage", imageUrl: "/materials/iphone/Color/17/Sage-Photoroom.png", caption: "Колір: Sage" },
      { label: "Mist Blue", imageUrl: "/materials/iphone/Color/17/MistBlue-Photoroom.png", caption: "Колір: Mist Blue" },
      { label: "Black", imageUrl: "/materials/iphone/Color/17/Black-Photoroom.png", caption: "Колір: Black" },
      { label: "White", imageUrl: "/materials/iphone/Color/17/White-Photoroom.png", caption: "Колір: White" }
    ]
  },
  {
    slug: "iphone-22",
    title: "iPhone 18 Pro / iPhone 18 Pro Max (2026)",
    family: "Pro / Pro Max",
    overview: [
      "Діагональ: Pro — 6,3″; Pro Max — 6,9″",
      "Кольори: Black, Silver, Glacier, Burgundy",
      "Пам’ять: 256/512 GB, 1 TB, 2 TB"
    ],
    highlights: [
      "OLED Super Retina XDR з ProMotion до 120 Гц, до 3000 ніт на сонці",
      "True Tone, Always-On Display, Dynamic Island",
      "Face ID, A20 Pro",
      "Стереодинаміки, алюмінієвий корпус",
      "Кнопка дії, Camera Control, MagSafe",
      "Камери: три модулі по 48 Мп; основна зі змінною діафрагмою; телефото 4× та 8× оптичної якості",
      "LiDAR, портрети нового покоління, нічний режим",
      "Dolby Vision, ProRAW, ProRes, Apple Log 2",
      "Фронтальна камера: 18 Мп Center Stage з автофокусом",
      "Photonic Engine, Ceramic Shield 2",
      "IP68, USB-C (USB 3)",
      "Відтворення відео: Pro — до 36 год; Pro Max — до 45 год у версіях eSIM за методикою Apple"
    ],
    colors: [
      { label: "Black", imageUrl: "/materials/iphone/2026/18-pro/black.png", caption: "Чорний. На фото — iPhone 18 Pro", default: true },
      { label: "Silver", imageUrl: "/materials/iphone/2026/18-pro/silver.png", caption: "Сріблястий. На фото — iPhone 18 Pro" },
      { label: "Glacier", imageUrl: "/materials/iphone/2026/18-pro/glacier.png", caption: "Льодовиковий. На фото — iPhone 18 Pro" },
      { label: "Burgundy", imageUrl: "/materials/iphone/2026/18-pro/burgundy.png", caption: "Бордовий. На фото — iPhone 18 Pro" }
    ]
  },
  {
    slug: "iphone-23",
    title: "iPhone Duo (2026)",
    family: "Duo",
    overview: [
      "Діагональ: внутрішній екран — 7,6″; зовнішній — 5,4″",
      "Кольори: Night Sky, Star White",
      "Пам’ять: 256/512 GB, 1 TB, 2 TB"
    ],
    highlights: [
      "Два OLED-дисплеї Super Retina XDR з ProMotion до 120 Гц",
      "True Tone, Always-On Display",
      "Dynamic Island",
      "Touch ID у бічній кнопці",
      "A20 Pro",
      "Титановий складаний корпус",
      "Два застосунки поруч — Split View",
      "Camera Control",
      "MagSafe та Qi2 до 25 Вт",
      "Камери: основна 48 Мп Fusion + ультраширока 48 Мп; наближення 2× оптичної якості",
      "Портрети нового покоління, нічний режим",
      "Dolby Vision до 4K 120 кадрів/с на основній камері",
      "Зовнішня фронтальна камера: 12 Мп Center Stage; внутрішня FaceTime — під екраном",
      "Ceramic Shield 2 спереду, Ceramic Shield ззаду",
      "IP68",
      "До 44 год відео на зовнішньому або до 31 год на внутрішньому екрані за методикою Apple",
      "USB-C, лише eSIM"
    ],
    colors: [
      { label: "Night Sky", imageUrl: "/materials/iphone/2026/duo/iphone-duo-night-sky.png", caption: "Темно-синій", default: true },
      { label: "Star White", imageUrl: "/materials/iphone/2026/duo/iphone-duo-star-white.png", caption: "Зоряний білий" }
    ]
  },
  {
    slug: "iphone-24",
    title: "iPhone 17e (2026)",
    family: "SE / e",
    overview: [
      "Діагональ: 6,1″",
      "Кольори: Black, White, Soft Pink",
      "Пам’ять: 256/512 GB"
    ],
    highlights: [
      "OLED Super Retina XDR (2532×1170, 460 ppi)",
      "Dolby Vision, True Tone",
      "A19 (4-ядерний GPU)",
      "Основна камера: 48 Мп Fusion з оптичною стабілізацією",
      "Наближення 2× оптичної якості",
      "Фронтальна камера: 12 Мп TrueDepth з автофокусом",
      "Face ID, кнопка дії",
      "Photonic Engine, Deep Fusion, нічний режим",
      "MagSafe та Qi2 до 15 Вт",
      "Ceramic Shield 2 спереду, скляна задня панель",
      "IP68",
      "До 26 год відтворення відео за методикою Apple",
      "USB-C (USB 2)",
      "Apple Intelligence; доступність залежить від мови та регіону"
    ],
    colors: [
      { label: "Black", imageUrl: "/materials/iphone/2026/17e/black.png", caption: "Чорний", default: true },
      { label: "White", imageUrl: "/materials/iphone/2026/17e/white.png", caption: "Білий" },
      { label: "Soft Pink", imageUrl: "/materials/iphone/2026/17e/soft-pink.png", caption: "Ніжно-рожевий" }
    ]
  }
];

export const iphoneFoundationBlocks: ModuleContentBlock[] = [
  {
    learningGuide: parseLearningGuide(iphoneLearningGuides["1"], 1) ?? undefined,
    type: "text",
    title: "Apple iPhone",
    html: `
      <p>Мета цього модуля — навчитися добирати iPhone під потреби покупця й пояснювати відмінності моделей зрозумілими словами.</p>
      <h4>Після навчання ви зможете</h4>
      <ul>
        <li>Зіставити бюджет, розмір екрана, камери й автономність із конкретним сценарієм користування.</li>
        <li>Відрізнити лінійки Pro, Pro Max, Air, Duo, e та попередні покоління.</li>
        <li>Перевірити стан вживаного пристрою, блокування й сумісність SIM.</li>
        <li>Пояснити користь технологій без зайвих термінів і непідтверджених обіцянок.</li>
      </ul>
      <p><strong>Порядок навчання:</strong> стан пристрою → вибір лінійки → регіональна версія → перевірка → демонстрація переваг.</p>
    `
  },
  {
    type: "text",
    title: "Вживана техніка Apple",
    html: `
      <p>Вживаний iPhone обирають за поєднанням можливостей, стану та ціни. Однакова назва моделі не означає однаковий стан двох пристроїв.</p>
      <h4>Передпродажна перевірка</h4>
      <ol>
        <li><strong>Власність і активація.</strong> Попередній власник має вилучити пристрій зі свого облікового запису Apple. Не приймайте iPhone з блокуванням активації.</li>
        <li><strong>Корпус і функції.</strong> Перевірте дисплей, дотики, камери, мікрофони, динаміки, кнопки, заряджання та розпізнавання обличчя або відбитка пальця.</li>
        <li><strong>Акумулятор і ремонт.</strong> Перегляньте стан акумулятора та історію деталей і обслуговування, якщо модель їх показує. Поясніть покупцю відомі заміни й повідомлення системи.</li>
        <li><strong>Зв’язок.</strong> Перевірте Wi-Fi, мобільну мережу та відсутність обмеження оператора.</li>
      </ol>
      <p><strong>У консультації:</strong> покажіть результати перевірки, назвіть помітні дефекти й поясніть умови гарантії саме магазину. Ємність акумулятора у відсотках не дорівнює кількості годин роботи.</p>
      <p>Детальніше: <a href="https://support.apple.com/en-us/104999" target="_blank" rel="noopener noreferrer">рекомендації Apple щодо вживаного iPhone</a>.</p>
    `
  },
  {
    type: "text",
    title: "Нова техніка Apple",
    html: `
      <p>Консультацію починайте з потреб покупця. Новіша або дорожча модель має сенс тоді, коли її переваги потрібні в щоденному користуванні.</p>
      <h4>П’ять запитань перед вибором</h4>
      <ol>
        <li>Який бюджет і яким смартфоном людина користується зараз?</li>
        <li>Що важливіше: компактність, великий екран чи мінімальна маса?</li>
        <li>Для чого потрібні камери: сімейні фото, портрети, наближення чи професійне відео?</li>
        <li>Скільки пам’яті вже зайнято та чи потрібне перенесення даних?</li>
        <li>Яка SIM-картка й аксесуари використовуються зараз?</li>
      </ol>
      <p><strong>Перед оплатою:</strong> узгодьте модель, пам’ять, колір, регіональну версію, комплектацію, сумісний зарядний пристрій та конкретні умови гарантії. Дату анонсу або старту продажів Apple не прирівнюйте до наявності в магазині.</p>
    `
  },
  {
    type: "text",
    title: "Лінійки iPhone",
    html: `
      <table>
        <thead><tr><th>Лінійка</th><th>Для якого сценарію</th><th>Що порівняти</th></tr></thead>
        <tbody>
          <tr><td><strong>Базова / Plus</strong></td><td>Щоденні справи, фото й спілкування.</td><td>Plus — більший екран у відповідних поколіннях. Базовий iPhone 17 уже має ProMotion.</td></tr>
          <tr><td><strong>Pro / Pro Max</strong></td><td>Наближення, складніша зйомка, ігри й робота з відео.</td><td>Камери, формати запису, розмір і маса. Pro Max зазвичай працює довше, але камери порівнюйте за конкретним поколінням.</td></tr>
          <tr><td><strong>Air</strong></td><td>Тонкий і легкий смартфон із великим екраном.</td><td>iPhone Air має одну задню камеру та працює лише з eSIM.</td></tr>
          <tr><td><strong>Duo</strong></td><td>Робота з програмами поруч, читання й перегляд на розкладеному екрані.</td><td>Складаний формат, Touch ID, eSIM та відсутність окремого телефото. Не плутайте з позначенням Dual SIM.</td></tr>
          <tr><td><strong>SE / e</strong></td><td>Нижчий бюджет і основні можливості iPhone.</td><td>SE має кнопку «Початок» із Touch ID; моделі e — Face ID. iPhone 16e не має MagSafe, а iPhone 17e має.</td></tr>
          <tr><td><strong>mini</strong></td><td>Насамперед компактність і користування однією рукою.</td><td>Лінійка представлена iPhone 12 mini та 13 mini. Перевіряйте стан акумулятора й підтримувану версію iOS.</td></tr>
        </tbody>
      </table>
      <p><strong>Приклад пояснення:</strong> «Вам потрібне наближення на концертах — порівняймо телефото конкретних Pro-моделей. Якщо головне — легкість у руці, окремо спробуйте Air».</p>
    `
  },
  {
    type: "text",
    title: "Версії iPhone за ринками",
    html: `
      <p>Торгова назва «Global» не є єдиною технічною конфігурацією Apple. Тип SIM залежить від моделі та ринку, для якого виготовлено пристрій.</p>
      <h4>Основні варіанти</h4>
      <ul>
        <li><strong>nano-SIM + eSIM:</strong> поширена комбінація у багатьох міжнародних версіях. Уточніть її за номером конкретної моделі.</li>
        <li><strong>Лише eSIM:</strong> фізичного слота немає. iPhone Air та iPhone Duo використовують цей формат; у інших лінійках він залежить від ринку.</li>
        <li><strong>Дві фізичні nano-SIM:</strong> доступні в окремих моделях для певних ринків. Не переносіть це правило на всі пристрої з Китаю, Гонконгу чи Макао.</li>
      </ul>
      <h4>Що перевірити з покупцем</h4>
      <ol>
        <li>Чи підтримує його оператор eSIM саме для потрібного тарифу?</li>
        <li>Чи потрібна фізична SIM для роботи або подорожей?</li>
        <li>Чи немає обмеження оператора: «Налаштування» → «Загальні» → «Про пристрій» → «Блокування оператором»?</li>
      </ol>
      <p>Dual SIM означає роботу з двома номерами, а не обов’язково два фізичні слоти. Гарантію та доступні сервіси уточнюйте для конкретного пристрою й місця обслуговування.</p>
      <p>Джерело: <a href="https://support.apple.com/en-us/109317" target="_blank" rel="noopener noreferrer">Apple — Dual SIM та eSIM</a>.</p>
    `
  },
  {
    type: "facts",
    title: "Специфічні регіональні особливості",
    items: [
      "Апаратний варіант перевіряйте за номером Axxxx та офіційними характеристиками; один номер може охоплювати кілька ринків.",
      "Підтримка eSIM і фізичних SIM різниться навіть усередині одного покоління. Для Air та Duo одразу обговоріть eSIM.",
      "Підтримка частот 5G сама по собі не гарантує доступ до 5G: потрібні сумісний оператор, тариф і покриття.",
      "Apple Intelligence, Siri, супутникові функції та окремі сервіси залежать від моделі, мови й регіону. Перевіряйте потрібну функцію перед обіцянкою покупцю.",
      "Місцеві правила, оператор і налаштування можуть впливати на окремі функції. Не узагальнюйте старі регіональні обмеження на всі нові моделі.",
      "Для гарантійного звернення важливі документи про купівлю та умови продавця або сервісного центру. Не обіцяйте однакове обслуговування в кожній країні."
    ]
  },
  {
    type: "text",
    title: "Як перевірити модель і регіональну версію",
    html: `
      <ol>
        <li>Відкрийте «Налаштування» → «Загальні» → «Про пристрій».</li>
        <li>У полі «Номер моделі» спочатку видно артикул, наприклад із закінченням <strong>/A</strong>. Натисніть на нього, щоб побачити номер <strong>Axxxx</strong>.</li>
        <li>Знайдіть Axxxx у <a href="https://support.apple.com/en-us/108044" target="_blank" rel="noopener noreferrer">довіднику моделей Apple</a> і звірте конфігурацію SIM та інші відмінності. Один апаратний варіант може охоплювати кілька країн; ринок продажу уточнюйте за артикулом і документами.</li>
      </ol>
      <p><strong>Артикул і стан — різні речі.</strong> Початкова літера артикула не доводить, що iPhone зараз новий, не ремонтувався або не був активований. Фактичний стан, історію обслуговування та активацію перевіряють окремо.</p>
      <p>Інструкція: <a href="https://support.apple.com/en-us/106343" target="_blank" rel="noopener noreferrer">де знайти номер моделі</a>.</p>
    `
  },
  {
    type: "text",
    title: "R-SIM та MDM: що не продаємо",
    html: `
      <p><strong>Правило приймання:</strong> пристрої з R-SIM або корпоративним керуванням MDM не приймаємо на викуп чи Trade-In та не продаємо.</p>
      <h4>MDM — корпоративне керування</h4>
      <p>Організація може встановлювати правила, програми та обмеження, а також дистанційно блокувати або стирати пристрій. MDM не є характеристикою модельного ряду.</p>
      <ul>
        <li>Перегляньте розділ «Налаштування» → «Загальні» → «VPN та керування пристроєм» і повідомлення про нагляд організації.</li>
        <li>Відсутність профілю в налаштуваннях не доводить, що пристрій вилучено з корпоративної системи.</li>
        <li>Якщо під час налаштування з’являється «Віддалене керування», передайте питання відповідальному працівнику. Зняти корпоративну прив’язку має організація-власник.</li>
      </ul>
      <h4>R-SIM — обхід обмеження оператора</h4>
      <p>Це адаптер для SIM-картки, що використовується для роботи заблокованого під оператора iPhone в іншій мережі. Адаптер не є офіційним розблокуванням: розблокувати iPhone для використання з іншим оператором може лише оператор, до якого прив’язаний пристрій.</p>
      <p><strong>Перевірка:</strong> огляньте лоток SIM і статус блокування оператором. У разі сумніву припиніть приймання та зверніться до відповідального працівника.</p>
    `
  },
  {
    type: "text",
    title: "Дисплеї iPhone",
    html: `
      <table>
        <thead><tr><th>Характеристика</th><th>Що означає для користувача</th><th>Як показати</th></tr></thead>
        <tbody>
          <tr><td><strong>LCD / OLED</strong></td><td>OLED відображає глибокий чорний. LCD використовується, зокрема, в XR, 11 і SE 2-го та 3-го поколінь.</td><td>Порівняйте темне фото й контрастність за однакової яскравості.</td></tr>
          <tr><td><strong>ProMotion до 120 Гц</strong></td><td>Плавніше прокручування й анімації. Є в Pro починаючи з 13 Pro, а також в iPhone 17, Air і Duo.</td><td>Прокрутіть список або вебсторінку поруч із моделлю на 60 Гц.</td></tr>
          <tr><td><strong>Яскравість</strong></td><td>Впливає на читабельність надворі. Типова, пікова HDR і пікова на сонці — різні показники.</td><td>Порівнюйте однакові режими за офіційною специфікацією, а не лише найбільше число.</td></tr>
          <tr><td><strong>Діагональ і форма</strong></td><td>Великий екран зручний для відео, але впливає на габарити. У Duo є окремі внутрішній і зовнішній екрани.</td><td>Дайте потримати пристрій, набрати текст і оцінити розмір у кишені.</td></tr>
        </tbody>
      </table>
      <p><strong>Важливо:</strong> Ceramic Shield та захист IP68 не роблять пристрій невразливим до падінь або води. Клас IP визначають у лабораторних умовах; водостійкість може знижуватися зі зношенням. Не демонструйте захист зануренням чи ударами.</p>
    `
  },
  {
    type: "text",
    title: "Основні технології Apple в iPhone",
    html: `
      <h4>Функція → користь → коротка демонстрація</h4>
      <ul>
        <li><strong>True Tone:</strong> підлаштовує кольорову температуру екрана під освітлення. Покажіть перемикач у налаштуваннях дисплея.</li>
        <li><strong>Face ID / Touch ID:</strong> підтверджують особу для розблокування та оплати. У Duo Touch ID розташований у бічній кнопці; у SE — у кнопці «Початок».</li>
        <li><strong>Dynamic Island:</strong> показує поточні активності, наприклад таймер або відтворення музики. Запустіть таймер і поверніться на головний екран.</li>
        <li><strong>MagSafe:</strong> магнітне позиціювання сумісних зарядних пристроїв та аксесуарів. Перевірте підтримку моделі: у 16e MagSafe немає, у 17e є.</li>
        <li><strong>Кнопка дії:</strong> запускає призначену функцію. Покажіть, як вибрати ліхтарик, камеру або швидку команду.</li>
        <li><strong>Camera Control:</strong> окремий елемент керування камерою в сумісних моделях. Його наявність перевіряйте в характеристиках, а не лише за номером покоління.</li>
        <li><strong>Ультраширока камера / телефото:</strong> дають відповідно ширший кадр і наближення. Покажіть однакову сцену різними об’єктивами.</li>
      </ul>
      <h4>Як правильно пояснювати наближення</h4>
      <p>Оптичне наближення, режим оптичної якості з частини сенсора та цифрове збільшення — різні речі. Наприклад, у 17 Pro й 18 Pro є телефото 4× і режим 8× оптичної якості. Цифрові 40× не означають окремий об’єктив 40×.</p>
    `
  },
  {
    type: "text",
    title: "iOS — стабільність, безпека та екосистема",
    html: `
      <p>Екосистема має цінність, коли спрощує конкретні дії покупця. Оберіть одну-дві функції, які відповідають його пристроям і звичкам.</p>
      <ul>
        <li><strong>AirDrop:</strong> передавання фото та файлів між сумісними пристроями Apple без месенджера.</li>
        <li><strong>iCloud:</strong> синхронізація даних і резервне копіювання. Поясніть обсяг сховища та можливу оплату додаткового місця.</li>
        <li><strong>Функції безперервності:</strong> продовження роботи між сумісними Mac, iPad та iPhone; вимоги залежать від конкретної функції.</li>
        <li><strong>Конфіденційність:</strong> код допуску, біометрія, дозволи програм і «Локатор». Допоможіть перевірити налаштування, не просіть повідомляти вам пароль облікового запису.</li>
        <li><strong>Оновлення:</strong> Apple підтримує моделі протягом багатьох років. Перед продажем старішого iPhone перевірте сумісність із потрібними програмами та поточною iOS.</li>
        <li><strong>Apple Intelligence:</strong> доступність залежить від сумісного пристрою, мови й регіону. Не обіцяйте всі функції українською без перевірки.</li>
      </ul>
      <p><strong>Після продажу:</strong> узгодьте перенесення даних, резервну копію та активацію SIM. Покупець має самостійно вводити свої паролі й коди підтвердження.</p>
    `
  },
  {
    type: "text",
    title: "Самоперевірка та додаткові матеріали",
    html: `
      <h4>Перевірте себе перед тестом</h4>
      <ol>
        <li>Покупець хоче легкий iPhone. Які переваги й обмеження Air ви поясните?</li>
        <li>Чим Duo відрізняється від Pro Max і від позначення Dual SIM?</li>
        <li>Які перевірки обов’язкові перед продажем вживаного пристрою?</li>
        <li>Як перевірити формат SIM і чому одного слова «Global» недостатньо?</li>
      </ol>
      <p>Для практики використовуйте <a href="https://support.apple.com/uk-ua/guide/iphone/welcome/ios" target="_blank" rel="noopener noreferrer">посібник користувача iPhone</a>, <a href="https://www.apple.com/iphone/compare/" target="_blank" rel="noopener noreferrer">порівняння моделей Apple</a> та каталог у наступному матеріалі.</p>
    `
  }
];

export const iphoneCatalogBlocks: ModuleContentBlock[] = [
  {
    learningGuide: parseLearningGuide(iphoneLearningGuides["2"], 2) ?? undefined,
    type: "text",
    title: "Як користуватися каталогом моделей",
    html: " <p>Каталог охоплює покоління від iPhone X до iPhone 18 Pro та iPhone Duo. Спочатку визначте сценарій покупця, потім порівняйте дві-три відповідні моделі.</p> <ol> <li><strong>Розмір:</strong> екран, маса та зручність у руці.</li> <li><strong>Камери:</strong> потрібні об’єктиви, наближення та формати відео.</li> <li><strong>Щоденне користування:</strong> пам’ять, автономність, SIM і заряджання.</li> <li><strong>Для вживаного:</strong> фактичний стан, акумулятор та історія ремонту.</li> </ol> <p><strong>Новинки 2026 року:</strong> iPhone 18 Pro, 18 Pro Max і складаний iPhone Duo. Продажі Duo в Apple розпочалися <strong>23 жовтня 2026 року</strong>; наявність конкретної моделі в PineApple уточнюйте окремо.</p> "
  },
  {
    type: "facts",
    title: "Фокус під час консультації",
    items: [
      "iPhone 17 — універсальний варіант із ProMotion і двома задніми камерами. Для плавності 120 Гц вже не обов’язково обирати Pro.",
      "iPhone 18 Pro / Pro Max — для контролю зйомки та телефото. Pro Max варто порівнювати з Pro за габаритами й автономністю.",
      "iPhone Air — для мінімальної товщини й малої маси. Одразу поясніть одну задню камеру та підтримку лише eSIM.",
      "iPhone Duo — для складаного великого екрана та багатозадачності. Покажіть різницю форматів, Touch ID і можливості камер.",
      "iPhone 16e та 17e відрізняються, зокрема, MagSafe: у 16e його немає, у 17e є. SE й mini оцінюйте також за віком і станом акумулятора."
    ]
  },
  {
    type: "productCatalog",
    title: "Моделі iPhone і технічні характеристики",
    products: iphoneProductCatalog
  },
  {
    type: "facts",
    title: "Швидкий орієнтир для вибору",
    items: [
      "Менший бюджет: порівняйте e-моделі з перевіреним вживаним iPhone. Ціну зіставляйте зі станом і потрібними функціями.",
      "Професійне відео: перевірте конкретні режими ProRes, вимоги до пам’яті, зовнішнього накопичувача та кабелю.",
      "Великий екран: порівняйте Pro Max, Plus відповідних поколінь і складаний Duo; дайте оцінити габарити.",
      "Автономність: години відтворення відео Apple — лабораторний орієнтир, а не обіцянка такої самої тривалості ігор або навігації.",
      "Остаточний вибір: підтвердьте пам’ять, тип SIM, сумісні аксесуари, стан пристрою й наявність перед оформленням."
    ]
  },
  {
    type: "text",
    title: "Офіційні характеристики та актуальність",
    html: " <p>Наведені офіційні джерела повторно переглянуто <strong>25 жовтня 2026 року</strong>. Для характеристик і доступності функцій звіряйте саме потрібну модель та регіональну версію.</p> <ul> <li><a href=\"https://www.apple.com/iphone-18-pro/specs/\" target=\"_blank\" rel=\"noopener noreferrer\">iPhone 18 Pro та 18 Pro Max — характеристики</a> · <a href=\"https://www.apple.com/newsroom/2026/09/apple-debuts-iphone-18-pro-and-iphone-18-pro-max/\" target=\"_blank\" rel=\"noopener noreferrer\">анонс Apple</a>.</li> <li><a href=\"https://www.apple.com/iphone-duo/specs/\" target=\"_blank\" rel=\"noopener noreferrer\">iPhone Duo — характеристики</a> · <a href=\"https://www.apple.com/iphone-duo/\" target=\"_blank\" rel=\"noopener noreferrer\">можливості та старт продажів</a>.</li> <li><a href=\"https://www.apple.com/iphone-air/specs/\" target=\"_blank\" rel=\"noopener noreferrer\">iPhone Air</a>, <a href=\"https://www.apple.com/iphone-17/specs/\" target=\"_blank\" rel=\"noopener noreferrer\">iPhone 17</a> та iPhone 17e: <a href=\"https://www.apple.com/ua/iphone-17e/specs/\" target=\"_blank\" rel=\"noopener noreferrer\">версія UA — nano-SIM + eSIM</a>, <a href=\"https://www.apple.com/iphone-17e/specs/\" target=\"_blank\" rel=\"noopener noreferrer\">версія US — лише eSIM</a>.</li> <li><a href=\"https://support.apple.com/en-us/125090\" target=\"_blank\" rel=\"noopener noreferrer\">iPhone 17 Pro</a> та <a href=\"https://support.apple.com/en-us/125091\" target=\"_blank\" rel=\"noopener noreferrer\">iPhone 17 Pro Max</a>.</li> </ul> <p><strong>Перед консультацією:</strong> уточніть фактичну наявність, ціну, комплектацію й умови обслуговування в магазині. Час роботи та швидкість заряджання залежать від умов використання й аксесуарів.</p> "
  }
];

const appleIphoneContent = {
  iphoneProductCatalog,
  iphoneFoundationBlocks,
  iphoneCatalogBlocks
};

export default appleIphoneContent;
