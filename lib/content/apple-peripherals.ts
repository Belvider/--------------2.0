import type { ModuleCatalogProduct, ModuleContentBlock } from "../module-content";

export const appleTvCatalog: ModuleCatalogProduct[] = [
  {
    slug: "apple-tv-hd",
    title: "Apple TV HD",
    family: "Apple TV",
    summary: "Старіша модель Apple TV для телевізорів без 4K, базового стрімінгу та входу в tvOS-екосистему.",
    overview: ["Відео: до 1080p", "Формат: tvOS-пристрій для стрімінгу", "Сценарій: телевізори без 4K"],
    highlights: [
      "Старіша модель Apple TV без акценту на 4K",
      "Підходить для телевізорів, яким достатньо Full HD",
      "Менш продуктивна, ніж сучасні покоління Apple TV 4K",
      "Працює на tvOS та інтегрується з іншими пристроями Apple",
      "Добре підходить для базового стрімінгу відео, музики та App Store для tvOS"
    ],
    colors: [{ label: "Black", imageUrl: "/materials/apple-peripherals/apple-tv-hd.jpg", caption: "Apple TV HD", default: true }]
  },
  {
    slug: "apple-tv-4k-1st-gen-2017",
    title: "Apple TV 4K (1-го покоління, 2017)",
    family: "Apple TV",
    summary: "Перше покоління Apple TV 4K, яке принесло 4K HDR, Dolby Vision і сильніший стрімінговий сценарій в екосистему Apple.",
    overview: ["Процесор: A10X Fusion", "Пам'ять: 32/64 ГБ", "Відео: 4K HDR"],
    highlights: [
      "Процесор: A10X Fusion",
      "Пам'ять: 32/64 ГБ",
      "Відео: 4K HDR, HDR10, Dolby Vision",
      "Аудіо: Dolby Atmos (з iOS 12), Dolby Digital Plus 7.1",
      "З'єднання: Wi-Fi 802.11ac, Gigabit Ethernet, Bluetooth 5.0, HDMI 2.0a",
      "Пульт: Siri Remote (Lightning)"
    ],
    colors: [{ label: "Black", imageUrl: "/materials/apple-peripherals/apple-tv-4k-2017.png", caption: "Apple TV 4K (1-го покоління, 2017)", default: true }]
  },
  {
    slug: "apple-tv-4k-2nd-gen-2021",
    title: "Apple TV 4K (2-го покоління, 2021)",
    family: "Apple TV",
    summary: "Оновлення Apple TV 4K з A12 Bionic, кращою швидкодією, Wi-Fi 6 і більш сучасним Siri Remote.",
    overview: ["Процесор: A12 Bionic", "Пам'ять: 32/64 ГБ", "Відео: 4K HDR"],
    highlights: [
      "Процесор: A12 Bionic",
      "Пам'ять: 32/64 ГБ",
      "Відео: 4K HDR, HDR10, Dolby Vision",
      "Аудіо: Dolby Atmos, Dolby Digital 7.1/5.1",
      "З'єднання: Wi-Fi 6, Gigabit Ethernet, Bluetooth 5.0, HDMI 2.1",
      "Пульт: Siri Remote (Lightning)"
    ],
    colors: [{ label: "Black", imageUrl: "/materials/apple-peripherals/apple-tv-4k-2021.png", caption: "Apple TV 4K (2-го покоління, 2021)", default: true }]
  },
  {
    slug: "apple-tv-4k-3rd-gen-2022",
    title: "Apple TV 4K (3-го покоління, 2022)",
    family: "Apple TV",
    summary: "Найактуальніший Apple TV 4K із A15 Bionic, HDR10+, Dolby Atmos та варіантом 128 ГБ з Ethernet і Thread.",
    overview: ["Процесор: A15 Bionic", "Пам'ять: 64/128 ГБ", "Відео: 4K HDR, HDR10+, Dolby Vision"],
    highlights: [
      "Процесор: A15 Bionic",
      "Пам'ять: 64 ГБ (Wi‑Fi), 128 ГБ (Wi‑Fi + Ethernet)",
      "Відео: 4K HDR, HDR10+, Dolby Vision",
      "Аудіо: Dolby Atmos, Dolby Digital 7.1/5.1",
      "З'єднання: Wi‑Fi 6, Bluetooth 5.0, Thread, HDMI 2.1",
      "Пульт: Siri Remote (USB‑C)"
    ],
    colors: [{ label: "Black", imageUrl: "/materials/apple-peripherals/apple-tv-4k-2022.png", caption: "Apple TV 4K (3-го покоління, 2022)", default: true }]
  }
];

export const homepodCatalog: ModuleCatalogProduct[] = [
  {
    slug: "homepod-mini-2020",
    title: "HomePod mini",
    family: "HomePod",
    summary: "Компактна розумна колонка Apple для музики, Siri, AirPlay 2 і керування розумним будинком.",
    overview: ["Процесор: Apple S5", "Підключення: Wi‑Fi + AirPlay 2", "Формат: компактна колонка"],
    highlights: [
      "Компактна колонка для музики, Siri та керування розумним будинком",
      "Представлений: 13 жовтня 2020 (продажі з 16 листопада 2020)",
      "Динамік: 1 (приблизно 20 Вт)",
      "Процесор: Apple S5",
      "З'єднання: Wi‑Fi 802.11n з MIMO, AirPlay 2, Bluetooth 5.0",
      "Розміри: 8,4 × 9,8 см",
      "Вага: 345 г",
      "Живлення: тільки від мережі",
      "Кольори: Space Gray, White, Blue, Yellow, Orange"
    ],
    colors: [{ label: "Основний рендер", imageUrl: "/materials/apple-peripherals/homepod-mini.png", caption: "HomePod mini", default: true }]
  },
  {
    slug: "homepod-2018",
    title: "HomePod (оригінальний, 2018)",
    family: "HomePod",
    summary: "Потужна домашня колонка Apple з 7 динаміками, Siri і виразним звучанням для Apple Music та мультирум-сценаріїв.",
    overview: ["Процесор: Apple A8", "Динаміки: 7", "Живлення: від мережі"],
    highlights: [
      "Потужна інтелектуальна колонка з підтримкою Siri та 7 високоякісними динаміками",
      "Випуск: 9 лютого 2018",
      "Динаміки: 7",
      "Процесор: Apple A8",
      "З'єднання: Wi‑Fi 802.11n з MIMO, AirPlay 2, Bluetooth 5.0",
      "Розміри: 17,2 × 14,2 см",
      "Вага: 2,5 кг",
      "Живлення: тільки від мережі",
      "Кольори: Space Gray, White"
    ],
    colors: [{ label: "Space Gray / White", imageUrl: "/materials/apple-peripherals/homepod-2018.png", caption: "HomePod (оригінальний, 2018)", default: true }]
  },
  {
    slug: "homepod-2nd-gen-2023",
    title: "HomePod (2-го покоління, 2023)",
    family: "HomePod",
    summary: "Оновлений HomePod із Matter, Dolby Atmos та просторовим звучанням для преміального домашнього аудіо.",
    overview: ["Процесор: Apple S7", "Формат: Home hub + аудіо", "Підтримка: Dolby Atmos"],
    highlights: [
      "Оновлена версія з підтримкою Matter, просторового звучання та Dolby Atmos",
      "Анонс: 18 січня 2023 (продажі з 3 лютого 2023)",
      "Динаміки: 1 сабвуфер + 5 ВЧ (приблизно 50 Вт)",
      "Процесор: Apple S7",
      "З'єднання: Wi‑Fi 802.11n з MIMO, AirPlay 2, Bluetooth 5.0",
      "Розміри: 168 × 142 мм",
      "Вага: 2,3 кг",
      "Живлення: тільки від мережі",
      "Кольори: Midnight, White",
      "Підтримка: Dolby Atmos, Siri"
    ],
    colors: [{ label: "Midnight / White", imageUrl: "/materials/apple-peripherals/homepod-2023.png", caption: "HomePod (2-го покоління, 2023)", default: true }]
  }
];

export const applePencilCatalog: ModuleCatalogProduct[] = [
  {
    slug: "apple-pencil-1st-gen",
    title: "Apple Pencil (1-го покоління)",
    family: "Apple Pencil",
    summary: "Перший Apple Pencil для старших iPad із Lightning, чутливістю до натиску та нахилу.",
    overview: ["Рік: 2015", "Підключення: Lightning", "Сценарій: нотатки й малювання"],
    highlights: [
      "Представлений: 2015 рік",
      "Підключення: Lightning-конектор",
      "Функції: чутливість до сили натиску та нахилу",
      "Сумісність: iPad Pro (1–2 покоління), iPad (6–9 покоління), iPad Air (3 покоління), iPad mini (5 покоління)"
    ],
    colors: [{ label: "White", imageUrl: "/materials/apple-peripherals/apple-pencil-1.png", caption: "Apple Pencil (1-го покоління)", default: true }]
  },
  {
    slug: "apple-pencil-2nd-gen",
    title: "Apple Pencil (2-го покоління)",
    family: "Apple Pencil",
    summary: "Більш зручний Apple Pencil з магнітним кріпленням, бездротовою зарядкою і подвійним тапом.",
    overview: ["Рік: 2018", "Підключення: магнітне", "Є подвійний тап"],
    highlights: [
      "Представлений: 2018 рік",
      "Підключення: магнітне кріплення та бездротова зарядка",
      "Функції: подвійний тап для перемикання інструментів, чутливість до натиску та нахилу",
      "Сумісність: iPad Pro 11″ (1–4 покоління), iPad Pro 12,9″ (3–6 покоління), iPad Air (4–5 покоління), iPad mini (6 покоління)"
    ],
    colors: [{ label: "White", imageUrl: "/materials/apple-peripherals/apple-pencil-2.png", caption: "Apple Pencil (2-го покоління)", default: true }]
  },
  {
    slug: "apple-pencil-usb-c",
    title: "Apple Pencil (USB‑C)",
    family: "Apple Pencil",
    summary: "Більш доступний сучасний Apple Pencil для USB-C iPad із низькою затримкою та простим заряджанням.",
    overview: ["Рік: 2023", "Підключення: USB‑C", "Сценарій: нотатки та малювання"],
    highlights: [
      "Представлений: 2023 рік",
      "Підключення: USB‑C для зарядки та сполучення",
      "Функції: підтримка нахилу, низька затримка, ідеальний для нотаток і малювання",
      "Особливість: висувний ковпачок для USB‑C",
      "Сумісність: усі iPad з USB‑C (iPad 10-го покоління, iPad Air, iPad Pro, iPad mini)"
    ],
    colors: [{ label: "White", imageUrl: "/materials/apple-peripherals/apple-pencil-usb-c.png", caption: "Apple Pencil (USB‑C)", default: true }]
  },
  {
    slug: "apple-pencil-pro",
    title: "Apple Pencil Pro",
    family: "Apple Pencil",
    summary: "Найсучасніший стилус Apple з squeeze, haptic feedback і barrel roll для творчих та професійних задач.",
    overview: ["Рік: 2024", "Підключення: магнітне", "Нові функції: squeeze + haptic"],
    highlights: [
      "Представлений: 2024 рік",
      "Підключення: магнітне кріплення та бездротова зарядка",
      "Чутливість до натиску та нахилу",
      "Подвійний тап для перемикання інструментів",
      "Нове: датчик стиснення (squeeze) для швидкого виклику меню інструментів",
      "Нове: тактильний відгук (haptic feedback)",
      "Нове: підтримка обертання стилуса (barrel roll)",
      "Сумісність: iPad Pro (M4, 2024 року)"
    ],
    colors: [{ label: "White", imageUrl: "/materials/apple-peripherals/apple-pencil-pro.png", caption: "Apple Pencil Pro", default: true }]
  }
];

export const airTagCatalog: ModuleCatalogProduct[] = [
  {
    slug: "airtag-2021",
    title: "Apple AirTag",
    family: "AirTag",
    summary: "Компактний трекер Apple для пошуку речей через Find My з точним пошуком на iPhone з U1.",
    overview: ["Рік: 2021", "Живлення: CR2032", "Захист: IP67"],
    highlights: [
      "Представлений: квітень 2021 року",
      "Форма: круглий брелок діаметром 31,9 мм, товщиною 8 мм",
      "Вага: 11 г",
      "Матеріали: нержавіюча сталь + білий пластиковий корпус",
      "Живлення: змінна батарейка CR2032 (працює до 1 року)",
      "Захист: водо- та пилостійкість IP67",
      "Find My: інтеграція з мережею «Локатор»",
      "Точний пошук: завдяки чипу U1 на iPhone 11 і новіших",
      "Bluetooth: для базового пошуку на старіших пристроях",
      "Динамік: вбудований динамік для відтворення сигналу при пошуку",
      "Lost Mode: можна позначити AirTag як загублений і отримати повідомлення, коли його знайдуть",
      "NFC: будь-який смартфон може зчитати AirTag і показати контакт власника"
    ],
    colors: [{ label: "White", imageUrl: "/materials/apple-peripherals/airtag.png", caption: "Apple AirTag", default: true }]
  }
];

export const magicMouseCatalog: ModuleCatalogProduct[] = [
  {
    slug: "magic-mouse-1-2009",
    title: "Magic Mouse (1‑е покоління, 2009)",
    family: "Magic Mouse",
    summary: "Перша миша Apple з Multi‑Touch для macOS, що працювала від AA-батарейок і задала фірмову мінімалістичну форму.",
    overview: ["Модель: A1296", "Живлення: 2 × AA", "Bluetooth: 2.1"],
    highlights: [
      "Модель: A1296",
      "Живлення: 2 батареї AA",
      "Bluetooth 2.1",
      "Перша миша Apple з Multi‑Touch"
    ],
    colors: [{ label: "Silver", imageUrl: "/materials/apple-peripherals/magic-mouse-trackpad/magic-mouse-1.png", caption: "Magic Mouse (1‑е покоління, 2009)", default: true }]
  },
  {
    slug: "magic-mouse-2-2015",
    title: "Magic Mouse 2 (2015)",
    family: "Magic Mouse",
    summary: "Оновлена Magic Mouse з вбудованим акумулятором, Lightning-зарядкою та знайомими Multi‑Touch жестами.",
    overview: ["Модель: A1657", "Живлення: вбудований акумулятор", "Зарядка: Lightning"],
    highlights: [
      "Модель: A1657",
      "Живлення: вбудований акумулятор",
      "Зарядка: Lightning (знизу)",
      "Bluetooth 4.0",
      "Плавніше ковзання, Multi‑Touch жести"
    ],
    colors: [{ label: "Silver", imageUrl: "/materials/apple-peripherals/magic-mouse-trackpad/magic-mouse-2.png", caption: "Magic Mouse 2 (2015)", default: true }]
  },
  {
    slug: "magic-mouse-3-2021",
    title: "Magic Mouse 3 (2021–2024)",
    family: "Magic Mouse",
    summary: "Сучасна версія Magic Mouse з вбудованим акумулятором, USB‑C і кольорами під нові iMac.",
    overview: ["Модель: A3204", "Живлення: вбудований акумулятор", "Зарядка: USB‑C"],
    highlights: [
      "Модель: A3204",
      "Живлення: вбудований акумулятор",
      "Зарядка: USB‑C (замість Lightning)",
      "Bluetooth 5.0",
      "Доступна у кількох кольорах під iMac"
    ],
    colors: [{ label: "Black", imageUrl: "/materials/apple-peripherals/magic-mouse-trackpad/magic-mouse-3.png", caption: "Magic Mouse 3 (2021–2024)", default: true }]
  }
];

export const magicTrackpadCatalog: ModuleCatalogProduct[] = [
  {
    slug: "magic-trackpad-1-2010",
    title: "Magic Trackpad (1‑е покоління, 2010)",
    family: "Magic Trackpad",
    summary: "Перший окремий трекпад Apple для Mac з Multi‑Touch жестами та живленням від AA-батарейок.",
    overview: ["Модель: A1339", "Живлення: 2 × AA", "Bluetooth: 2.1"],
    highlights: [
      "Модель: A1339",
      "Алюмінієвий корпус, скляна сенсорна поверхня",
      "Живлення: 2 батареї AA",
      "Bluetooth 2.1",
      "Підтримка Multi‑Touch жестів"
    ],
    colors: [{ label: "Silver", imageUrl: "/materials/apple-peripherals/magic-mouse-trackpad/magic-trackpad-1.png", caption: "Magic Trackpad (1‑е покоління, 2010)", default: true }]
  },
  {
    slug: "magic-trackpad-2-2015",
    title: "Magic Trackpad 2 (2015)",
    family: "Magic Trackpad",
    summary: "Magic Trackpad з Force Touch, вбудованим акумулятором і більшою скляною поверхнею.",
    overview: ["Модель: A1535", "Є Force Touch", "Зарядка: Lightning"],
    highlights: [
      "Модель: A1535",
      "Скляна поверхня, алюмінієвий корпус",
      "Живлення: вбудований акумулятор",
      "Зарядка: Lightning (Type‑C з 2024)",
      "Bluetooth 4.0",
      "Підтримка Force Touch",
      "Тонший дизайн, більша поверхня"
    ],
    colors: [{ label: "Silver", imageUrl: "/materials/apple-peripherals/magic-mouse-trackpad/magic-trackpad-2.png", caption: "Magic Trackpad 2 (2015)", default: true }]
  },
  {
    slug: "magic-trackpad-2021",
    title: "Magic Trackpad (оновлена версія, 2021)",
    family: "Magic Trackpad",
    summary: "Оновлений Magic Trackpad у кольорах під iMac, з кращою енергоефективністю та Force Touch.",
    overview: ["Модель: A2449", "Bluetooth: 5.0", "Підтримка: Force Touch"],
    highlights: [
      "Модель: A2449",
      "Живлення: вбудований акумулятор",
      "Зарядка: Lightning або USB‑C (2024)",
      "Bluetooth 5.0",
      "Кольори під iMac M1",
      "Підтримка Force Touch, покращена енергоефективність"
    ],
    colors: [{ label: "Black", imageUrl: "/materials/apple-peripherals/magic-mouse-trackpad/magic-trackpad-2021.png", caption: "Magic Trackpad (оновлена версія, 2021)", default: true }]
  }
];

export const applePeripheralsFoundationBlocks: ModuleContentBlock[] = [
  {
    type: "text",
    title: "Периферія Apple",
    html: `<p>У цій категорії зібрано ключову периферію Apple: Apple TV, HomePod, Apple Pencil, AirTag, Magic Mouse та Magic Trackpad. Це продукти, які підсилюють екосистему Apple й часто продаються як доповнення до iPhone, iPad, Mac або розумного дому.</p><p>Ми переносимо їх у тому самому навчальному форматі, що й інші Apple-категорії: спочатку короткий конспект по функціях і сценаріях використання, далі — каталог моделей з характеристиками.</p>`
  },
  {
    type: "image",
    title: "Apple TV та периферія Apple",
    url: "/materials/apple-peripherals/apple-tv-4k-2022.png",
    caption: "Візуальний орієнтир по категорії Apple peripherals"
  },
  {
    type: "text",
    title: "Apple TV",
    html: `<p>Apple TV — це мультимедійний пристрій і платформа від Apple, створена для трансляції відео, музики, ігор та іншого контенту на телевізор. Працює на tvOS і інтегрується з іншими пристроями Apple, що робить його ідеальним доповненням для користувачів екосистеми Apple.</p>
    <h3>Типи Apple TV</h3>
    <ul>
      <li><strong>Apple TV 4K:</strong> підтримка 4K HDR10, Dolby Vision, Dolby Atmos; чип A15 Bionic; пам’ять 64/128 ГБ.</li>
      <li><strong>Apple TV HD:</strong> старіша модель, до 1080p; менш продуктивна, але підходить для телевізорів без 4K.</li>
    </ul>
    <h3>Основні функції Apple TV</h3>
    <ul>
      <li><strong>Стрімінгові сервіси:</strong> Apple TV+, Netflix, Disney+, Prime Video, YouTube, HBO Max.</li>
      <li><strong>AirPlay:</strong> передача фото, відео, музики з iPhone, iPad, Mac.</li>
      <li><strong>Ігри:</strong> Apple Arcade, підтримка контролерів (DualShock, Xbox).</li>
      <li><strong>Siri Remote:</strong> голосові команди, сенсорна панель.</li>
      <li><strong>HomeKit:</strong> використання як хаб для розумного дому, перегляд камер.</li>
      <li><strong>App Store:</strong> додатки для tvOS, Apple Music, Spotify, iCloud Photos.</li>
    </ul>`
  },
  {
    type: "text",
    title: "HomePod",
    html: `<p><strong>HomePod</strong> — це розумна колонка від Apple, створена для високоякісного звучання та інтеграції з екосистемою Apple. Доступна у двох основних варіантах: <em>HomePod</em> та <em>HomePod mini</em>.</p><p>HomePod часто виступає не тільки як аудіопристрій, а і як частина HomeKit/Matter-сценарію для розумного дому, Siri-команд, стереопари та мультируму через AirPlay 2.</p>`
  },
  {
    type: "text",
    title: "Apple Pencil",
    html: `<p><strong>Apple Pencil</strong> — стилус від Apple, створений для iPad. Він забезпечує точність, чутливість до натиску та нахилу, що робить його ідеальним інструментом для малювання, нотаток і професійної роботи з графікою.</p>
    <h3>Ключові можливості Apple Pencil</h3>
    <ul>
      <li>Миттєва реакція без затримки.</li>
      <li>Висока точність для малювання та рукописних нотаток.</li>
      <li>Чутливість до сили натиску та нахилу.</li>
      <li>Інтеграція з iPadOS: Scribble, швидкі нотатки, малювання у додатках.</li>
    </ul>`
  },
  {
    type: "text",
    title: "AirTag",
    html: `<p><strong>Apple AirTag</strong> — це компактний трекер від Apple, створений для пошуку та відстеження особистих речей через додаток «Локатор» (Find My). Він інтегрується з екосистемою Apple та забезпечує точне позиціонування завдяки технології Ultra Wideband.</p>
    <h3>Сумісність</h3>
    <ul>
      <li>Працює з iPhone та iPad під управлінням iOS 14.5 / iPadOS 14.5 і новіших.</li>
      <li>Точний пошук доступний на iPhone 11, 12, 13, 14, 15 (з чипом U1).</li>
    </ul>
    <h3>Аксесуари</h3>
    <p>AirTag не має вбудованого кріплення, тому Apple та сторонні виробники пропонують брелоки, петлі та чохли для зручного носіння на ключах, сумках чи багажі.</p>`
  },
  {
    type: "text",
    title: "Magic Mouse та Magic Trackpad",
    html: `<p><strong>Magic Mouse</strong> — бездротова мишка від Apple зі стильним мінімалістичним дизайном і сенсорною поверхнею з підтримкою Multi‑Touch жестів. <strong>Magic Trackpad</strong> — сенсорний пристрій з великою поверхнею для Multi‑Touch жестів і Force Touch, який є чудовою альтернативою миші для користувачів Mac.</p>
    <h3>Переваги Magic Mouse</h3>
    <ul>
      <li>Стильний, мінімалістичний дизайн, що доповнює екосистему Apple.</li>
      <li>Сенсорна поверхня з підтримкою Multi‑Touch жестів.</li>
      <li>Інтеграція з macOS для налаштування жестів.</li>
      <li>Bluetooth-підключення без кабелів.</li>
      <li>Довгий час роботи від акумулятора.</li>
      <li>Точне відстеження рухів для роботи та творчості.</li>
    </ul>`
  },
  {
    type: "facts",
    title: "Фокус під час консультації",
    items: [
      "Apple TV продаємо як центр домашніх медіа, AirPlay, Apple Arcade і HomeKit-хаб для клієнтів в екосистемі Apple.",
      "HomePod mini — компактний вхід у smart-speaker сегмент Apple; HomePod 2 — уже про сильніше звучання і домашній аудіосценарій.",
      "Apple Pencil завжди підбираємо через сумісність із конкретною моделлю iPad, а не лише за бюджетом клієнта.",
      "AirTag — це не просто трекер, а частина мережі Find My з точним пошуком на iPhone з U1.",
      "Magic Mouse добре продається як фірмове доповнення до Mac/iMac; Magic Trackpad — для користувачів, які цінують жести й Force Touch.",
      "У категорії периферії ключове — не просто характеристики, а сценарій доповнення до вже наявної техніки Apple у клієнта."
    ]
  }
];

export const applePeripheralsCatalogBlocks: ModuleContentBlock[] = [
  {
    type: "text",
    title: "Apple peripherals — моделі й технічні характеристики",
    html: `<p>Порівняйте Apple TV, HomePod, Apple Pencil, AirTag, Magic Mouse та Magic Trackpad за завданням, яке вони вирішують. Почніть із пристроїв клієнта та перевірте сумісність конкретного покоління аксесуара.</p><p>Під час демонстрації покажіть одну корисну дію: керування телевізором, відтворення музики, малювання, пошук речі або роботу з Mac.</p>`
  },
  {
    type: "productCatalog",
    title: "Apple TV — моделі та характеристики",
    products: appleTvCatalog
  },
  {
    type: "productCatalog",
    title: "HomePod — моделі та характеристики",
    products: homepodCatalog
  },
  {
    type: "productCatalog",
    title: "Apple Pencil — моделі та характеристики",
    products: applePencilCatalog
  },
  {
    type: "productCatalog",
    title: "AirTag — характеристики",
    products: airTagCatalog
  },
  {
    type: "productCatalog",
    title: "Magic Mouse — моделі та характеристики",
    products: magicMouseCatalog
  },
  {
    type: "productCatalog",
    title: "Magic Trackpad — моделі та характеристики",
    products: magicTrackpadCatalog
  },
  {
    type: "facts",
    title: "Швидкий орієнтир по підбору",
    items: [
      "Apple TV 4K — для клієнтів з 4K-телевізором, активним стрімінгом, AirPlay і HomeKit-сценаріями.",
      "HomePod mini — доступніший варіант для Siri, музики й розумного дому; HomePod 2 — для кращого домашнього звучання.",
      "Apple Pencil 1 / 2 / USB-C / Pro підбираємо тільки через сумісність з iPad і сценарій: нотатки, навчання, малювання чи професійна графіка.",
      "AirTag добре працює як допродаж до ключів, валіз, рюкзаків і щоденних речей клієнта.",
      "Magic Mouse — для тих, хто хоче класичну мишу Apple; Magic Trackpad — для тих, кому важливі Multi-Touch і Force Touch жести.",
      "У периферії найсильніший продаж відбувається тоді, коли ми прив'язуємо аксесуар до вже наявного пристрою клієнта: Mac, iPad, iPhone або телевізора."
    ]
  }
];

const applePeripheralsContent = {
  appleTvCatalog,
  homepodCatalog,
  applePencilCatalog,
  airTagCatalog,
  magicMouseCatalog,
  magicTrackpadCatalog,
  applePeripheralsFoundationBlocks,
  applePeripheralsCatalogBlocks
};

export default applePeripheralsContent;
