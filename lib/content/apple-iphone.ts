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
      "True Tone, Dynamic Island",
      "Face ID, A18",
      "2 стереодинаміки, алюмінієва рамка",
      "MagSafe, кнопка дії та Camera Control",
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
    summary: "Для покупця, якому потрібні керування діафрагмою, телефото й професійне відео. Pro менш габаритний; Pro Max має більший екран і довшу автономність. Камери обох моделей однакові, тому вибір розміру варто почати зі зручності в руці та прийнятної маси.",
    overview: [
      "Діагональ: Pro — 6,3″; Pro Max — 6,9″",
      "Пам’ять обох моделей: 256 ГБ, 512 ГБ, 1 ТБ, 2 ТБ",
      "Кольори: Black, Silver, Glacier, Burgundy",
      "Розміри (В × Ш × Т): Pro — 150,0 × 71,9 × 8,75 мм; Pro Max — 163,4 × 78,0 × 8,75 мм",
      "Маса: Pro — 211 г; Pro Max — 249 г",
      "Відтворення відео: Pro — до 36 год; Pro Max — до 45 год, за даними Apple для версій eSIM",
      "Потокове відео: Pro — до 33 год; Pro Max — до 40 год, за даними Apple для версій eSIM",
      "Орієнтир змішаного користування: Pro — до 24 год; Pro Max — до 30 год за методикою Apple; фактичний час залежить від сценарію"
    ],
    highlights: [
      "OLED Super Retina XDR із ProMotion до 120 Гц дає плавніше прокручування; Always-On показує інформацію без пробудження екрана, True Tone підлаштовує колірну температуру під освітлення.",
      "A20 Pro: 2-нм техпроцес, 6-ядерний CPU, 7-ядерний GPU, два 16-ядерні Neural Engine та апаратне трасування променів — для складної обробки фото, відео й вимогливих ігор.",
      "Основна камера 48 Мп Fusion, 24 мм: діафрагма ƒ/1,48, ƒ/1,8, ƒ/2,8 або ƒ/4,0 дає змогу керувати кількістю світла та глибиною різкості; стабілізація зсувом сенсора другого покоління.",
      "Телефото 4× допомагає знімати віддалені об’єкти. Режими 2× і 8× оптичної якості дають 12-Мп кадр із частини сенсора; цифрове збільшення до 40× працює окремо.",
      "Фронтальна камера 18 Мп Center Stage: ƒ/1,9, автофокус; допомагає змінювати кадрування селфі та втримувати людину в кадрі відеодзвінка.",
      "Суцільний алюмінієвий корпус; Ceramic Shield 2 спереду й Ceramic Shield ззаду. Перед вибором Pro Max оцініть його масу та зручність у руці.",
      "Дисплей OLED Super Retina XDR: Pro — 2622 × 1206 пікселів; Pro Max — 2868 × 1320, в обох — 460 ppi.",
      "Яскравість: до 1000 ніт у звичайному режимі, до 1600 ніт для HDR і до 3000 ніт надворі; ці режими не слід прирівнювати.",
      "Охолодження з випарною камерою допомагає підтримувати продуктивність під тривалим навантаженням — наприклад, під час гри або зйомки.",
      "Face ID працює через систему TrueDepth; кнопка дії запускає обрану функцію, а Camera Control дає доступ до керування камерою.",
      "Ультраширока камера 48 Мп Fusion: 13 мм, ƒ/2,2, кут огляду 120°; підтримує макрофото з роздільністю 48 Мп.",
      "Телефото 48 Мп Fusion: 100 мм, ƒ/2,8, оптичне наближення 4×; тетрапризма, автофокус і стабілізація зсувом сенсора у трьох вимірах.",
      "Для фото доступні ProRAW, нічний режим, Photographic Styles 3 та інтелектуальне стеження за фокусом. У системі датчиків є LiDAR; можливості обробки залежать від режиму зйомки.",
      "Відео Dolby Vision: до 4K 120 кадрів/с на основній камері; ProRes до 4K 120 кадрів/с потребує зовнішнього запису.",
      "Професійний процес зйомки: Apple Log 2, ProRes RAW та Genlock. RAW потребує сумісної програми, а Genlock — сумісного обладнання й програмного забезпечення.",
      "Кінематографічний режим — до 4K Dolby Vision 60 кадрів/с; режим дії — до 2,8K 60 кадрів/с; Dual Capture — до 4K 30 кадрів/с.",
      "Звук: стереодинаміки, чотири мікрофони для запису, Spatial Audio, зменшення шуму вітру й Audio Mix для роботи зі звучанням відео.",
      "USB-C підтримує USB 3 до 10 Гбіт/с і DisplayPort. Для цієї швидкості передавання потрібен відповідний USB 3-кабель, а не будь-який зарядний кабель.",
      "Бездротові підключення: чип N1, Wi-Fi 7, Bluetooth 6 і Thread; також є UWB другого покоління та NFC. Доступність окремих можливостей залежить від регіону.",
      "Мобільна мережа: 5G і LTE; C2 Apple вказує для iPhone 18 Pro. Смуги частот і mmWave перевіряйте за номером конкретної регіональної моделі.",
      "SIM у специфікації США: дві активні eSIM, зберігання щонайменше восьми профілів, без фізичного слота. Перед продажем перевірте регіон пристрою та підтримку оператора.",
      "IP68: лабораторне випробування до 6 м протягом 30 хв. Це не дозвіл на підводну зйомку; водостійкість зменшується зі зношенням.",
      "Автономність порівнюйте в однаковому режимі: відтворення відео, потокове відео й змішане користування — різні вимірювання, а не однакова обіцянка часу роботи.",
      "Дротове заряджання: до 50% приблизно за 15 хв із підтримуваним адаптером, здатним давати 60 Вт або більше, USB PD 3.1 з AVS і сумісним кабелем. Умови впливають на результат.",
      "MagSafe та Qi2 — до 25 Вт за специфікацією США. Для MagSafe Apple вказує до 50% за 30 хв з адаптером від 35 Вт; аксесуари купуються окремо.",
      "iOS 27 поєднує можливості iPhone з AirDrop, iCloud і функціями безперервності на сумісних пристроях Apple; вимоги залежать від функції.",
      "Apple Intelligence потребує підтримуваної мови пристрою й Siri. Української в опублікованому переліку немає; Siri AI має статус бета та регіональні обмеження, зокрема для ЄС на старті.",
      "У комплекті — iPhone та зарядний USB-C-кабель довжиною 1 м. Адаптер живлення й навушники не входять; зарядний кабель не означає підтримку передавання даних 10 Гбіт/с."
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
    summary: "Складаний iPhone для читання, відеодзвінків і роботи з двома застосунками поруч. Зовнішній екран підходить для швидких дій, внутрішній — для великого робочого простору. Перед вибором варто оцінити ширину корпусу, вагу та сценарії використання обох екранів.",
    overview: [
      "Екрани: внутрішній 7,6″ та зовнішній 5,4″ OLED Super Retina XDR; ProMotion до 120 Гц.",
      "Процесор: A20 Pro; 6-ядерний CPU, 7-ядерний GPU, два 16-ядерні Neural Engine.",
      "Накопичувач: 256 ГБ, 512 ГБ, 1 ТБ або 2 ТБ.",
      "Камери: 48 Мп основна + 48 Мп ультраширококутна; зовнішня фронтальна 12 Мп; внутрішня підекранна FaceTime.",
      "Автономність: до 44 год відео на зовнішньому екрані або до 31 год на внутрішньому за тестами Apple.",
      "Заряджання: USB-C; MagSafe та Qi2 до 25 Вт.",
      "Зв’язок: 5G, Wi-Fi 7, Bluetooth 6, Thread; лише eSIM.",
      "Корпус: титан Grade 5; 254 г; захист IP68.",
      "Кольори: Night Sky, Star White."
    ],
    highlights: [
      "Внутрішній 7,6″ OLED-екран зручний для документів, відео й читання: після розкладання телефон дає більше простору для вмісту.",
      "Два застосунки поруч: Split View в iOS 27.1 допомагає працювати з кількома завданнями. StandBy показує годинник, фото чи віджети на обох екранах без заряджання.",
      "Duo Preview показує людині її кадр на зовнішньому екрані; Smart Take автоматично робить фото, коли учасники готові; Kid Cue привертає увагу дитини анімацією.",
      "Два акумулятори працюють як одна система. Apple заявляє до 24 год типового використання з однаковою часткою обох екранів; локальне відео — до 44/31 год на зовнішньому/внутрішньому.",
      "Основна камера: 48 Мп, 26 мм, ƒ/1,6, стабілізація зсувом сенсора; стандартні фото 24 Мп. Режим 2× дає 12 Мп оптичної якості без окремого телеоб’єктива.",
      "Touch ID у бічній кнопці працює у складеному й розкладеному станах. Camera Control дає швидкий доступ до камери та її параметрів.",
      "Екрани в цифрах: внутрішній — 1878 × 2670, 430 ppi; зовнішній 5,4″ OLED — 1398 × 2034, 460 ppi.",
      "Обидва екрани: ProMotion до 120 Гц, Always-On, True Tone; яскравість до 1000 ніт типова, 1600 ніт у HDR, 3000 ніт надворі; мінімум 1 ніт.",
      "Габарити (В × Ш × Т): складений — 117,8 × 84,1 × 11,3 мм; розкладений — 117,8 × 164,6 × 5,2 мм. Маса — 254 г.",
      "Конструкція: титанові рамка й накладка шарніра; Ceramic Shield 2 спереду та Ceramic Shield ззаду. Шарнір підтримує центральну ділянку розгорнутого екрана, а нанотекстура зменшує відблиски.",
      "Захист IP68: лабораторний тест до 6 м на 30 хвилин. Водостійкість зменшується зі зношенням; мокрий телефон не заряджають.",
      "A20 Pro: CPU із двома супер’ядрами та чотирма енергоефективними ядрами, 7-ядерний GPU і два 16-ядерні Neural Engine для графіки та обчислень ШІ.",
      "Випарна камера відводить тепло від чипа під час ігор, багатозадачності й обробки ШІ. Вона допомагає довше підтримувати продуктивність під навантаженням.",
      "Ультраширококутна камера: 48 Мп, 13 мм, ƒ/2,2, кут 120°. Підходить для широких сцен і макрознімання.",
      "Зовнішня фронтальна камера: 12 Мп Center Stage, ƒ/2,2, автоматичне компонування групових кадрів; запис до 4K Dolby Vision 60 кадрів/с.",
      "Внутрішня FaceTime-камера прихована під дисплеєм: ƒ/1,8, Center Stage для дзвінків, відео 1080p 30/60 кадрів/с. Apple не вказує її роздільну здатність у мегапікселях.",
      "Відео: до 4K Dolby Vision 120 кадрів/с на основній камері; Cinematic до 4K 60 кадрів/с, Action до 2,8K 60 кадрів/с. Формати запису — HEVC і H.264.",
      "Потокове відео: до 37 год на зовнішньому екрані або до 26 год на внутрішньому. Автономність залежить від мережі, налаштувань і навантаження.",
      "Дротове заряджання: до 50% приблизно за 20 хвилин з USB-PD адаптером від 60 Вт і відповідним USB-C кабелем. Адаптер купують окремо; фактичний час залежить від умов.",
      "MagSafe та Qi2: до 25 Вт. Для заявлених 50% приблизно за 30 хвилин Apple вказує MagSafe Charger та адаптер від 35 Вт; обидва продаються окремо.",
      "Лише eSIM у всіх регіонах: дві активні лінії, зберігання восьми або більше профілів. Фізичної SIM немає; потрібні сумісний оператор і тариф.",
      "Зв’язок: модем Apple C2, 5G, чип N1 із Wi-Fi 7, Bluetooth 6 і Thread. Підтримка діапазонів та мережевих можливостей залежить від регіону й оператора.",
      "USB-C передає дані через USB 3 до 10 Гбіт/с. Для максимальної швидкості потрібен окремий кабель USB 3; сам роз’єм USB-C швидкість не визначає.",
      "Apple Pencil (USB-C) заявлено для обох екранів пізніше у 2026 році. Станом на 18 жовтня цю можливість не слід обіцяти як уже доступну.",
      "Siri AI розгортається в бета-версії англійською. Доступність Apple Intelligence залежить від мови, регіону й функції; це не підтвердження підтримки української для кожного інструмента.",
      "Старт продажів у заявлених Apple країнах — 23 жовтня 2026 року; передзамовлення відкрито 16 жовтня. Станом на 18 жовтня дата старту ще попереду; наявність в Україні уточнюють окремо."
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
    summary: "iPhone 17e — модель для щоденного користування з OLED-екраном 6,1″, камерою 48 Мп і MagSafe. Порівняно з 16e пропонує A19 замість A18, накопичувач від 256 ГБ та магнітне бездротове заряджання до 15 Вт.",
    overview: [
      "Кольори: Black, White, Soft Pink",
      "Екран: 6,1″ OLED Super Retina XDR, 2532 × 1170",
      "Чип: A19, 6-ядерний CPU та 4-ядерний GPU",
      "Камери: 48 Мп Fusion; передня 12 Мп TrueDepth",
      "Пам’ять: 256 або 512 ГБ",
      "Біометрія: Face ID",
      "Автономність: до 26 год відтворення відео за методикою Apple",
      "Заряджання: через USB-C; MagSafe та Qi2 — до 15 Вт",
      "Корпус: 146,7 × 71,5 × 7,8 мм; 169–170 г залежно від регіональної версії"
    ],
    highlights: [
      "Дисплей: OLED Super Retina XDR 6,1″, роздільна здатність 2532 × 1170 і щільність 460 ppi.",
      "Процесор: A19 із 6 ядрами CPU — 2 продуктивними та 4 енергоефективними.",
      "Основна камера: 48 Мп Fusion, еквівалент 26 мм, ƒ/1,6, оптична стабілізація; знімки у 24 або 48 Мп.",
      "Бездротове заряджання: MagSafe та Qi2 до 15 Вт; магніти вирівнюють сумісну зарядку й утримують MagSafe-аксесуари.",
      "Розблокування: Face ID через систему TrueDepth; також використовується для підтвердження покупок і входу в застосунки.",
      "Порівняння з iPhone 17: у 17e немає ProMotion, Always-On та окремої надширококутної камери. iPhone 17 варто розглянути, якщо потрібні ці можливості.",
      "Графіка й обчислення: 4 ядра GPU з Neural Accelerators, 16-ядерний Neural Engine та апаратне трасування променів.",
      "Яскравість: до 800 ніт у звичайному режимі та 1200 ніт у HDR; є True Tone і колірне охоплення P3.",
      "Матеріали: алюмінієвий корпус, скляна задня панель і захисне скло Ceramic Shield 2 спереду з покриттям проти відблисків.",
      "Розміри й вага: 146,7 × 71,5 × 7,8 мм; 169 г у версії США та 170 г у версії Великої Британії.",
      "Захист: IP68 — лабораторне випробування до 6 м протягом 30 хв; стійкість до води зменшується зі зношенням.",
      "Керування: кнопка дії для вибраної функції, наприклад камери, ліхтарика або режиму зосередження.",
      "Наближення 2×: 12 Мп із основної 48-Мп камери з оптичною якістю; це кадрування, а не окремий телеоб’єктив.",
      "Фотографії: нічний режим, Smart HDR 5 і портрети з можливістю змінювати фокус та розмиття після зйомки.",
      "Передня камера: 12 Мп TrueDepth, ƒ/1,9 та автофокус; запис Dolby Vision до 4K 60 кадрів/с.",
      "Відео основної камери: Dolby Vision до 4K 60 кадрів/с; уповільнена зйомка 1080p до 240 кадрів/с.",
      "Звук: стереодинаміки, запис просторового та стереозвуку, зменшення шуму вітру й Audio Mix для роботи зі звуком відео.",
      "Автономність: до 26 год відтворення відео або до 21 год потокового відео за тестами Apple; фактичний час залежить від використання.",
      "Дротове заряджання: до 50% приблизно за 30 хв із USB-C кабелем та адаптером від 20 Вт; адаптер купують окремо.",
      "Передавання даних: роз’єм USB-C працює за стандартом USB 2 зі швидкістю до 480 Мбіт/с.",
      "Мобільний зв’язок: модем Apple C1X, 5G sub-6 GHz і Gigabit LTE з 4×4 MIMO; підтримка мереж залежить від оператора та моделі.",
      "Бездротові інтерфейси: Wi-Fi 6 (802.11ax) з 2×2 MIMO, Bluetooth 5.3, NFC; для навігації підтримуються GPS та інші супутникові системи.",
      "SIM: версія США використовує лише eSIM; у Великій Британії є nano-SIM та eSIM. Перед продажем звіряйте регіон конкретного пристрою.",
      "Система й безпека: на старті iOS 26; Apple Intelligence залежить від мови й регіону. Є виявлення аварій; супутникові служби працюють у підтримуваних країнах.",
      "Комплект: iPhone, кабель USB-C завдовжки 1 м і документація; адаптер живлення та EarPods не входять.",
      "Порівняння з 16e: A19 замість A18, базові 256 замість 128 ГБ, C1X замість C1 і MagSafe/Qi2 до 15 Вт замість Qi до 7,5 Вт."
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
      "Регіон перевіряйте за номером моделі Axxxx та офіційними характеристиками, а не лише за країною продавця.",
      "Підтримка eSIM і фізичних SIM різниться навіть усередині одного покоління. Для Air та Duo одразу обговоріть eSIM.",
      "Підтримка частот 5G сама по собі не гарантує доступ до 5G: потрібні сумісний оператор, тариф і покриття.",
      "Apple Intelligence, Siri, супутникові функції та окремі сервіси залежать від моделі, мови й регіону. Перевіряйте потрібну функцію перед обіцянкою покупцю.",
      "Місцеві правила, оператор і налаштування можуть впливати на окремі функції. Не узагальнюйте старі регіональні обмеження на всі нові моделі.",
      "Для гарантійного звернення важливі документи про купівлю та умови продавця або сервісного центру. Не обіцяйте однакове обслуговування в кожній країні."
    ]
  },
  {
    type: "text",
    title: "Як визначити регіон за номером моделі",
    html: `
      <ol>
        <li>Відкрийте «Налаштування» → «Загальні» → «Про пристрій».</li>
        <li>У полі «Номер моделі» спочатку видно артикул, наприклад із закінченням <strong>/A</strong>. Натисніть на нього, щоб побачити номер <strong>Axxxx</strong>.</li>
        <li>Знайдіть Axxxx у <a href="https://support.apple.com/en-us/108044" target="_blank" rel="noopener noreferrer">довіднику моделей Apple</a> і звірте конфігурацію SIM та інші відмінності.</li>
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
      <p>Це адаптер для SIM-картки, що використовується для роботи заблокованого під оператора iPhone в іншій мережі. Він не є офіційним розблокуванням оператором; після оновлення або повторної активації зв’язок може перестати працювати.</p>
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
      <p><strong>Важливо:</strong> Ceramic Shield та захист IP68 не роблять пристрій невразливим до падінь або води. Не демонструйте захист зануренням чи ударами.</p>
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
    type: "text",
    title: "Як користуватися каталогом моделей",
    html: `
      <p>Каталог охоплює покоління від iPhone X до iPhone 18 Pro та iPhone Duo. Спочатку визначте сценарій покупця, потім порівняйте дві-три відповідні моделі.</p>
      <ol>
        <li><strong>Розмір:</strong> екран, маса та зручність у руці.</li>
        <li><strong>Камери:</strong> потрібні об’єктиви, наближення та формати відео.</li>
        <li><strong>Щоденне користування:</strong> пам’ять, автономність, SIM і заряджання.</li>
        <li><strong>Для вживаного:</strong> фактичний стан, акумулятор та історія ремонту.</li>
      </ol>
      <p><strong>Новинки 2026 року:</strong> iPhone 18 Pro, 18 Pro Max і складаний iPhone Duo. Старт продажів Duo в Apple заплановано на <strong>23 жовтня 2026 року</strong>; наявність у магазині уточнюйте окремо. В актуальному каталозі Apple станом на 18 жовтня немає базового iPhone 18 або 18 Plus.</p>
    `
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
    html: `
      <p>Дані про новинки та моделі 2025–2026 років актуальні на <strong>18 жовтня 2026 року</strong>. Офіційні специфікації допоможуть перевірити регіональну версію та доступність потрібних функцій.</p>
      <ul>
        <li><a href="https://www.apple.com/iphone-18-pro/specs/" target="_blank" rel="noopener noreferrer">iPhone 18 Pro та 18 Pro Max — характеристики</a> · <a href="https://www.apple.com/newsroom/2026/09/apple-debuts-iphone-18-pro-and-iphone-18-pro-max/" target="_blank" rel="noopener noreferrer">анонс Apple</a>.</li>
        <li><a href="https://www.apple.com/iphone-duo/specs/" target="_blank" rel="noopener noreferrer">iPhone Duo — характеристики</a> · <a href="https://www.apple.com/iphone-duo/" target="_blank" rel="noopener noreferrer">можливості та старт продажів</a>.</li>
        <li><a href="https://www.apple.com/iphone-air/specs/" target="_blank" rel="noopener noreferrer">iPhone Air</a>, <a href="https://www.apple.com/iphone-17/specs/" target="_blank" rel="noopener noreferrer">iPhone 17</a> та <a href="https://www.apple.com/iphone-17e/specs/" target="_blank" rel="noopener noreferrer">iPhone 17e</a>.</li>
        <li><a href="https://support.apple.com/en-us/125090" target="_blank" rel="noopener noreferrer">iPhone 17 Pro</a> та <a href="https://support.apple.com/en-us/125091" target="_blank" rel="noopener noreferrer">iPhone 17 Pro Max</a>.</li>
      </ul>
      <p><strong>Перед консультацією:</strong> уточніть фактичну наявність, ціну, комплектацію й умови обслуговування в магазині. Час роботи та швидкість заряджання залежать від умов використання й аксесуарів.</p>
    `
  }
];

const appleIphoneContent = {
  iphoneProductCatalog,
  iphoneFoundationBlocks,
  iphoneCatalogBlocks
};

export default appleIphoneContent;
