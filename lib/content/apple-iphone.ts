import type { ModuleCatalogProduct, ModuleContentBlock } from "../module-content";

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
      "До 14 год відтворення відео"
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
      "До 15 год відтворення відео"
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
      "IP68 (до 6 м на 30 хв)"
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
    title: "iPhone SE 2 gen (2020)",
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
      "До 14 год відтворення відео"
    ],
    colors: [
      { label: "Black", imageUrl: "/materials/iphone/Color/SE2020/Black-Photoroom.png", caption: "Колір: Black", default: true },
      { label: "White", imageUrl: "/materials/iphone/Color/SE2020/White-Photoroom.png", caption: "Колір: White" },
      { label: "Red", imageUrl: "/materials/iphone/Color/SE2020/red-Photoroom.png", caption: "Колір: Red" }
    ]
  },
  {
    slug: "iphone-7",
    title: "iPhone SE 3 gen (2022)",
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
    title: "iPhone 12 Mini / iPhone 12 (2020)",
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
    title: "iPhone 13 Mini / iPhone 13 (2021)",
    overview: ["Діагональ: Mini — 5.4″; 13 — 6.1″", "Кольори: Starlight, Midnight, Blue, Pink, Red, Green", "Пам’ять: 128 GB, 256 GB, 512 GB"],
    highlights: [
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
      "Покращений Dynamic Island (декілька активностей одночасно)",
      "Face ID",
      "A16 Bionic",
      "2 стереодинаміки",
      "Алюмінієва рамка, матовий корпус",
      "MagSafe",
      "Основна камера: 48 Мп + ультраширока 12 Мп, оптичний зум до 2х",
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
    overview: ["Діагональ: Pro — 6.1″; Pro Max — 6.7″", "Кольори: Black Titanium, White Titanium, Blue Titanium, Natural Titanium", "Пам’ять: Pro — 128/256/512 GB, 1 TB; Pro Max — 256/512 GB, 1 TB"],
    highlights: [
      "OLED Super Retina XDR з ProMotion",
      "True Tone",
      "Always‑On Display",
      "Покращений Dynamic Island",
      "Face ID",
      "A17 Pro",
      "Титанові рамки",
      "Action Button",
      "MagSafe",
      "Основна камера: 48 Мп + ультраширока 12 Мп + телефото 12 Мп (до 3х Pro / 5х Pro Max)",
      "LiDAR",
      "Портрети нового покоління",
      "Нічний режим",
      "Dolby Vision",
      "Режим «Швидкий рух»",
      "Фронтальна камера TrueDepth з автофокусом",
      "Photonic Engine",
      "Ceramic Shield",
      "IP68",
      "До 29 год відтворення відео",
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
      "True Tone, покращений Dynamic Island",
      "Face ID, A17 Bionic",
      "2 стереодинаміки, алюмінієва рамка",
      "MagSafe",
      "Основна камера: 48 Мп + ультраширока 12 Мп, оптичний зум до 2х",
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
    overview: ["Діагональ: Pro — 6.3″; Pro Max — 6.9″", "Кольори: Black Titanium, White Titanium, Desert Titanium, Natural Titanium", "Пам’ять: Pro — 128/256/512 GB, 1 TB; Pro Max — 256/512 GB, 1 TB"],
    highlights: [
      "OLED Super Retina XDR з ProMotion",
      "True Tone",
      "Always‑On Display",
      "Покращений Dynamic Island",
      "Face ID",
      "A18 Pro",
      "2 стереодинаміки",
      "Титанові рамки",
      "Action Button",
      "MagSafe",
      "Основна камера: 48 Мп + ультраширока 48 Мп + телефото 48 Мп (оптичний зум до 10х)",
      "LiDAR",
      "Портрети нового покоління",
      "Нічний режим",
      "Dolby Vision",
      "Режим «Швидкий рух»",
      "Фронтальна камера TrueDepth з автофокусом",
      "Photonic Engine",
      "Ceramic Shield",
      "IP68",
      "До 29 год відтворення відео",
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
    title: "iPhone 16e",
    overview: ["Кольори: Black, White", "Пам’ять: 128 GB, 256 GB, 512 GB"],
    highlights: [
      "OLED Super Retina XDR 6.1″ (2532×1170, 460 ppi)",
      "HDR10, Dolby Vision, True Tone",
      "Apple A18 (4‑ядерний GPU)",
      "8 GB RAM",
      "Основна камера: 48 Мп Fusion f/1.6 з OIS",
      "Фронтальна камера: 12 Мп TrueDepth f/1.9 з автофокусом",
      "Photonic Engine, Deep Fusion, Photographic Styles, Night Mode",
      "До 26 год відео, до 90 год аудіо",
      "Qi бездротова зарядка до 7.5 Вт",
      "IP68",
      "Action Button",
      "USB‑C",
      "Без MagSafe",
      "iOS 18.3 з Apple Intelligence"
    ],
    colors: [
      { label: "Black", imageUrl: "/materials/iphone/Color/16e/Black-Photoroom.png", caption: "Колір: Black", default: true },
      { label: "White", imageUrl: "/materials/iphone/Color/16e/White-Photoroom.png", caption: "Колір: White" }
    ]
  },
  {
    slug: "iphone-19",
    title: "iPhone 17 Pro / iPhone 17 Pro Max (2025)",
    overview: ["Діагональ: Pro — 6.3″; Pro Max — 6.9″", "Кольори: Silver, Cosmic Orange, Deep Blue", "Пам’ять: Pro — 256/512 GB, 1 TB; Pro Max — 256/512 GB, 1 TB, 2 TB"],
    highlights: [
      "OLED Super Retina XDR з ProMotion (1–120Hz), до 3000 ніт яскравості",
      "True Tone, Always‑On Display, Dynamic Island",
      "Face ID, A19 Pro",
      "2 стереодинаміки, алюмінієвий unibody корпус",
      "Action Button, MagSafe",
      "Камери: 48 Мп Fusion Main + 48 Мп Ultra Wide + 48 Мп Telephoto (оптичний зум до 6х, цифровий до 40х)",
      "LiDAR, портрети нового покоління, нічний режим",
      "Dolby Vision, «Швидкий рух»",
      "Фронтальна камера: 18 Мп TrueDepth з автофокусом",
      "Photonic Engine, Ceramic Shield 2",
      "IP68, USB‑C",
      "До 37 год відтворення відео"
    ],
    colors: [
      { label: "Silver", imageUrl: "/materials/iphone/Color/17Pro_ProMax/Silver-Photoroom.png", caption: "Колір: Silver", default: true },
      { label: "Cosmic Orange", imageUrl: "/materials/iphone/Color/17Pro_ProMax/Orange-Photoroom.png", caption: "Колір: Cosmic Orange" },
      { label: "Deep Blue", imageUrl: "/materials/iphone/Color/17Pro_ProMax/DeepBlue-Photoroom.png", caption: "Колір: Deep Blue" }
    ]
  },
  {
    slug: "iphone-20",
    title: "iPhone 17 Air (2025)",
    overview: ["Діагональ: 6.5″", "Кольори: Space Black, Cloud White, Light Gold, Sky Blue", "Пам’ять: 256/512 GB, 1 TB"],
    highlights: [
      "OLED Super Retina XDR з ProMotion (до 120Hz)",
      "True Tone",
      "Always‑On Display (вимкнено за замовчуванням)",
      "Покращений Dynamic Island",
      "Face ID, A19 Pro",
      "2 стереодинаміки",
      "Титановий корпус (надлегкий, товщина лише 5.6 мм)",
      "MagSafe",
      "Основна камера: 48 Мп Fusion (цифровий зум до 10х)",
      "Портрети нового покоління, нічний режим",
      "Dolby Vision, «Швидкий рух»",
      "Фронтальна камера: 18 Мп TrueDepth з автофокусом",
      "Photonic Engine",
      "Ceramic Shield 2 (передня панель), Ceramic Shield (задня)",
      "IP68",
      "До 24 год відтворення відео",
      "USB‑C"
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
      "OLED Super Retina XDR з ProMotion (1–120Hz), HDR10, до 3000 ніт яскравості",
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
      "Фронтальна 18 Мп TrueDepth з автофокусом, Center Stage",
      "Photonic Engine",
      "Ceramic Shield 2 (передня), Ceramic Shield (задня)",
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
  }
];

export const iphoneFoundationBlocks: ModuleContentBlock[] = [
  {
    type: "text",
    title: "Apple iPhone",
    html: `
      <p>Всім привіт, бандо! У цьому модулі зібрано базу по Apple iPhone: чим моделі відрізняються, як орієнтуватися в новій та вживаній техніці, які регіональні версії існують та на що звертати увагу під час консультації.</p>
      <p>Матеріал перенесено з вашої HTML-версії у формат навчального порталу, щоб ним було зручно користуватися з телефону, планшета та ПК.</p>
    `
  },
  {
    type: "text",
    title: "Вживана техніка Apple",
    html: `
      <p>Ринок вживаної техніки Apple активно зростає завдяки довговічності пристроїв, популярності бренду та високій ціні нових моделей. Для успішних продажів важливо добре орієнтуватися в модельному ряді iPhone і пропонувати сервісне обслуговування.</p>
      <h4>Основні характеристики ринку</h4>
      <ul>
        <li><strong>Великий попит:</strong> якість і дизайн Apple тримають попит навіть на старі моделі.</li>
        <li><strong>Ціна:</strong> техніка Apple повільніше знецінюється, ніж у інших брендів.</li>
        <li><strong>Різноманітність:</strong> iPhone, iPad, MacBook, Apple Watch та інші пристрої у різних станах.</li>
        <li><strong>Передпродажна перевірка:</strong> повний тест кожного пристрою, заміна зношених запчастин, наприклад АКБ.</li>
      </ul>
    `
  },
  {
    type: "text",
    title: "Нова техніка Apple",
    html: `
      <p>Нові пристрої Apple задають стандарти ринку преміум-сегмента: сучасний дизайн, інтегрована екосистема, потужність і довготривала підтримка.</p>
      <h4>Основні характеристики</h4>
      <ul>
        <li><strong>Великий попит:</strong> стабільно високий інтерес до нових релізів і оновлень.</li>
        <li><strong>Інновації:</strong> передові процесори, дисплеї, камери, захист даних і сервіси.</li>
        <li><strong>Ціна:</strong> преміальна вартість із відповідною якістю, статусом та підтримкою.</li>
        <li><strong>Різноманітність:</strong> смартфони, планшети, ноутбуки, годинники для різних сценаріїв.</li>
        <li><strong>Сервіс:</strong> гарантія та глобальна мережа сервісних центрів.</li>
      </ul>
    `
  },
  {
    type: "text",
    title: "Лінійки iPhone",
    html: `
      <h4>Стандартні базові моделі</h4>
      <ul>
        <li><strong>Опис:</strong> збалансовані функції для щоденних задач: продуктивність, камери, дизайн.</li>
        <li><strong>Кому підходять:</strong> тим, хто хоче основний набір функцій без «про»-надбавок за розумну ціну.</li>
      </ul>
      <h4>Pro</h4>
      <ul>
        <li><strong>Опис:</strong> кращі дисплеї, потужні чіпи, розширені камери та інструменти для творчості й бізнесу.</li>
        <li><strong>Кому підходять:</strong> фото- та відеокреаторам, дизайнерам, ентузіастам продуктивності.</li>
      </ul>
      <h4>Pro Max</h4>
      <ul>
        <li><strong>Опис:</strong> усе, що є в Pro, але з більшим екраном і автономністю для медіа та ігор.</li>
        <li><strong>Кому підходять:</strong> тим, хто цінує великий дисплей і максимальні можливості камер.</li>
      </ul>
      <h4>SE / e</h4>
      <ul>
        <li><strong>Опис:</strong> бюджетні моделі з сучасною продуктивністю і класичним дизайном.</li>
        <li><strong>Кому підходять:</strong> прихильникам компактних форм і нижчого бюджету без втрати надійності.</li>
      </ul>
      <h4>Mini</h4>
      <ul>
        <li><strong>Опис:</strong> компактні iPhone з актуальними характеристиками й зручністю одноручного використання.</li>
        <li><strong>Кому підходять:</strong> тим, кому важлива компактність та легкість.</li>
      </ul>
    `
  },
  {
    type: "text",
    title: "Версії iPhone за ринками",
    html: `
      <h4>iPhone Global</h4>
      <ul>
        <li><strong>Ринок:</strong> Європа, Азія, Латинська Америка, Канада, Австралія.</li>
        <li><strong>SIM-карта:</strong> один фізичний слот nano-SIM + підтримка eSIM.</li>
        <li><strong>Сумісність:</strong> працює з усіма мобільними операторами, підтримує LTE/5G у більшості країн.</li>
        <li><strong>Гарантія:</strong> 1 рік Apple; в Україні — обслуговування через авторизовані сервісні центри або магазини, які надали гарантію.</li>
        <li><strong>Переваги:</strong> найбільш універсальна версія, підтримує фізичну SIM-карту, зручна для подорожей.</li>
        <li><strong>Позначення в артикулах:</strong> LL/A, ZP/A, ZA/A, T/A, F/A, VC/A.</li>
      </ul>
      <h4>iPhone eSIM</h4>
      <ul>
        <li><strong>Ринок:</strong> США, починаючи з iPhone 14.</li>
        <li><strong>SIM-карта:</strong> відсутній фізичний слот — лише eSIM, до 8 eSIM на одному пристрої.</li>
        <li><strong>Сумісність:</strong> працює лише з операторами, які підтримують eSIM. В Україні — Kyivstar, Vodafone, lifecell.</li>
        <li><strong>Гарантія:</strong> 1 рік Apple; в Україні — обслуговування через магазини, які надали гарантію.</li>
        <li><strong>Переваги:</strong> зручне перемикання між операторами, немає фізичної SIM-картки, нижчий ризик втрати SIM.</li>
        <li><strong>Обмеження:</strong> не всі оператори підтримують eSIM; не працює з фізичними SIM-картами.</li>
      </ul>
      <h4>Оновлені регіони з eSIM-only версією iPhone 17</h4>
      <ul>
        <li>США</li>
        <li>Канада</li>
        <li>Японія</li>
        <li>Мексика</li>
        <li>Саудівська Аравія</li>
        <li>ОАЕ</li>
        <li>Катар</li>
        <li>Кувейт</li>
        <li>Бахрейн</li>
        <li>Оман</li>
        <li>Гуам</li>
        <li>Американські Віргінські острови</li>
      </ul>
      <p>У цих країнах iPhone 17 не має фізичного слоту для SIM-картки — лише eSIM. Користувачі активують мобільний зв’язок через цифровий профіль.</p>
      <h4>iPhone Dual SIM</h4>
      <ul>
        <li><strong>Ринок:</strong> Китай, Гонконг, Макао та деякі країни Азії.</li>
        <li><strong>SIM-карта:</strong> два фізичних слоти nano-SIM без eSIM.</li>
        <li><strong>Сумісність:</strong> зручно для подорожей, бізнесу або розділення особистого й робочого номерів.</li>
        <li><strong>Гарантія:</strong> 1 рік Apple; в Україні — переважно через магазини, які надали гарантію.</li>
        <li><strong>Переваги:</strong> повноцінна підтримка Dual SIM без eSIM.</li>
        <li><strong>Обмеження:</strong> відсутність eSIM; у деяких регіонах можливі обмеження на FaceTime Audio.</li>
        <li><strong>Позначення в артикулах:</strong> CH/A, ZP/A, ZA/A.</li>
      </ul>
    `
  },
  {
    type: "facts",
    title: "Специфічні регіональні особливості",
    items: [
      "США: 5G mmWave, видима антена, лише eSIM, найширша підтримка частот.",
      "ОАЕ: можливі обмеження на відеодзвінки та FaceTime у межах регіону.",
      "Європа: обмеження максимальної гучності в навушниках приблизно на 10-12% нижче.",
      "Японія: звук затвора камери часто не вимикається всередині країни.",
      "Південна Корея: у «Локаторі» можуть бути недоступні вкладка «Люди» і шаринг геопозиції.",
      "Китай: без eSIM; гарантія діє лише в Китаї."
    ]
  },
  {
    type: "text",
    title: "Як визначити регіон за номером моделі",
    html: `
      <ul>
        <li><strong>Де подивитися:</strong> Налаштування → Основні → Про пристрій → Model Number, наприклад MQ0G3QN/A.</li>
        <li><strong>Суфікси регіонів:</strong> LL/A — США; CH/A — Китай; ZA/A — Сінгапур; ZD/A — Люксембург, Австрія, Бельгія, Монако, Німеччина, Франція, Нідерланди, Швейцарія; QN/A — Швеція, Данія, Ісландія, Норвегія; QL/A — Іспанія, Італія, Португалія; RX/A — Україна; SX/A — Словенія; UA/A — Україна; VC/A — Канада; X/A — Австралія, Нова Зеландія; HN/A — Індія; JA/A — Японія; BE — Велика Британія, Ірландія; B/A — Латинська Америка.</li>
        <li><strong>Перший символ моделі:</strong> M — новий; F — офіційно відновлений; N — сервісна заміна; число — демо-зразок; P — персоналізований пристрій з гравіюванням.</li>
      </ul>
    `
  },
  {
    type: "text",
    title: "R-SIM та MDM: що не продаємо",
    html: `
      <h4>Політика</h4>
      <ul>
        <li><strong>Не приймаємо та не продаємо:</strong> пристрої з R-SIM та MDM ні на викуп, ні в Trade-In.</li>
      </ul>
      <h4>Що таке MDM</h4>
      <ul>
        <li><strong>Визначення:</strong> система корпоративного керування пристроями. Після скидання активувати без корпоративного пароля неможливо.</li>
        <li><strong>Функції:</strong> моніторинг місцезнаходження, контроль додатків, обмеження, профілі Wi-Fi/VPN/пошта, автозапуск апів, дистанційне блокування та стирання.</li>
        <li><strong>Як перевірити:</strong> Налаштування → Загальні → VPN та керування пристроєм; додатково — платні онлайн-чекери.</li>
      </ul>
      <h4>Що таке R-SIM</h4>
      <ul>
        <li><strong>Визначення:</strong> пристрій або програмний обхід блокування оператора для роботи з іншими SIM.</li>
        <li><strong>Ризики:</strong> після скидання до заводських налаштувань пристрій часто неможливо активувати; робота без підкладки нестабільна.</li>
        <li><strong>Як працює:</strong> вставляється разом із SIM або прошивається і імітує «правильну» SIM оператора-локера без апаратного втручання.</li>
      </ul>
    `
  },
  {
    type: "text",
    title: "Дисплеї iPhone",
    html: `
      <h4>Типи дисплеїв</h4>
      <ul>
        <li><strong>LCD:</strong> ранні моделі та iPhone SE (2022). Менша контрастність і яскравість.</li>
        <li><strong>OLED:</strong> починаючи з iPhone X — глибокий чорний, висока контрастність, енергоефективність.</li>
      </ul>
      <h4>Частота оновлення</h4>
      <ul>
        <li><strong>60 Гц:</strong> базові моделі.</li>
        <li><strong>120 Гц ProMotion:</strong> Pro-моделі з iPhone 13 Pro — плавність і менші затримки.</li>
      </ul>
      <h4>Розміри та яскравість</h4>
      <ul>
        <li><strong>Діагоналі:</strong> від 4.7″ у SE до 6.9″ у Pro Max.</li>
        <li><strong>Яскравість:</strong> база — до приблизно 800 ніт; Pro — до приблизно 2000 ніт на сонці.</li>
      </ul>
      <h4>Інтерфейсні особливості</h4>
      <ul>
        <li><strong>Dynamic Island:</strong> з iPhone 14 Pro, а в 16-й серії — також у базових моделях.</li>
        <li><strong>HDR10 / Dolby Vision:</strong> підвищена якість відео.</li>
        <li><strong>True Tone:</strong> автопідлаштування балансу білого до освітлення.</li>
        <li><strong>Ceramic Shield:</strong> підвищений захист дисплея з 12 серії.</li>
      </ul>
    `
  },
  {
    type: "text",
    title: "Основні технології Apple в iPhone",
    html: `
      <ul>
        <li><strong>True Tone:</strong> автоматично підлаштовує баланс білого до зовнішнього освітлення, щоб очі менше втомлювалися.</li>
        <li><strong>Face ID:</strong> безпечне розблокування одним поглядом, працює навіть зі змінами зовнішності й у темряві.</li>
        <li><strong>Автояскравість:</strong> регулює яскравість екрана залежно від умов освітлення і допомагає економити батарею.</li>
        <li><strong>Qi Wireless Charging:</strong> універсальний стандарт бездротової зарядки, доступний з iPhone 8.</li>
        <li><strong>MagSafe:</strong> екосистема аксесуарів і швидша бездротова зарядка, підтримується з iPhone 12.</li>
        <li><strong>eSIM:</strong> цифрова SIM-картка, підтримується з iPhone XS і новіших моделей.</li>
        <li><strong>Нічний режим:</strong> яскравіші знімки з кращою деталізацією в умовах слабкого освітлення, починаючи з iPhone 11.</li>
        <li><strong>LiDAR:</strong> допомагає для AR, точних вимірювань, портретів і фокусування в темряві.</li>
        <li><strong>Ceramic Shield:</strong> міцніше покриття екрана, з’явилося з iPhone 12.</li>
        <li><strong>ProMotion:</strong> адаптивна частота оновлення до 120 Гц у Pro-лінійці.</li>
        <li><strong>Кінематографічний режим:</strong> автоматично перемикає фокус і змінює глибину кадру під час зйомки відео.</li>
        <li><strong>Dynamic Island:</strong> показує активності у згорнутому вигляді: дзвінки, маршрут, музику та інше.</li>
        <li><strong>Action Button:</strong> з iPhone 15 Pro замінює класичний перемикач звуку на кастомну кнопку.</li>
        <li><strong>Camera Control:</strong> у 16-й серії дає більш гнучке керування камерою та режимами зйомки.</li>
      </ul>
    `
  },
  {
    type: "text",
    title: "iOS — стабільність, безпека та екосистема",
    html: `
      <ul>
        <li><strong>Інтуїтивний інтерфейс:</strong> система жестів, зрозуміле розташування іконок, Control Center, Spotlight Search і темний режим.</li>
        <li><strong>Продуктивність і стабільність:</strong> iOS оптимізована під апаратне забезпечення iPhone і забезпечує плавну роботу та хорошу автономність.</li>
        <li><strong>Екосистема Apple:</strong> Handoff, AirDrop, iCloud і Continuity спрощують роботу між iPhone, Mac, iPad, Apple Watch та AirPods.</li>
        <li><strong>Безпека та конфіденційність:</strong> Face ID, Touch ID, шифрування даних, контроль дозволів і перевірка програм в App Store.</li>
        <li><strong>Вбудовані програми та сервіси:</strong> Safari, Messages, Mail, Photos, Notes, Health, Apple Music, Apple Pay, iCloud Drive та інші сервіси.</li>
        <li><strong>App Store:</strong> мільйони додатків для різних завдань із високими стандартами якості та безпеки.</li>
        <li><strong>Розширені функції:</strong> Siri, Live Text, FaceTime, iMessage, Focus Modes та інші інструменти для щоденної роботи.</li>
        <li><strong>Оновлення та підтримка:</strong> Apple регулярно випускає оновлення iOS і довго підтримує навіть старі моделі.</li>
      </ul>
    `
  },
  {
    type: "text",
    title: "Для більш докладного заглиблення",
    html: `
      <blockquote>Для глибшого самостійного вивчення використовуйте матеріали support.apple.com/uk-ua/docs.</blockquote>
    `
  }
];

export const iphoneCatalogBlocks: ModuleContentBlock[] = [
  {
    type: "text",
    title: "Як користуватися каталогом моделей",
    html: `
      <p>Нижче зібрано повний перелік моделей iPhone і технічних характеристик із вашої верстки. Для кожної картки доступні кольори, пам’ять, діагональ і ключові особливості, які варто проговорити клієнту під час консультації.</p>
      <p>Рекомендуємо порівнювати не лише цифри, а й сценарій використання: компактність, камера, автономність, тип SIM, зарядка, матеріал корпуса та сумісність з аксесуарами.</p>
    `
  },
  {
    type: "facts",
    title: "Фокус під час консультації",
    items: [
      "SE та e-лінійка — для клієнтів, яким важливі компактність або доступніша ціна.",
      "Базові iPhone — збалансовані моделі для щоденних задач і входу в екосистему Apple.",
      "Pro та Pro Max — для камер, ігор, роботи з контентом і максимальної продуктивності.",
      "Mini — сильний аргумент для клієнтів, яким потрібен компактний смартфон без компромісів у швидкості.",
      "Вживані моделі продаються краще, коли продавець впевнено пояснює стан пристрою, батарею та сервісну історію."
    ]
  },
  {
    type: "productCatalog",
    title: "Моделі iPhone і технічні характеристики",
    products: iphoneProductCatalog
  },
  {
    type: "facts",
    title: "Швидкий орієнтир по підбору",
    items: [
      "Для бюджету та класичного керування: iPhone SE або iPhone 16e.",
      "Для універсального вибору: базові серії iPhone 12-16 з пам’яттю 128-256 GB.",
      "Для фото, відео та 120 Гц: серії Pro, починаючи з iPhone 13 Pro.",
      "Для максимальної автономності та великого екрана: Pro Max або Plus.",
      "Для клієнтів, які питають про США-версії: одразу уточнюйте готовність користуватися eSIM."
    ]
  },
  {
    type: "text",
    title: "Примітка щодо актуальності",
    html: `
      <p>Блок із серією iPhone 17 перенесено у портал у тому вигляді, як він був у вашому вихідному HTML-матеріалі. Для команди це зручно як внутрішній навчальний конспект, але перед публічним або фінальним використанням цей блок варто періодично звіряти з актуальними релізами та оновленнями Apple.</p>
    `
  }
];

const appleIphoneContent = {
  iphoneProductCatalog,
  iphoneFoundationBlocks,
  iphoneCatalogBlocks
};

export default appleIphoneContent;
