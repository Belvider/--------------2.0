import type { ModuleCatalogProduct, ModuleContentBlock } from "../module-content";

export const appleWatchSeriesCatalog: ModuleCatalogProduct[] = [
  {
    slug: "apple-watch-series-3-2017",
    title: "Apple Watch Series 3 (2017)",
    family: "Series",
    summary: "Класичний вхід у лінійку Apple Watch для базових сповіщень, активності та знайомства з екосистемою смарт-годинників Apple.",
    overview: ["Дисплей: OLED Retina", "Корпус: 38 мм / 42 мм", "Процесор: Apple S3, чіп W2"],
    highlights: [
      "Дисплей: OLED Retina",
      "Корпус: алюмінієвий, 38 мм та 42 мм",
      "Кнопки: Digital Crown",
      "Процесор: Apple S3, чіп W2",
      "ОС: watchOS",
      "Пам’ять: 8 ГБ (з LTE — 16 ГБ)",
      "Модулі: GPS, ГЛОНАСС",
      "Висотомір: барометричний",
      "Bluetooth 4.2",
      "Захист: вода до 50 м",
      "Аудіо: динамік, мікрофон",
      "Автономність: до 18 год",
      "Датчики: акселерометр, гіроскоп",
      "Здоров’я: пульс, сповіщення про ритм",
      "Безпека: SOS"
    ],
    colors: [
      { label: "Основний рендер", imageUrl: "/materials/apple-watch/1.png", caption: "Основний рендер моделі", default: true },
      { label: "Silver (Aluminum)", imageUrl: "/materials/apple-watch/Color/3/Silver-Photoroom.png", caption: "Алюміній: Silver" },
      { label: "Space Gray (Aluminum)", imageUrl: "/materials/apple-watch/Color/3/SpaceGray-Photoroom.png", caption: "Алюміній: Space Gray" },
      { label: "Gold (Aluminum)", imageUrl: "/materials/apple-watch/Color/3/gold-Photoroom.png", caption: "Алюміній: Gold" }
    ]
  },
  {
    slug: "apple-watch-series-4-2018",
    title: "Apple Watch Series 4 (2018)",
    family: "Series",
    summary: "Покоління зі збільшеним дисплеєм, тактильним Digital Crown та підтримкою ЕКГ, що стало важливою віхою еволюції Apple Watch.",
    overview: ["Дисплей: OLED Retina", "Корпус: 40 мм / 44 мм", "Процесор: Apple S4, чіп W3"],
    highlights: [
      "Дисплей: OLED Retina",
      "Корпус: алюмінієвий, 40 мм та 44 мм",
      "Кнопки: Digital Crown з тактильним відгуком",
      "Процесор: Apple S4, чіп W3",
      "ОС: watchOS",
      "Пам’ять: 16 ГБ",
      "Модулі: GPS, ГЛОНАСС, LTE, Galileo",
      "Висотомір: барометричний",
      "Bluetooth 5.0",
      "Захист: вода до 50 м",
      "Аудіо: динамік 2-го покоління, мікрофон",
      "Автономність: до 18 год",
      "Датчики: акселерометр, гіроскоп",
      "Здоров’я: пульс, ЕКГ",
      "Безпека: падіння, SOS"
    ],
    colors: [
      { label: "Основний рендер", imageUrl: "/materials/apple-watch/4.png", caption: "Основний рендер моделі", default: true },
      { label: "Silver (Aluminum)", imageUrl: "/materials/apple-watch/Color/4/Silver-Photoroom.png", caption: "Алюміній: Silver" },
      { label: "Space Gray (Aluminum)", imageUrl: "/materials/apple-watch/Color/4/SpaceGray-Photoroom.png", caption: "Алюміній: Space Gray" },
      { label: "Gold (Aluminum)", imageUrl: "/materials/apple-watch/Color/4/Gold-Photoroom.png", caption: "Алюміній: Gold" }
    ]
  },
  {
    slug: "apple-watch-series-5-2019",
    title: "Apple Watch Series 5 (2019)",
    family: "Series",
    summary: "Перше покоління з Always-On Display, яке зробило Apple Watch зручнішим для постійного зчитування часу та циферблата.",
    overview: ["Дисплей: OLED Retina з Always-On", "Корпус: 40 мм / 44 мм", "Процесор: Apple S5, чіп W3"],
    highlights: [
      "Дисплей: OLED Retina з Always-On Display",
      "Корпус: алюмінієвий, 40 мм та 44 мм",
      "Кнопки: Digital Crown з тактильним відгуком",
      "Процесор: Apple S5, чіп W3",
      "ОС: watchOS",
      "Пам’ять: 32 ГБ",
      "Модулі: GPS, ГЛОНАСС, LTE, Galileo",
      "Висотомір: барометричний",
      "Bluetooth 5.0",
      "Захист: вода до 50 м",
      "Аудіо: динамік 2-го покоління, мікрофон",
      "Автономність: до 18 год",
      "Датчики: акселерометр, гіроскоп, компас",
      "Здоров’я: пульс, ЕКГ",
      "Безпека: падіння, SOS"
    ],
    colors: [
      { label: "Основний рендер", imageUrl: "/materials/apple-watch/5.png", caption: "Основний рендер моделі", default: true },
      { label: "Silver (Aluminum)", imageUrl: "/materials/apple-watch/Color/5/Silver-Photoroom.png", caption: "Алюміній: Silver" },
      { label: "Space Gray (Aluminum)", imageUrl: "/materials/apple-watch/Color/5/Spacegray-Photoroom.png", caption: "Алюміній: Space Gray" },
      { label: "Gold (Aluminum)", imageUrl: "/materials/apple-watch/Color/5/Gold-Photoroom.png", caption: "Алюміній: Gold" }
    ]
  },
  {
    slug: "apple-watch-series-6-2020",
    title: "Apple Watch Series 6 (2020)",
    family: "Series",
    summary: "Серія, де Apple активно розвинула напрям функцій здоров’я завдяки вимірюванню кисню в крові та швидшій платформі S6.",
    overview: ["Дисплей: OLED Retina з Always-On", "Корпус: 40 мм / 44 мм", "Процесор: Apple S6, чіпи W3 та U1"],
    highlights: [
      "Дисплей: OLED Retina з Always-On Display",
      "Корпус: алюмінієвий, 40 мм та 44 мм",
      "Кнопки: Digital Crown з тактильним відгуком",
      "Процесор: Apple S6, чіпи W3 та U1",
      "ОС: watchOS",
      "Пам’ять: 32 ГБ",
      "Модулі: GPS, ГЛОНАСС, LTE, Galileo",
      "Висотомір: завжди активний",
      "Bluetooth 5.0",
      "Захист: вода до 50 м",
      "Аудіо: динамік 2-го покоління, мікрофон",
      "Автономність: до 18 год",
      "Датчики: акселерометр, гіроскоп, компас",
      "Здоров’я: пульс, ЕКГ, кисень у крові",
      "Безпека: падіння, SOS"
    ],
    colors: [
      { label: "Основний рендер", imageUrl: "/materials/apple-watch/6.png", caption: "Основний рендер моделі", default: true },
      { label: "Silver (Aluminum)", imageUrl: "/materials/apple-watch/Color/6/Silver-Photoroom%20(1).png", caption: "Алюміній: Silver" },
      { label: "Space Gray (Aluminum)", imageUrl: "/materials/apple-watch/Color/6/SpaceGray-Photoroom%20(1).png", caption: "Алюміній: Space Gray" },
      { label: "Blue (Aluminum)", imageUrl: "/materials/apple-watch/Color/6/Blue-Photoroom.png", caption: "Алюміній: Blue" },
      { label: "Product Red (Aluminum)", imageUrl: "/materials/apple-watch/Color/6/Red-Photoroom.png", caption: "Алюміній: Product Red" }
    ]
  },
  {
    slug: "apple-watch-series-7-2021",
    title: "Apple Watch Series 7 (2021)",
    family: "Series",
    summary: "Оновлення з більшим дисплеєм, швидшим заряджанням та пилозахистом IP6X для щоденного активного використання.",
    overview: ["Дисплей: OLED Retina з Always-On", "Корпус: 41 мм / 45 мм", "Процесор: Apple S7, чіпи W3 та U1"],
    highlights: [
      "Дисплей: OLED Retina з Always-On Display",
      "Корпус: алюмінієвий, 41 мм та 45 мм",
      "Кнопки: Digital Crown з тактильним відгуком",
      "Процесор: Apple S7, чіпи W3 та U1",
      "ОС: watchOS",
      "Пам’ять: 32 ГБ",
      "Модулі: GPS, ГЛОНАСС, LTE, Galileo",
      "Висотомір: завжди активний",
      "Bluetooth 5.0",
      "Захист: вода до 50 м, пил IP6X",
      "Аудіо: динамік 2-го покоління, мікрофон",
      "Автономність: до 18 год, швидке заряджання",
      "Датчики: акселерометр, гіроскоп, компас",
      "Здоров’я: пульс, ЕКГ, кисень у крові",
      "Безпека: падіння, SOS"
    ],
    colors: [
      { label: "Основний рендер", imageUrl: "/materials/apple-watch/7.png", caption: "Основний рендер моделі", default: true },
      { label: "Midnight (Aluminum)", imageUrl: "/materials/apple-watch/Color/7/Midnight-Photoroom.png", caption: "Алюміній: Midnight" },
      { label: "Starlight (Aluminum)", imageUrl: "/materials/apple-watch/Color/7/Starlight-Photoroom.png", caption: "Алюміній: Starlight" },
      { label: "Green (Aluminum)", imageUrl: "/materials/apple-watch/Color/7/Green-Photoroom.png", caption: "Алюміній: Green" },
      { label: "Blue (Aluminum)", imageUrl: "/materials/apple-watch/Color/7/Blue-Photoroom.png", caption: "Алюміній: Blue" },
      { label: "Product Red (Aluminum)", imageUrl: "/materials/apple-watch/Color/7/Red-Photoroom.png", caption: "Алюміній: Product Red" }
    ]
  },
  {
    slug: "apple-watch-series-8-2022",
    title: "Apple Watch Series 8 (2022)",
    family: "Series",
    summary: "Збалансоване покоління з датчиком температури тіла, Crash Detection і кращим увагою до показників здоров’я для масового користувача.",
    overview: ["Дисплей: OLED Retina з Always-On", "Корпус: 41 мм / 45 мм", "Процесор: Apple S8, чіпи W3 та U1"],
    highlights: [
      "Дисплей: OLED Retina з Always-On Display",
      "Корпус: алюмінієвий, 41 мм та 45 мм",
      "Кнопки: Digital Crown з тактильним відгуком",
      "Процесор: Apple S8, чіпи W3 та U1",
      "ОС: watchOS 9",
      "Пам’ять: 32 ГБ",
      "Модулі: GPS, ГЛОНАСС, LTE, Galileo",
      "Висотомір: завжди активний",
      "Bluetooth 5.0",
      "Захист: вода до 50 м, пил IP6X",
      "Аудіо: динамік 2-го покоління, мікрофон",
      "Автономність: до 18 год, швидке заряджання",
      "Датчики: акселерометр, гіроскоп, компас",
      "Компас: «Пункти маршруту» і «Пройдений маршрут»",
      "Здоров’я: пульс, ЕКГ, кисень у крові, температура тіла, цикл/овуляція",
      "Безпека: падіння, SOS, аварії",
      "Комплектні ремінці: S/M – M/L (залежно від кольору)"
    ],
    colors: [
      { label: "Основний рендер", imageUrl: "/materials/apple-watch/8.png", caption: "Основний рендер моделі", default: true },
      { label: "Silver (Aluminum)", imageUrl: "/materials/apple-watch/Color/8/Silver-Photoroom.png", caption: "Алюміній: Silver" },
      { label: "Midnight (Aluminum)", imageUrl: "/materials/apple-watch/Color/8/Midnight-Photoroom.png", caption: "Алюміній: Midnight" },
      { label: "Starlight (Aluminum)", imageUrl: "/materials/apple-watch/Color/8/Starlight-Photoroom.png", caption: "Алюміній: Starlight" },
      { label: "Product Red (Aluminum)", imageUrl: "/materials/apple-watch/Color/8/Red-Photoroom.png", caption: "Алюміній: Product Red" }
    ]
  },
  {
    slug: "apple-watch-series-9-2023",
    title: "Apple Watch Series 9 (2023)",
    family: "Series",
    summary: "Покоління з чипом S9, яскравішим екраном, Double Tap і швидшою Siri, яке добре продається як сучасний універсальний Apple Watch.",
    overview: ["Дисплей: OLED Retina Always-On до 2000 ніт", "Корпус: 41 мм / 45 мм", "Процесор: Apple S9, чіпи W3 та U1"],
    highlights: [
      "Дисплей: OLED Retina з Always-On Display, яскравість до 2000 ніт",
      "Корпус: алюмінієвий, 41 мм та 45 мм",
      "Кнопки: Digital Crown з тактильним відгуком",
      "Процесор: Apple S9, чіпи W3 та U1",
      "ОС: watchOS 9",
      "Пам’ять: 64 ГБ",
      "Модулі: GPS, ГЛОНАСС, LTE, Galileo",
      "Висотомір: завжди активний",
      "Bluetooth 5.3",
      "Захист: вода до 50 м, пил IP6X",
      "Аудіо: динамік 2-го покоління, мікрофон",
      "Автономність: до 18 год (до 36 год в енергозбереженні), швидке заряджання",
      "Датчики: акселерометр, гіроскоп, компас",
      "Компас: «Пункти маршруту» і «Пройдений маршрут»",
      "Siri: швидша, з доступом до даних про здоров’я",
      "Функції: NameDrop, точний пошук iPhone",
      "Здоров’я: пульс, ЕКГ, кисень у крові, температура тіла, цикл/овуляція",
      "Безпека: падіння, SOS, аварії",
      "Комплектні ремінці: S/M – M/L (залежно від кольору)"
    ],
    colors: [
      { label: "Основний рендер", imageUrl: "/materials/apple-watch/9.png", caption: "Основний рендер моделі", default: true },
      { label: "Silver (Aluminum)", imageUrl: "/materials/apple-watch/Color/9/Silver-Photoroom.png", caption: "Алюміній: Silver" },
      { label: "Midnight (Aluminum)", imageUrl: "/materials/apple-watch/Color/9/Midnight-Photoroom.png", caption: "Алюміній: Midnight" },
      { label: "Pink (Aluminum)", imageUrl: "/materials/apple-watch/Color/9/Pink-Photoroom.png", caption: "Алюміній: Pink" },
      { label: "Starlight (Aluminum)", imageUrl: "/materials/apple-watch/Color/9/Starlight-Photoroom.png", caption: "Алюміній: Starlight" },
      { label: "Product Red (Aluminum)", imageUrl: "/materials/apple-watch/Color/9/red-Photoroom.png", caption: "Алюміній: Product Red" }
    ]
  },
  {
    slug: "apple-watch-series-10-2024",
    title: "Apple Watch Series 10 (2024)",
    family: "Series",
    summary: "Оновлена серія з тоншим корпусом, ширококутним LTPO3-дисплеєм, титановими варіантами та акцентом на сучасний дизайн і здоров’я.",
    overview: ["Дисплей: LTPO3 OLED Retina Always-On", "Розміри: 42 мм / 46 мм", "Процесор: Apple S10 з 4-ядерним Neural Engine"],
    highlights: [
      "Дисплей: LTPO3 OLED Retina, Always-On, ширококутний",
      "Розміри: 42 мм та 46 мм",
      "Яскравість: до 2000 ніт (на 40% яскравіше під кутом)",
      "Корпус: алюміній або титан",
      "Товщина: 9.7 мм (на 10% тонше за попередню модель)",
      "Процесор: Apple S10 з 4-ядерним Neural Engine",
      "ОС: watchOS 11",
      "Пам’ять: 64 ГБ",
      "Автономність: до 18 годин",
      "Швидке заряджання: до 80% за 30 хв",
      "Датчики: серцебиття (електричний + оптичний), SpO₂, компас, барометр, температура води, глибина",
      "Водонепроникність: до 50 м",
      "Підключення: Wi-Fi 4, Bluetooth 5.3, GPS, GLONASS, Galileo, QZSS, BeiDou",
      "Комплектні ремінці: S/M – M/L (залежно від кольору)"
    ],
    colors: [
      { label: "Основний рендер", imageUrl: "/materials/apple-watch/10.png", caption: "Основний рендер моделі", default: true },
      { label: "Silver (Aluminum)", imageUrl: "/materials/apple-watch/Color/10/Silver-Photoroom.png", caption: "Алюміній: Silver" },
      { label: "Jet Black (Aluminum)", imageUrl: "/materials/apple-watch/Color/10/JetBlack-Photoroom.png", caption: "Алюміній: Jet Black" },
      { label: "Gold (Aluminum)", imageUrl: "/materials/apple-watch/Color/10/Gold-Photoroom.png", caption: "Алюміній: Gold" },
      { label: "Rose Gold (Aluminum)", imageUrl: "/materials/apple-watch/Color/10/RoseGold-Photoroom.png", caption: "Алюміній: Rose Gold" },
      { label: "Natural Titanium", imageUrl: "/materials/apple-watch/Color/10/NaturalT-Photoroom.png", caption: "Титан: Natural" },
      { label: "Slate Titanium", imageUrl: "/materials/apple-watch/Color/10/SlateT-Photoroom.png", caption: "Титан: Slate" }
    ]
  },
  {
    slug: "apple-watch-series-11-2025",
    title: "Apple Watch Series 11 (2025)",
    family: "Series",
    summary: "Модель серії Series для щоденного використання, тренувань і спостереження за показниками здоров’я.",
    overview: ["Дисплей: LTPO OLED Retina Always-On до 2000 ніт", "Пам’ять: 64 ГБ", "Процесор: Apple S11 SiP"],
    highlights: [
      "Дисплей: LTPO OLED Retina, Always-On, до 2000 ніт",
      "Процесор: Apple S11 SiP (64-біт, 2 ядра)",
      "Neural Engine: 4-ядерна система",
      "ОС: watchOS 12",
      "Пам’ять: 64 ГБ",
      "Скло: Ion-X (алюміній), сапфірове (титан)",
      "Модулі: GPS, LTE, Galileo, ГЛОНАСС",
      "Bluetooth 5.4, Wi-Fi 802.11n, NFC",
      "Датчики: акселерометр, гіроскоп, компас, барометр, освітлення",
      "Глибиномір до 6 м + датчик температури води",
      "Точний пошук iPhone, NameDrop",
      "Здоров’я: пульс, ЕКГ, кисень у крові, температура тіла, цикл/овуляція",
      "Новий додаток Vitals + Sleep Score + виявлення апное",
      "Безпека: падіння, SOS, аварії, сирена",
      "Автономність: до 24 год (до 38 год в енергозбереженні)",
      "Швидке заряджання: 80% за ~30 хв, 8 год сну після 5 хв зарядки"
    ],
    colors: [
      { label: "Основний рендер", imageUrl: "/materials/apple-watch/11.png", caption: "Основний рендер моделі", default: true },
      { label: "Silver (Aluminum)", imageUrl: "/materials/apple-watch/Color/11/Silver-Photoroom.png", caption: "Алюміній: Silver" },
      { label: "Jet Black (Aluminum)", imageUrl: "/materials/apple-watch/Color/11/JetBlack-Photoroom.png", caption: "Алюміній: Jet Black" },
      { label: "Space Gray (Aluminum)", imageUrl: "/materials/apple-watch/Color/11/SpaceGray-Photoroom.png", caption: "Алюміній: Space Gray" },
      { label: "Gold Titanium", imageUrl: "/materials/apple-watch/Color/11/GoldTitanium-Photoroom.png", caption: "Титан: Gold" },
      { label: "Natural Titanium", imageUrl: "/materials/apple-watch/Color/11/NaturalTitanium-Photoroom.png", caption: "Титан: Natural" },
      { label: "Slate Titanium", imageUrl: "/materials/apple-watch/Color/11/SlateTitanium-Photoroom.png", caption: "Титан: Slate" }
    ]
  }
];

export const appleWatchSECatalog: ModuleCatalogProduct[] = [
  {
    slug: "apple-watch-se-2020",
    title: "Apple Watch SE (2020)",
    family: "SE",
    summary: "Доступніший Apple Watch для базових smart-функцій, активності та першого знайомства з екосистемою без переплати за флагманські можливості.",
    overview: ["Дисплей: OLED Retina", "Корпус: 40 мм / 44 мм", "Процесор: Apple S5, чіп W3"],
    highlights: [
      "Дисплей: OLED Retina",
      "Корпус: алюмінієвий, 40 мм та 44 мм",
      "Кнопки: Digital Crown з тактильним відгуком",
      "Процесор: Apple S5, чіп W3",
      "ОС: watchOS",
      "Пам’ять: 32 ГБ",
      "Модулі: GPS, ГЛОНАСС, LTE, Galileo",
      "Висотомір: завжди активний",
      "Bluetooth 5.0",
      "Захист: вода до 50 м",
      "Аудіо: динамік 2-го покоління, мікрофон",
      "Автономність: до 18 год",
      "Датчики: акселерометр, гіроскоп, компас",
      "Здоров’я: пульс, сповіщення про ритм",
      "Безпека: падіння, SOS",
      "Комплектні ремінці: S/M – M/L (залежно від кольору)"
    ],
    colors: [
      { label: "Основний рендер", imageUrl: "/materials/apple-watch/SE.png", caption: "Основний рендер моделі", default: true },
      { label: "Silver", imageUrl: "/materials/apple-watch/Color/SE1/Silver-Photoroom%20(1).png", caption: "Колір: Silver" },
      { label: "Midnight", imageUrl: "/materials/apple-watch/Color/SE1/Midnight-Photoroom.png", caption: "Колір: Midnight" },
      { label: "Starlight", imageUrl: "/materials/apple-watch/Color/SE1/Starlight-Photoroom.png", caption: "Колір: Starlight" }
    ]
  },
  {
    slug: "apple-watch-se-2-2022",
    title: "Apple Watch SE 2 (2022)",
    family: "SE",
    summary: "Оновлена доступна модель із чипом S8 та Crash Detection, яку легко позиціонувати як практичний вибір для більшості користувачів.",
    overview: ["Дисплей: OLED Retina", "Корпус: 40 мм / 44 мм", "Процесор: Apple S8, чіп W3"],
    highlights: [
      "Дисплей: OLED Retina",
      "Корпус: алюмінієвий, 40 мм та 44 мм",
      "Кнопки: Digital Crown з тактильним відгуком",
      "Процесор: Apple S8, чіп W3",
      "ОС: watchOS 9",
      "Пам’ять: 32 ГБ",
      "Модулі: GPS, ГЛОНАСС, LTE, Galileo",
      "Висотомір: завжди активний",
      "Bluetooth 5.0",
      "Захист: вода до 50 м",
      "Аудіо: динамік 2-го покоління, мікрофон",
      "Автономність: до 18 год",
      "Датчики: акселерометр, гіроскоп, компас",
      "Компас: «Пункти маршруту» і «Пройдений маршрут»",
      "Здоров’я: пульс, цикл, сповіщення про ритм",
      "Безпека: падіння, SOS, аварії",
      "Комплектні ремінці: S/M – M/L (залежно від кольору)"
    ],
    colors: [
      { label: "Основний рендер", imageUrl: "/materials/apple-watch/SE2.png", caption: "Основний рендер моделі", default: true },
      { label: "Silver", imageUrl: "/materials/apple-watch/Color/SE2/Silver-Photoroom%20(1).png", caption: "Колір: Silver" },
      { label: "Midnight", imageUrl: "/materials/apple-watch/Color/SE2/Midnight-Photoroom.png", caption: "Колір: Midnight" },
      { label: "Starlight", imageUrl: "/materials/apple-watch/Color/SE2/Starlight-Photoroom.png", caption: "Колір: Starlight" }
    ]
  },
  {
    slug: "apple-watch-se-3-2025",
    title: "Apple Watch SE 3 (2025)",
    family: "SE",
    summary: "Модель лінійки SE для щоденних сповіщень, тренувань і знайомства з можливостями Apple Watch.",
    overview: ["Дисплей: OLED LTPO Retina Always-On", "Корпус: 40 мм / 44 мм", "Процесор: Apple S10"],
    highlights: [
      "Дисплей: OLED LTPO Retina, Always-On, до 1000 ніт",
      "Корпус: алюмінієвий, 40 мм та 44 мм",
      "Скло: Ion-X (4× стійкіше до тріщин)",
      "Процесор: Apple S10, 4-ядерний Neural Engine",
      "ОС: watchOS 12",
      "Пам’ять: 64 ГБ",
      "Модулі: GPS, ГЛОНАСС, LTE, Galileo, QZSS, BeiDou",
      "Bluetooth 5.3, Wi-Fi 802.11n",
      "Захист: вода до 50 м",
      "Автономність: до 18 год (до 32 год у Low Power Mode)",
      "Швидке заряджання: 80% за ~45 хв",
      "Датчики: пульс (2-го покоління), температура тіла, компас, висотомір, акселерометр, гіроскоп",
      "Здоров’я: цикл, сон, апное, сповіщення про ритм",
      "Безпека: падіння, аварії, SOS",
      "Жести: подвійний тап, flick-запуск"
    ],
    colors: [
      { label: "Основний рендер", imageUrl: "/materials/apple-watch/SE3.png", caption: "Основний рендер моделі", default: true },
      { label: "Starlight", imageUrl: "/materials/apple-watch/Color/SE3/Starlight-Photoroom.png", caption: "Колір: Starlight" },
      { label: "Midnight", imageUrl: "/materials/apple-watch/Color/SE3/Midnight-Photoroom.png", caption: "Колір: Midnight" }
    ]
  }
];

export const appleWatchUltraCatalog: ModuleCatalogProduct[] = [
  {
    slug: "apple-watch-ultra-2022",
    title: "Apple Watch Ultra (2022)",
    family: "Ultra",
    summary: "Перший Ultra для спорту, екстремальних умов, дайвінгу, походів і клієнтів, яким потрібні максимальна міцність та автономність.",
    overview: ["Дисплей: OLED Retina, плоский, сапфірове скло", "Корпус: титан 49 мм", "Процесор: Apple S8"],
    highlights: [
      "Дисплей: OLED Retina (плоский, сапфірове скло), Always On Display",
      "Корпус: титановий 49 мм (аерокосмічний сплав)",
      "Кнопки: Digital Crown + програмована кнопка",
      "Процесор: Apple S8, чіпи W3 та U1",
      "ОС: watchOS 9",
      "Пам’ять: 32 ГБ",
      "Модулі: GPS, ГЛОНАСС, LTE, Galileo",
      "Висотомір: завжди активний",
      "Bluetooth 5.3",
      "Захист: вода до 100 м, пил IP6X",
      "Глибиномір + датчик температури води",
      "Аудіо: 2 динаміки, 3 мікрофони",
      "Автономність: до 36 год (до 60 год в енергозбереженні), швидке заряджання",
      "Температурний режим: від -20°C до +55°C",
      "Датчики: акселерометр, гіроскоп, компас",
      "Компас: «Пункти маршруту» і «Пройдений маршрут»",
      "Здоров’я: пульс, ЕКГ, кисень у крові, температура тіла, цикл/овуляція",
      "Безпека: падіння, SOS, аварії, сирена"
    ],
    colors: [
      { label: "Natural Titanium", imageUrl: "/materials/apple-watch/Color/Ultra1/Natural-Photoroom.png", caption: "Корпус: Natural Titanium", default: true }
    ]
  },
  {
    slug: "apple-watch-ultra-2-2023",
    title: "Apple Watch Ultra 2 (2023/2024)",
    family: "Ultra",
    summary: "Оновлений Ultra з 3000 ніт, S9 і Double Tap — найсильніший вибір для outdoor, спорту та клієнтів, що хочуть максимум можливостей Apple Watch.",
    overview: ["Дисплей: OLED Retina Always-On до 3000 ніт", "Корпус: титан 49 мм", "Процесор: Apple S9"],
    highlights: [
      "Дисплей: OLED Retina (плоский, сапфірове скло), Always On Display",
      "Яскравість: до 3000 ніт",
      "Корпус: титановий 49 мм (аерокосмічний сплав)",
      "Кнопки: Digital Crown + програмована кнопка",
      "Процесор: Apple S9, чіпи W3 та U1",
      "ОС: watchOS 9",
      "Пам’ять: 64 ГБ",
      "Модулі: GPS, ГЛОНАСС, LTE, Galileo",
      "Висотомір: завжди активний",
      "Bluetooth 5.3",
      "Захист: вода до 100 м, пил IP6X",
      "Глибиномір + датчик температури води",
      "Аудіо: 2 динаміки, 3 мікрофони",
      "Автономність: до 36 год (до 72 год в енергозбереженні), швидке заряджання",
      "Температурний режим: від -20°C до +55°C",
      "Датчики: акселерометр, гіроскоп, компас",
      "Компас: «Пункти маршруту» і «Пройдений маршрут»",
      "Siri: швидша, з доступом до даних про здоров’я",
      "Функції: NameDrop, точний пошук iPhone",
      "Здоров’я: пульс, ЕКГ, кисень у крові, температура тіла, цикл/овуляція",
      "Безпека: падіння, SOS, аварії, сирена"
    ],
    colors: [
      { label: "Natural Titanium", imageUrl: "/materials/apple-watch/Color/Ultra2/Natural-Photoroom.png", caption: "Корпус: Natural Titanium", default: true },
      { label: "Black Titanium", imageUrl: "/materials/apple-watch/Color/Ultra2/Black-Photoroom.png", caption: "Корпус: Black Titanium" }
    ]
  },
  {
    slug: "apple-watch-ultra-3-2025",
    title: "Apple Watch Ultra 3 (2025)",
    family: "Ultra",
    summary: "Модель лінійки Ultra для тривалих тренувань, подорожей і використання на відкритому повітрі.",
    overview: ["Дисплей: LTPO3 OLED Retina Always-On до 3000 ніт", "Корпус: титан 49 мм", "Процесор: Apple S10"],
    highlights: [
      "Дисплей: LTPO3 OLED Retina, Always-On, до 3000 ніт",
      "Корпус: титановий, 49 мм (Natural, Black)",
      "Скло: плоске сапфірове",
      "Процесор: Apple S10, 4-ядерний Neural Engine",
      "ОС: watchOS 12",
      "Пам’ять: 64 ГБ",
      "Модулі: GPS (L1+L5), LTE, Galileo, QZSS, BeiDou",
      "Bluetooth 5.3, Wi-Fi 802.11n, NFC, UWB",
      "Захист: вода до 100 м, пил IP6X, MIL-STD 810H",
      "Автономність: до 42 год (до 72 год у Low Power Mode)",
      "Швидке заряджання: 80% за ~45 хв",
      "Датчики: пульс (3-го покоління), ЕКГ, SpO₂, температура тіла/води, глибина, компас, висотомір",
      "Здоров’я: апное, гіпертонія, цикл, сон, сповіщення про ритм",
      "Безпека: падіння, аварії, SOS, супутниковий зв’язок",
      "Аудіо: 3 мікрофони, 2 динаміки, сирена",
      "Жести: подвійний тап, flick-запуск"
    ],
    colors: [
      { label: "Natural Titanium", imageUrl: "/materials/apple-watch/Color/Ultra3/Natural-Photoroom%20(1).png", caption: "Титан: Natural", default: true },
      { label: "Black Titanium", imageUrl: "/materials/apple-watch/Color/Ultra3/Ultra3-Photoroom.png", caption: "Титан: Black" }
    ]
  }
];

export const appleWatchFoundationBlocks: ModuleContentBlock[] = [
  {
    type: "text",
    title: "Apple Watch",
    html: `<p>Apple Watch — досконалий гаджет для здорового способу життя. Він здатний робити те, чого не можуть інші ваші пристрої, тому що він у вас на зап’ясті. Це більше, ніж просто смарт-годинник. Вони поєднують стильний дизайн, передові технології та зручність для користувачів.</p><p>Apple Watch займає лідируючу позицію завдяки бездоганній інтеграції з іншими продуктами Apple, передовим технологіям у сфері здоров'я та фітнесу, а також можливості персоналізації під кожного користувача.</p><p>Надіваючи Apple Watch, ви отримуєте партнера для тренувань, важливу інформацію про своє здоров’я та можливість залишатися на зв’язку.</p>`
  },
  {
    type: "image",
    title: "Лінійка Apple Watch",
    url: "/materials/apple-watch/11.png",
    caption: "Лінійки Apple Watch"
  },
  {
    type: "text",
    title: "GPS vs GPS + Cellular (LTE)",
    html: `<p>Існує декілька видів годинників, а саме GPS та LTE. Apple Watch у версіях GPS (звичайні) та LTE (або GPS + Cellular) відрізняються як технічними характеристиками, так і функціональними можливостями.</p>
    <h3>Наявність LTE-модуля</h3>
    <ul>
      <li><strong>GPS-версія:</strong> працює лише при підключенні до iPhone або Wi‑Fi. Ви не можете телефонувати чи надсилати повідомлення без підключення до телефону.</li>
      <li><strong>GPS + Cellular (LTE):</strong> оснащений вбудованим модулем мобільного зв’язку. Це дозволяє використовувати годинник незалежно від iPhone, приймати дзвінки, надсилати повідомлення, використовувати програми та стримінг Apple Music навіть без телефону поруч <strong>(не працює на території України)</strong>.</li>
    </ul>
    <h3>Дизайн</h3>
    <ul>
      <li><strong>GPS-версія:</strong> цифрова коронка (Digital Crown) без червоного кільця.</li>
      <li><strong>GPS + Cellular:</strong> Digital Crown має червоне кільце або повністю червоний колір, що вказує на підтримку мобільного зв’язку.</li>
    </ul>
    <h3>Вартість</h3>
    <ul>
      <li><strong>GPS-версія:</strong> дешевша, оскільки не містить LTE-модуля.</li>
      <li><strong>GPS + Cellular:</strong> дорожча через додатковий функціонал.</li>
    </ul>
    <h3>Підписка на мобільний зв'язок</h3>
    <ul>
      <li><strong>GPS-версія:</strong> не потребує додаткової підписки.</li>
      <li><strong>GPS + Cellular:</strong> для роботи LTE необхідно підключити тарифний план мобільного оператора, що підтримує Apple Watch.</li>
    </ul>
    <h3>Функціональність</h3>
    <ul>
      <li><strong>GPS-версія:</strong> для функцій, як-от дзвінки, повідомлення, навігація, потрібен iPhone або Wi‑Fi.</li>
      <li><strong>GPS + Cellular:</strong> може виконувати всі ці функції автономно через мобільний зв’язок, без потреби в телефоні.</li>
    </ul>
    <h3>Час роботи батареї</h3>
    <ul>
      <li><strong>GPS-версія:</strong> батарея працює довше, оскільки немає LTE-модуля, який споживає більше енергії.</li>
      <li><strong>GPS + Cellular:</strong> час роботи батареї трохи менший через додаткове навантаження LTE.</li>
    </ul>
    <p><strong>Доступність:</strong> не всі країни чи оператори підтримують LTE-версію Apple Watch. Перед покупкою важливо перевірити сумісність у вашому регіоні.</p>`
  },
  {
    type: "text",
    title: "Ключові поняття та функції",
    html: `<ul>
      <li><strong>Digital Crown</strong> — коліщатко справа на корпусі годинника. Виконує функцію «Початок» або «Додому», також його можна використовувати для виклику Siri. Починаючи з 4 серії годинників Digital Crown має тактильний відгук. У версіях годинників з LTE на Digital Crown присутня червона полоска.</li>
      <li><strong>Always-On Display</strong> — на дисплеї завжди відображається час, а також циферблат чи остання запущена програма. Для збереження заряду акумулятора яскравість дисплея зменшується, коли користувач опускає зап’ястя.</li>
      <li><strong>Акселерометр</strong> — відповідає за вимірювання великих прискорень і використовується, зокрема, для виявлення падіння.</li>
      <li><strong>Виявлення падіння</strong> — якщо Apple Watch виявить жорстке падіння і ви не рухатиметесь протягом хвилини, він подасть вібросигнал, а потім спробує викликати екстрені служби та надіслати повідомлення вашим екстреним контактам.</li>
      <li><strong>Додаток «ЕКГ»</strong> — записує серцебиття та серцевий ритм за допомогою електричного датчика ритму серця.</li>
      <li><strong>Кисень у крові</strong> — за допомогою потужного датчика можна виміряти рівень кисню в крові прямо на зап’ясті. Вимірювання не призначене для медичного використання.</li>
      <li><strong>Жест подвійного дотику</strong> — керування годинником рухом пальців: можна відповісти на дзвінок, скинути, зупинити будильник тощо.</li>
      <li><strong>Crash Detection</strong> — функція виявлення серйозних автомобільних аварій з можливістю автоматично здійснити виклик до Екстрених служб.</li>
      <li><strong>Датчик температури тіла</strong> — вимірює температуру під час сну, допомагає з відстеженням циклу й ретроспективною оцінкою овуляції.</li>
      <li><strong>Сирена</strong> — в Apple Watch Ultra допомагає швидко оповістити оточення, що вам потрібна допомога.</li>
      <li><strong>NameDrop</strong> — швидкий обмін контактною інформацією між розташованими поруч iPhone або Apple Watch.</li>
      <li><strong>SOS через супутник</strong> — Apple Watch Ultra і новіші моделі підтримують функцію екстрених викликів через супутник у певних країнах.</li>
    </ul>
    <p><strong>Примітка:</strong> функція вимірювання рівня кисню в крові недоступна на пристроях Apple Watch Series 10 та Ultra 2, що продаються компанією Apple у США, починаючи з 18 січня 2024 року.</p>`
  },
  {
    type: "text",
    title: "Дисплеї Apple Watch",
    html: `<p>Дисплеї Apple Watch мають кілька ключових відмінностей залежно від моделі та серії. Вони впливають на роздільну здатність, яскравість, функціональність і зручність використання.</p>
    <h3>Типи дисплеїв</h3>
    <ul>
      <li><strong>Retina-дисплей:</strong> висока роздільна здатність із чіткими деталями. Використовується у всіх моделях Apple Watch, починаючи з Series 1.</li>
      <li><strong>Always-On Retina Display:</strong> вперше з’явився в Series 5. Дозволяє бачити циферблат і сповіщення, навіть коли зап’ястя опущене.</li>
    </ul>
    <h3>Розміри дисплея</h3>
    <ul>
      <li><strong>До Series 3:</strong> 38 мм і 42 мм.</li>
      <li><strong>Series 4 і 5:</strong> 40 мм і 44 мм — тонші рамки та більше корисного простору екрана.</li>
      <li><strong>Series 7 і 8:</strong> 41 мм і 45 мм — ще більший дисплей та заокруглені краї.</li>
      <li><strong>Series 9 і 10:</strong> 42 мм і 46 мм — максимальне відчуття великого екрана.</li>
      <li><strong>Apple Watch Ultra:</strong> найбільший дисплей — 49 мм, плоский екран із сапфіровим склом.</li>
    </ul>
    <h3>Покриття дисплея</h3>
    <ul>
      <li><strong>Іон-X скло:</strong> моделі з алюмінієвим корпусом. Легке та стійке до ударів, але менш стійке до подряпин.</li>
      <li><strong>Сапфірове скло:</strong> моделі з нержавіючої сталі або титану. Дуже стійке до подряпин.</li>
    </ul>
    <h3>Яскравість дисплея</h3>
    <ul>
      <li><strong>Series 3, SE:</strong> до 1000 ніт.</li>
      <li><strong>Series 7, 8, 9, 10:</strong> до 1000–2000 ніт залежно від покоління.</li>
      <li><strong>Ultra / Ultra 2 / Ultra 3:</strong> до 2000–3000 ніт для екстремальних умов.</li>
    </ul>
    <h3>Технології дисплея</h3>
    <ul>
      <li><strong>LTPO:</strong> використовується у моделях із Always-On Display, допомагає економити заряд батареї.</li>
      <li><strong>OLED:</strong> забезпечує глибокий чорний колір і високу контрастність у всіх моделях Apple Watch.</li>
    </ul>`
  },
  {
    type: "text",
    title: "Регіональні відмінності Apple Watch",
    html: `<h3>Основні регіони</h3>
    <ul>
      <li>LL/A — США</li>
      <li>LW/A — США (Apple Watch 10 / Ultra 2) без підтримки кисню в крові</li>
      <li>ZP/A — Гонконг, Макао</li>
      <li>ZA/A — Сінгапур</li>
      <li>B/A — Велика Британія</li>
      <li>C/A — Канада</li>
      <li>FD/A — Німеччина</li>
      <li>FB/A — Франція</li>
      <li>UA/A — Україна</li>
      <li>PP/A — Філіппіни</li>
      <li>MY/A — Малайзія</li>
      <li>TH/A — Таїланд</li>
      <li>J/A — Японія</li>
      <li>KH/A — Південна Корея</li>
      <li>CH/A — Китай</li>
      <li>BR/A — Бразилія</li>
      <li>TU/A — Туреччина</li>
    </ul>
    <h3>Функціональність EKG</h3>
    <p>ЕКГ доступна тільки в країнах, де вона була схвалена медичними органами, такими як FDA (США) або регулюючими органами Європейського Союзу.</p>
    <ul>
      <li>США, ЄС, Великобританія, Японія — підтримка функції ЕКГ.</li>
      <li>Китай — не підтримується через регуляторні обмеження.</li>
    </ul>
    <h3>Моніторинг кисню в крові</h3>
    <ul>
      <li>ЄС, Велика Британія — доступна.</li>
      <li>США — не доступна з 18 січня 2024 року.</li>
      <li>Китай — обмежена або недоступна через регуляторні обмеження.</li>
    </ul>
    <h3>Моделі для Китаю</h3>
    <p>У Китаї є особливі моделі Apple Watch, які не підтримують деякі функції, як-от EKG та Apple Pay, і мають адаптовану локалізацію. Для мобільних платежів на Apple Watch у Китаї використовуються локальні картки UnionPay, а міжнародні Visa/Mastercard не підтримуються для Apple Pay на місцевих моделях.</p>`
  },
  {
    type: "text",
    title: "Матеріали корпусу та флагманські варіанти",
    html: `<ul>
      <li><strong>Stainless Steel Case with Milanese Loop</strong> — нержавіюча сталь і сталевий ремінець «міланська петля». Доступні у кольорах: Graphite, Silver, Gold.</li>
      <li><strong>Hermès Stainless Steel Case</strong> — нержавіюча сталь з різними варіаціями ремінців бренду Hermès. Доступні у кольорах: Silver, Space Black.</li>
      <li><strong>Edition Titanium Case with Leather Link</strong> — титан з різними варіаціями ремінців. Доступні у кольорах: Natural, Black, Gold, Slate.</li>
    </ul>`
  },
  {
    type: "text",
    title: "Вживана техніка Apple Watch",
    html: `<p>Ринок вживаної техніки Apple активно зростає через популярність пристроїв бренду, їхню довговічність, а також високу ціну нових моделей. Вживані Apple Watch можуть бути чудовим варіантом, якщо ви хочете придбати пристрій за більш доступною ціною.</p>
    <h3>Переваги придбання вживаного Apple Watch</h3>
    <ul>
      <li>Економія коштів: вживані моделі зазвичай коштують значно дешевше, ніж нові.</li>
      <li>Можливість отримати екосистему за помірні кошти: покупка вживаних Apple Watch — гарна можливість спробувати екосистему Apple.</li>
      <li>Стан: на ринку багато вживаних годинників в ідеальному стані, які не підійшли комусь за кольором чи розміром, тому їхня ціна зазвичай значно нижча за новий пристрій.</li>
    </ul>`
  },
  {
    type: "facts",
    title: "Фокус під час консультації",
    items: [
      "GPS-версія — простіший і доступніший вибір для клієнта, який завжди носить із собою iPhone.",
      "GPS + Cellular — для автономності, але в Україні одразу проговорюйте обмеження LTE-функціональності.",
      "SE — для входу в екосистему Apple Watch без переплати за всі флагманські датчики.",
      "Series — для балансу між дизайном, функціями здоров’я та щоденним використанням.",
      "Ultra — для спорту, outdoor, витривалості, великого дисплея, максимальної автономності й міцного корпусу.",
      "Перед продажем завжди уточнюйте: чи важливі ЕКГ, кисень у крові, Always-On Display, розмір корпусу, регіон пристрою та сценарій носіння."
    ]
  }
];

export const appleWatchCatalogBlocks: ModuleContentBlock[] = [
  {
    type: "text",
    title: "Технічні характеристики та еволюція Apple Watch",
    html: `<p>Порівняйте Apple Watch SE, Series та Ultra за розміром корпусу, дисплеєм, датчиками й автономністю. Почніть із сумісності з iPhone клієнта та його щоденних потреб: сповіщення, тренування чи тривалі поїздки.</p><p>Уточніть, які функції важливі, і перевірте їхню доступність для конкретного покоління та регіону пристрою.</p>`
  },
  {
    type: "productCatalog",
    title: "Apple Watch Series — моделі та характеристики",
    products: appleWatchSeriesCatalog
  },
  {
    type: "text",
    title: "Apple Watch SE",
    html: `<p>Apple Watch SE — це розумний годинник від Apple, який пропонує ключові функції Apple Watch за доступнішою ціною. Він позиціонується як середній варіант між флагманськими моделями та старішими поколіннями і добре підходить клієнтам, які хочуть базові smart-функції без переплати за преміальні можливості.</p>`
  },
  {
    type: "productCatalog",
    title: "Apple Watch SE — моделі та характеристики",
    products: appleWatchSECatalog
  },
  {
    type: "productCatalog",
    title: "Apple Watch Ultra — моделі та характеристики",
    products: appleWatchUltraCatalog
  },
  {
    type: "facts",
    title: "Як обрати модель",
    items: [
      "Для першого Apple Watch і базового бюджету: SE.",
      "Для щоденного використання, здоров’я й сучасного дизайну: актуальні Series 8-11.",
      "Для Always-On, яскравішого дисплея та новіших функцій здоров’я: починайте з Series 5 і вище, але найкраще продавати з Series 8+.",
      "Для спорту, дайвінгу, походів і максимальної автономності: Ultra / Ultra 2 / Ultra 3.",
      "Для клієнтів, яким критичний кисень у крові, завжди уточнюйте регіон пристрою й обмеження для США.",
      "Для клієнтів в Україні не продавайте LTE як повноцінну локальну перевагу без чесного пояснення регіональних обмежень."
    ]
  },
  {
    type: "text",
    title: "Що перевірити перед покупкою",
    html: `<p>Перевірте сумісність з iPhone, розмір корпусу й ремінця, версію GPS або GPS + Cellular та комплектність. Доступність мобільного зв’язку й окремих функцій здоров’я перевіряйте для регіону пристрою та країни використання.</p>`
  }
];

const appleWatchContent = {
  appleWatchSeriesCatalog,
  appleWatchSECatalog,
  appleWatchUltraCatalog,
  appleWatchFoundationBlocks,
  appleWatchCatalogBlocks
};

export default appleWatchContent;
