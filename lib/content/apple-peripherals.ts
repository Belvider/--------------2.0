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
  "Аудіо: Dolby Atmos (із tvOS 12), Dolby Digital Plus 7.1",
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
  "З’єднання: Wi-Fi 6, Bluetooth 5.0, HDMI 2.1; Ethernet і Thread лише у 128 ГБ",
  "Пульт: Siri Remote (USB‑C)"
],
    colors: [{ label: "Black", imageUrl: "/materials/apple-peripherals/apple-tv-4k-2022.png", caption: "Apple TV 4K (3-го покоління, 2022)", default: true }]
  }
];

export const homepodCatalog: ModuleCatalogProduct[] = [
  {
    slug: "homepod-mini-2020",
    title: "HomePod mini (1-го покоління, 2020)",
    family: "HomePod",
    summary: "Компактна розумна колонка Apple для музики, Siri, AirPlay 2 і керування розумним будинком.",
    overview: ["Процесор: Apple S5", "Підключення: Wi‑Fi + AirPlay 2", "Формат: компактна колонка"],
    highlights: [
  "Компактна колонка для музики, Siri та керування розумним будинком",
  "Представлений: 13 жовтня 2020 (продажі з 16 листопада 2020)",
  "Динаміки: широкосмуговий драйвер і два пасивні випромінювачі",
  "Процесор: Apple S5",
  "З'єднання: Wi-Fi 802.11n, AirPlay 2, Bluetooth 5.0",
  "Розміри: 8,4 × 9,8 см",
  "Вага: 345 г",
  "Живлення: тільки від мережі",
  "Кольори: Space Gray, White, Blue, Yellow, Orange; Midnight додано 2024 року"
],
    colors: [
  {
    "label": "Загальний вигляд",
    "imageUrl": "/materials/apple-peripherals/homepod-mini.png",
    "caption": "HomePod mini",
    "default": true
  }
]
  },
  {
    slug: "homepod-2018",
    title: "HomePod (оригінальний, 2018)",
    family: "HomePod",
    summary: "Потужна домашня колонка Apple з 7 динаміками, Siri і виразним звучанням для Apple Music та мультирум-сценаріїв.",
    overview: [
  "Процесор: Apple A8",
  "Динаміки: один вуфер і сім твітерів",
  "Живлення: від мережі"
],
    highlights: [
  "Розумна колонка з Siri, одним вуфером і сімома твітерами",
  "Випуск: 9 лютого 2018",
  "Динаміки: один вуфер і сім твітерів",
  "Процесор: Apple A8",
  "З'єднання: Wi-Fi 802.11ac з MIMO, AirPlay 2, Bluetooth 5.0",
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
  "Динаміки: один вуфер і п’ять твітерів",
  "Процесор: Apple S7",
  "З'єднання: Wi-Fi 802.11n, AirPlay 2, Bluetooth 5.0",
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
  "Сумісність: iPad Pro 9,7/10,5 і Pro 12,9 (1/2); iPad 6–9, Air 3, mini 5; також iPad 10/A16 через адаптер USB-C — Apple Pencil"
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
  "Функції: нахил і низька затримка; без чутливості до сили натиску",
  "Особливість: висувний ковпачок для USB‑C",
  "Сумісність: підтримувані iPad з USB-C та iPadOS 17.1.1+; звіряйте точну модель з Apple"
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
  "Сумісність: iPad Pro M4/M5 (11/13), iPad Air M2/M3/M4 (11/13), iPad mini (A17 Pro); iPadOS 17.5+"
],
    colors: [{ label: "White", imageUrl: "/materials/apple-peripherals/apple-pencil-pro.png", caption: "Apple Pencil Pro", default: true }]
  }
];

export const airTagCatalog: ModuleCatalogProduct[] = [
  {
    "slug": "airtag-2021",
    "title": "AirTag (1-го покоління, 2021)",
    "colors": [
      {
        "label": "White",
        "caption": "Apple AirTag",
        "default": true,
        "imageUrl": "/materials/apple-peripherals/airtag.png"
      }
    ],
    "family": "AirTag",
    "summary": "Компактний трекер Apple для пошуку речей через Find My з точним пошуком на iPhone з U1.",
    "overview": [
      "Рік: 2021",
      "Живлення: CR2032",
      "Захист: IP67"
    ],
    "highlights": [
      "Представлений: квітень 2021 року",
      "Форма: круглий брелок діаметром 31,9 мм, товщиною 8 мм",
      "Вага: 11 г",
      "Матеріали: нержавіюча сталь + білий пластиковий корпус",
      "Живлення: змінна батарейка CR2032 (працює до 1 року)",
      "Захист: водо- та пилостійкість IP67",
      "Find My: інтеграція з мережею «Локатор»",
      "Точнийпошук: на сумісному iPhone з UWB; несумісні SE таокремі e/Air",
      "Bluetooth: для базового пошуку на старіших пристроях",
      "Динамік: вбудований динамік для відтворення сигналу при пошуку",
      "Lost Mode: можна позначити AirTag як загублений і отримати повідомлення, коли його знайдуть",
      "NFC: сумісний NFC-смартфон може прочитати контакт загубленого AirTag"
    ]
  },
  {
    "slug": "airtag-2-2026",
    "title": "AirTag (2-го покоління, 2026)",
    "family": "AirTag",
    "overview": [
      "Призначення: пошук власних речей",
      "Зв’язок: Bluetooth, UWB 2, NFC",
      "Живлення: змінна CR2032"
    ],
    "highlights": [
      "Мережа «Локатор»; вбудованого GPS та мобільного модема немає",
      "UWB 2-го покоління для розширеного точного пошуку на сумісних пристроях",
      "Динамік на 50% гучніший за попереднє покоління за методикою Apple",
      "Діаметр 31,9 мм, товщина 8 мм, вага 11,8 г",
      "Захист IP67; стійкість не є постійною",
      "Потрібні iOS/iPadOS 26 або новіша версія",
      "Батарейка CR2032; понад рік роботи за методикою Apple"
    ],
    "colors": [{ label: "White", caption: "Білий", imageUrl: "/materials/apple-peripherals/2026/airtag-2.webp", default: true }]
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
    title: "Magic Mouse (USB-C, 2024)",
    family: "Magic Mouse",
    summary: "Сучасна версія Magic Mouse з вбудованим акумулятором, USB‑C і кольорами під нові iMac.",
    overview: ["Модель: A3204", "Живлення: вбудований акумулятор", "Зарядка: USB‑C"],
    highlights: [
  "Модель: A3204",
  "Живлення: вбудований акумулятор",
  "Зарядка: USB‑C (замість Lightning)",
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
  "Заряджання: Lightning; USB-C — окрема версія 2024",
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
  "Заряджання: Lightning; USB-C — окрема модель 2024",
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
    html: "<p>Apple TV, HomePod, Apple Pencil, AirTag, Magic Mouse та Magic Trackpad доповнюють iPhone, iPad, Mac і телевізор. Почніть із наявної техніки клієнта, визначте корисний сценарій і перевірте сумісність покоління аксесуара.</p>"
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
    html: "<p>Apple TV — приставка на tvOS для підключення до телевізора через HDMI. Не плутайте пристрій із програмою Apple TV або підпискою на відеосервіс.</p><ul><li>Apple TV HD виводить до 1080p. Покоління 4K мають різні чипи, пам’ять і мережеві інтерфейси. A15 і 64/128 ГБ — характеристики 3-го покоління 2022 року.</li><li>AirPlay передає фото, відео й музику із сумісних пристроїв Apple.</li><li>Для App Store, Apple Arcade та відеосервісів перевірте країну, підписку й вимоги конкретного сервісу.</li><li>Apple TV 4K може бути домашнім центром; у 3-го покоління Thread є лише у версії Wi-Fi+Ethernet 128 ГБ. HDMI-кабель продається окремо.</li><li>Siri потребує підтримуваної мови й країни. Не обіцяйте голосове керування українською без перевірки.</li></ul>"
  },
  {
    type: "text",
    title: "HomePod",
    html: `<p><strong>HomePod</strong> — це розумна колонка від Apple, створена для високоякісного звучання та інтеграції з екосистемою Apple. Доступна у двох основних варіантах: <em>HomePod</em> та <em>HomePod mini</em>.</p><p>HomePod часто виступає не тільки як аудіопристрій, а і як частина HomeKit/Matter-сценарію для розумного дому, Siri-команд, стереопари та мультируму через AirPlay 2.</p>`
  },
  {
    type: "text",
    title: "Apple Pencil",
    html: "<p>Apple Pencil підбирають за точною моделлю iPad. Pencil 1/2/Pro підтримують силу натиску й нахил; Pencil USB-C — нахил, але без чутливості до сили натиску.</p><p>Pencil USB-C заряджається та сполучається кабелем; магнітне кріплення призначене для зберігання. Pencil 2/Pro заряджаються магнітно на сумісному iPad. Pro додає стискання, обертання, тактильний відгук і «Локатор».</p>"
  },
  {
    type: "text",
    title: "AirTag",
    html: "<p>AirTag допомагає шукати власні речі через мережу «Локатор». Це не GPS-трекер: віддалене виявлення залежить від сумісних пристроїв поблизу, які анонімно передають місцезнаходження.</p><p>Покоління 2021 використовує U1; AirTag 2 — UWB 2-го покоління з розширеним точним пошуком. Потрібен сумісний iPhone з UWB: деякі SE, e та Air не підтримують точного пошуку. Сумісний NFC-смартфон може прочитати контакт власника загубленого AirTag без сполучення.</p><p>Перевірте покоління, сумісність, батарейку CR2032 і потрібне кріплення. AirTag 2 потребує iOS/iPadOS 26 або новішої версії.</p>"
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
  "AirTag — це не просто трекер, а частина мережі Find My з точним пошуком на сумісному iPhone з UWB.",
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
