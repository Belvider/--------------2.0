import type { ModuleCatalogProduct, ModuleContentBlock } from "../module-content";

export const airpodsMainCatalog: ModuleCatalogProduct[] = [
  {
    slug: "airpods-2-2019",
    title: "AirPods 2 (2019)",
    family: "AirPods",
    summary: "Доступний вхід у бездротову екосистему Apple з чипом H1, швидким підключенням і простим щоденним сценарієм використання.",
    overview: ["Чип: Apple H1", "Bluetooth: 5.0", "Автономність: до 5 годин без кейса"],
    highlights: [
      "Процесор: Apple H1",
      "Bluetooth: 5.0",
      "Аудіо-технології: високоякісний звук, підтримка «Привіт, Siri», автоматичне перемикання між пристроями Apple",
      "Керування: подвійне натискання для відтворення/пауза, перемикання треків, відповіді на виклики",
      "Датчики: подвійні спрямовані мікрофони, подвійні оптичні сенсори, акселерометр руху, акселерометр голосової активності",
      "Зарядний кейс: Lightning або бездротовий (Qi) у версії з Wireless Charging Case",
      "Автономність: до 5 годин прослуховування або 3 годин розмов без підзарядки; з кейсом — понад 24 години прослуховування або до 18 годин розмов",
      "Швидка зарядка: 15 хв у кейсі = до 3 год прослуховування або до 2 год розмов",
      "Сумісність: iPhone, iPad, Mac, Apple Watch, Apple TV з актуальними версіями iOS, iPadOS, macOS, watchOS, tvOS"
    ],
    colors: [
      { label: "White", imageUrl: "/materials/airpods/2airpods.png", caption: "AirPods 2 (2019)", default: true }
    ]
  },
  {
    slug: "airpods-3-2021",
    title: "AirPods 3 (2021)",
    family: "AirPods",
    summary: "Третє покоління з новим форм-фактором, просторовим аудіо, Adaptive EQ і захистом IPX4 для активного повсякденного використання.",
    overview: ["Чип: Apple H1", "Bluetooth: 5.0", "Spatial Audio + Adaptive EQ"],
    highlights: [
  "Процесор: Apple H1",
  "Bluetooth: 5.0",
  "Аудіо-технології: драйвер від Apple із широкою амплітудою, спеціальний підсилювач із широким динамічним діапазоном, Adaptive EQ, Personalized Spatial Audio з динамічним відстеженням рухів голови",
  "Керування: сенсорне натискання для відтворення/пауза, перемикання треків, відповіді на виклики, Siri",
  "Датчики: подвійні спрямовані мікрофони, внутрішній мікрофон, датчик контакту зі шкірою, акселерометр руху, акселерометр голосової активності, датчик натискання",
  "Захист: IPX4 (піт та волога) — як навушники, так і зарядний кейс",
  "Кейс Lightning заряджається кабелем; MagSafe-кейс — також MagSafe та Qi",
  "Автономність: до 6 годин прослуховування (до 5 год з Spatial Audio), до 4 год розмов; з кейсом — до 30 год прослуховування або 20 год розмов",
  "Швидка зарядка: 5 хв у кейсі = приблизно 1 година прослуховування",
  "Дизайн: анатомічний форм-фактор без силіконових амбушурів, укорочена ніжка з сенсором натискання"
],
    colors: [
      { label: "White", imageUrl: "/materials/airpods/airpods-3.png", caption: "AirPods 3 (2021)", default: true }
    ]
  },
  {
    slug: "airpods-4-2024",
    title: "AirPods 4 (2024)",
    family: "AirPods",
    summary: "Оновлені AirPods з чипом H2, новим дизайном, USB-C кейсом і більш сучасним відкритим форм-фактором.",
    overview: ["Чип: Apple H2", "Bluetooth: 5.3", "USB-C кейс"],
    highlights: [
  "Процесор: Apple H2",
  "Bluetooth: 5.3",
  "Аудіо-технології: драйвер від Apple із широкою амплітудою, спеціальний підсилювач із широким динамічним діапазоном, Adaptive EQ, Personalized Spatial Audio з динамічним відстеженням голови, система вирівнювання внутрішнього тиску",
  "Керування: датчик натискання — відтворення, виклики, треки; гучність через пристрій або Siri",
  "Датчики: подвійні спрямовані мікрофони, внутрішній мікрофон, оптичний внутрішньовушний датчик, акселерометр руху та голосової активності, датчик натискання",
  "Захист: IP54 (пил, піт, волога)",
  "Зарядний кейс: USB-C, підтримка швидкої зарядки (5 хв = приблизно 1 година прослуховування)",
  "Автономність: до 5 год прослуховування, до 4,5 год розмов; з кейсом — до 30 год прослуховування або 20 год розмов",
  "Вага: 4,3 г (навушник), 32,3 г (кейс)"
],
    colors: [
      { label: "White", imageUrl: "/materials/airpods/121204-airpods-4.png", caption: "AirPods 4 (2024)", default: true }
    ]
  },
  {
    slug: "airpods-4-anc-2024",
    title: "AirPods 4 ANC (2024)",
    family: "AirPods",
    summary: "Версія відкритих AirPods 4 з ANC, Adaptive Audio та більш гнучким щоденним сценарієм для міста й офісу.",
    overview: ["Чип: Apple H2", "Bluetooth: 5.3", "ANC + Adaptive Audio"],
    highlights: [
  "Процесор: Apple H2",
  "Bluetooth: 5.3",
  "Аудіо-технології: Active Noise Cancellation, Adaptive Audio, Transparency Mode, Conversation Awareness, Voice Isolation, Adaptive EQ, Personalized Spatial Audio",
  "Керування: сенсорне — музика, виклики, ANC ↔ Transparency",
  "Датчики: оптичний внутрішньовушний датчик, подвійні мікрофони, акселерометр руху та голосової активності",
  "Захист: IP54 (пил, піт, волога)",
  "Зарядний кейс: USB-C, сумісний із зарядкою Apple Watch та Qi; компактніший за попередні покоління",
  "Автономність: до 4 год прослуховування з ANC, до 5 год без ANC; з кейсом — до 20 год з ANC або до 30 год без ANC",
  "Особливості: оновлений дизайн із коротшою ніжкою, покращений комфорт, підтримка «Локатор» для пошуку кейса"
],
    colors: [
      { label: "White", imageUrl: "/materials/airpods/121204-airpods-4.png", caption: "AirPods 4 ANC (2024)", default: true }
    ]
  }
];

export const airpodsProCatalog: ModuleCatalogProduct[] = [
  {
    slug: "airpods-pro-1-2019",
    title: "AirPods Pro 1 (2019)",
    family: "AirPods Pro",
    summary: "Перше покоління Pro з ANC, Transparency Mode та силіконовими амбушурами для кращої шумоізоляції.",
    overview: ["Чип: Apple H1", "Bluetooth: 5.0", "ANC + Transparency"],
    highlights: [
      "Процесор: Apple H1",
      "Bluetooth: 5.0",
      "Аудіо-технології: Active Noise Cancellation, Transparency Mode, Adaptive EQ, Spatial Audio з динамічним відстеженням голови",
      "Керування: сенсорне — відтворення, перемикання треків, ANC ↔ Transparency, «Привіт, Siri»",
      "Датчики: подвійні спрямовані мікрофони, внутрішній мікрофон, подвійні оптичні сенсори, акселерометр руху, акселерометр голосової активності, датчик натискання",
      "Зарядний кейс: Lightning + підтримка бездротової зарядки Qi",
      "Амбушури: 3 розміри (S/M/L)",
      "Захист: IPX4 (піт та волога)",
      "Автономність: до 4,5 годин прослуховування (до 5 год без ANC/Transparency), до 3,5 год розмов; з кейсом — понад 24 год прослуховування або 18 год розмов",
      "Швидка зарядка: 5 хв у кейсі = приблизно 1 година роботи"
    ],
    colors: [
      { label: "White", imageUrl: "/materials/airpods/pro1.png", caption: "AirPods Pro 1 (2019)", default: true }
    ]
  },
  {
    slug: "airpods-pro-2-2022",
    title: "AirPods Pro 2: Lightning (2022)/USB-C (2023)",
    family: "AirPods Pro",
    summary: "Друге покоління Pro з H2, значно кращим ANC, кейсом MagSafe/USB-C і зарядкою від Apple Watch.",
    overview: ["Чип: Apple H2 + U1 у кейсі", "Bluetooth: 5.3", "ANC нового рівня"],
    highlights: [
  "Процесор: Apple H2 у навушниках + Apple U1 у зарядному кейсі",
  "Bluetooth: 5.3",
  "Аудіо-технології: Active Noise Cancellation удвічі ефективніше, Adaptive Transparency, Adaptive EQ, Personalized Spatial Audio з динамічним відстеженням голови",
  "Керування: сенсорне — натискання, свайпи для регулювання гучності, перемикання треків, виклики, Siri",
  "Датчики: подвійні спрямовані мікрофони, внутрішній мікрофон, датчик контакту зі шкірою, акселерометр руху та голосової активності",
  "MagSafe-кейс: Lightning (2022) або USB-C (2023); підтримує Qi та Apple Watch, має динамік і петлю для ремінця",
  "Амбушури: 4 розміри (XS/S/M/L)",
  "Захист: USB-C-версія IP54; Lightning-версія IPX4",
  "Автономність: до 6 годин прослуховування (5,5 год з Spatial Audio), до 30 годин із кейсом",
  "Швидка зарядка: 5 хв = приблизно 1 година відтворення або розмови"
],
    colors: [
      { label: "White", imageUrl: "/materials/airpods/airpods-pro-2.png", caption: "AirPods Pro 2 (2022)", default: true }
    ]
  },
  {
    slug: "airpods-pro-3-2025",
    title: "AirPods Pro 3 (2025)",
    family: "AirPods Pro",
    summary: "Внутрішньоканальні навушники з чипом H2, активним шумозаглушенням і датчиком серцевого ритму для тренувань.",
    overview: ["Чип: Apple H2 + UWB другого покоління у кейсі", "Bluetooth: 5.3", "ANC нового покоління"],
    highlights: [
      "Процесор: Apple H2 у навушниках; UWB другого покоління у зарядному кейсі",
      "Bluetooth: 5.3",
      "Аудіо-технології: ANC нового покоління, Adaptive Audio, Transparency Mode, Conversation Awareness, Voice Isolation, Adaptive EQ",
      "Додаткові функції: датчик серцевого ритму для тренувань, персоналізоване просторове аудіо; Live Translation потребує сумісного iPhone, програмного забезпечення та підтримуваної мови",
      "Керування: сенсорне — натискання, свайпи для регулювання гучності, перемикання треків, виклики, Siri",
      "Зарядний кейс: MagSafe + USB-C, сумісний із Qi та Apple Watch; вбудований динамік і петля для ремінця",
      "Амбушури: силіконові, 5 розмірів (XXS/XS/S/M/L)",
      "Захист: IP57 (пил, волога, піт)",
      "Автономність: до 8 годин з ANC, до 6,5 год під час тренування з вимірюванням пульсу; із кейсом — до 24 год з ANC",
      "Швидка зарядка: 5 хв = приблизно 1 година відтворення"
    ],
    colors: [
      { label: "White", imageUrl: "/materials/airpods/pro3-Photoroom.png", caption: "AirPods Pro 3 (2025)", default: true }
    ]
  }
];

export const airpodsMaxCatalog: ModuleCatalogProduct[] = [
  {
    slug: "airpods-max-2020",
    title: "AirPods Max (1 покоління, 2020)",
    family: "AirPods Max",
    summary: "Повнорозмірні навушники Apple з Digital Crown, преміальним ANC і виразною посадкою для домашнього та офісного аудіо.",
    overview: ["Чип: Apple H1 у кожному навушнику", "Bluetooth: 5.0", "До 20 год автономності"],
    highlights: [
      "Процесор: Apple H1 у кожному навушнику",
      "Bluetooth: 5.0",
      "Аудіо-технології: динамічний драйвер від Apple, ANC професійного рівня, Transparency Mode, Adaptive EQ, Spatial Audio з динамічним відстеженням голови",
      "Керування: Digital Crown + окрема кнопка керування шумозаглушенням",
      "Мікрофони: 9 мікрофонів (8 для ANC, 3 для голосу, частина використовується одночасно)",
      "Датчики: оптичний датчик, датчик положення, датчик виявлення чохла, акселерометр у кожному навушнику, гіроскоп у лівому навушнику",
      "Зарядка: Lightning (через кабель USB-C to Lightning у комплекті)",
      "Автономність: до 20 годин прослуховування, розмов або перегляду відео з увімкненим ANC та Spatial Audio",
      "Швидка зарядка: 5 хв = приблизно 1,5 години прослуховування",
      "Чохол: Smart Case переводить навушники у режим наднизького енергоспоживання",
      "Вага: 386 г (навушники), 134 г (Smart Case)",
      "Кольори: Silver, Space Gray, Sky Blue, Pink, Green"
    ],
    colors: [
  {
    "label": "Загальний вигляд",
    "imageUrl": "/materials/airpods/max1.png",
    "caption": "AirPods Max (2020)",
    "default": true
  }
]
  },
  {
    slug: "airpods-max-2-2024",
    title: "AirPods Max із USB-C (2024)",
    family: "AirPods Max",
    summary: "Оновлення повнорозмірної лінійки з USB-C, Lossless через кабель і сучаснішою палітрою кольорів.",
    overview: ["Чип: Apple H1 у кожному навушнику", "Bluetooth: 5.0", "USB-C + Lossless"],
    highlights: [
      "Процесор: Apple H1 у кожному навушнику",
      "Bluetooth: 5.0",
      "Аудіотехнології: динамічний драйвер Apple, ANC, режим прозорості, адаптивний еквалайзер, персоналізоване просторове аудіо, Lossless Audio через USB-C",
      "Керування: Digital Crown (гучність, треки, виклики, Siri) + кнопка керування шумозаглушенням",
      "Мікрофони: 9 мікрофонів (8 для ANC, 3 для голосу, частина використовується одночасно)",
      "Датчики: оптичний датчик, датчик положення, датчик виявлення чохла, акселерометр у кожному навушнику, гіроскоп у лівому навушнику",
      "Зарядка: USB-C",
      "Автономність: до 20 годин прослуховування, розмов або перегляду відео з увімкненим ANC та Spatial Audio",
      "Швидка зарядка: 5 хв = приблизно 1,5 години прослуховування",
      "Чохол: Smart Case для збереження заряду в режимі наднизького енергоспоживання",
      "Розміри та вага: 168,6 × 83,4 × 187,3 мм; вага приблизно 386 г",
      "Кольори: Midnight, Starlight, Blue, Purple, Orange"
    ],
    colors: [
  {
    "label": "Загальний вигляд",
    "imageUrl": "/materials/airpods/Max2.png",
    "caption": "AirPods Max із USB-C (2024)",
    "default": true
  }
]
  }
];

export const earpodsCatalog: ModuleCatalogProduct[] = [
  {
    slug: "earpods-3-5mm",
    title: "Apple EarPods з 3,5 мм роз'ємом",
    family: "EarPods",
    summary: "Класичний дротовий варіант для старіших пристроїв, ноутбуків і сценаріїв, де потрібен звичний аудіороз'єм.",
    overview: ["Підключення: 3,5 мм", "Довжина кабелю: 1,2 м", "Є мікрофон і кнопки керування"],
    highlights: [
  "Тип підключення: 3,5 мм аудіороз'єм",
  "Дизайн: класичні дротові навушники з ергономічною формою",
  "Мікрофон і кнопки управління: інтегровані в кабель для музики, дзвінків та гучності",
  "Сумісність: аудіопристрої з 3,5 мм; кнопки та мікрофон залежать від пристрою/адаптера"
],
    colors: [
      { label: "White", imageUrl: "/materials/airpods/earPods3_5.png", caption: "EarPods 3,5 мм", default: true }
    ]
  },
  {
    slug: "earpods-lightning",
    title: "Apple EarPods з Lightning-конектором",
    family: "EarPods",
    summary: "Дротові EarPods для iPhone та iPad з Lightning без потреби в окремому адаптері.",
    overview: ["Підключення: Lightning", "Довжина кабелю: 1,2 м", "Керування музикою, дзвінками і Siri"],
    highlights: [
  "Тип підключення: Lightning",
  "Дизайн: такий самий, як у версії з 3,5 мм, але з конектором Lightning",
  "Мікрофон і кнопки управління: вбудовані кнопки для керування музикою, дзвінками та активації Siri",
  "Сумісність: сумісні iPhone, iPad, iPod touch з Lightning та iOS 10 або новішою"
],
    colors: [
      { label: "White", imageUrl: "/materials/airpods/lightning.png", caption: "EarPods Lightning", default: true }
    ]
  },
  {
    slug: "earpods-usb-c",
    title: "Apple EarPods з USB-C",
    family: "EarPods",
    summary: "Найактуальніший дротовий варіант для сучасних iPad, MacBook, iPhone з USB-C та Android-пристроїв.",
    overview: ["Підключення: USB-C", "Довжина кабелю: 1,2 м", "Підходить для Apple і Android"],
    highlights: [
  "Тип підключення: USB-C",
  "Дизайн: новий варіант для пристроїв з USB-C (iPad, MacBook, Android)",
  "Тип конструкції: вкладиші, зручні для тривалого носіння",
  "Мікрофон і кнопки управління: вбудовані елементи для керування звуком, музикою і дзвінками",
  "Сумісність: підтримувані пристроїз USB-C; наявність порту не підтверджує роботи всіх кнопок"
],
    colors: [
      { label: "White", imageUrl: "/materials/airpods/type-c.png", caption: "EarPods USB-C", default: true }
    ]
  }
];

export const airpodsFoundationBlocks: ModuleContentBlock[] = [
  {
    type: "text",
    title: "Apple AirPods",
    html: `<p>Apple AirPods — це бездротові навушники від Apple, які забезпечують високу якість звуку, простоту використання та глибоку інтеграцію з екосистемою Apple. Вони стали популярним вибором завдяки своїй зручності, автоматичному підключенню до пристроїв Apple і підтримці інноваційних функцій, таких як активне шумозаглушення (ANC) та режим прозорості.</p><p>AirPods налаштовуються одним дотиком — автоматично вмикаються та встановлюють з’єднання. Користуватися ними дуже просто.</p>`
  },
  {
    type: "image",
    title: "Лінійка AirPods",
    url: "/materials/airpods/airpods-pro-2.png",
    caption: "Моделі Apple AirPods та AirPods Pro"
  },
  {
    type: "text",
    title: "Основні функції AirPods",
    html: "<h4>Перевіряйте функції за поколінням</h4><ul><li>Швидке сполучення, автоматичне перемикання та спільне аудіо потребують сумісних пристроїв, облікових записів і версій систем.</li><li>ANC та режим прозорості є в AirPods Pro, Max та AirPods 4ANC. Звичайні AirPods 2/3/4 їх не мають.</li><li>AirPods 2 керуються подвійним дотиком, AirPods 3/4 — датчиком натискання. Pro 2/3 мають також свайп для гучності, Max — Digital Crown.</li><li>Кейс AirPods 4ANC заряджається через USB-C, Qi або зарядний пристрій Apple Watch; це не MagSafe-кейс. У звичайних AirPods 4 кейс заряджається лише через USB-C.</li><li>Просторове аудіо з відстеженням голови й адаптивний еквалайзер залежать від моделі. AirPods 2 не отримують їх лише оновленням системи.</li><li>Pro 3 додає датчик пульсу для тренувань. Live Translation і функції слуху мають вимоги до iPhone, мови, віку та регіону.</li></ul>"
  },
  {
    type: "text",
    title: "Кому підходить кожна лінійка",
    html: `<h3>AirPods</h3>
    <ul>
      <li>Для клієнтів, яким потрібні легкі відкриті навушники без силіконових амбушурів.</li>
      <li>Добре підходять для дзвінків, музики, роботи в екосистемі Apple та комфортного щоденного використання.</li>
    </ul>
    <h3>AirPods Pro</h3>
    <ul>
      <li>Для клієнтів, яким потрібні ANC, режим прозорості, краща шумоізоляція та більш глибока посадка.</li>
      <li>Це найкращий універсальний вибір для міста, транспорту, офісу та подорожей.</li>
    </ul>
    <h3>AirPods Max</h3>
    <ul>
      <li>Для клієнтів, які шукають повнорозмірний формат, сильний ANC, преміальну посадку та домашньо-офісний сценарій.</li>
      <li>Це не компактний формат на щодень у кишеню, а старший аудіопродукт Apple.</li>
    </ul>
    <h3>EarPods</h3>
    <ul>
      <li>Для клієнтів, яким потрібне дротове рішення без зарядки, без затримок і з простим підключенням.</li>
      <li>Особливо актуально для офісу, ноутбука, касових сценаріїв або коли не потрібні бездротові функції.</li>
    </ul>`
  },
  {
    type: "facts",
    title: "Фокус під час консультації",
    items: [
      "Починайте з форми посадки: відкриті AirPods, внутрішньоканальні Pro чи повнорозмірні Max.",
      "Одразу уточнюйте, чи потрібні ANC, режим прозорості, Spatial Audio та сенсорне керування.",
      "Для клієнтів в екосистемі Apple головна цінність — швидке підключення, автоперемикання та спільне аудіо.",
      "AirPods Pro 2 — один із найсильніших універсальних варіантів завдяки H2, ANC і кейсу з зарядкою Apple Watch.",
      "AirPods 4 ANC — компроміс для тих, хто хоче відкритий формат, але вже потребує шумозаглушення.",
      "EarPods продаємо тоді, коли клієнту важливі дротовий формат, стабільність і відсутність потреби заряджати навушники."
    ]
  }
];

export const airpodsCatalogBlocks: ModuleContentBlock[] = [
  {
    type: "text",
    title: "AirPods та EarPods — моделі й технічні характеристики",
    html: `<p>Порівняйте відкриті AirPods, внутрішньоканальні AirPods Pro, повнорозмірні AirPods Max і дротові EarPods. Почніть із посадки та способу підключення, потім зіставте потрібні функції, автономність і сумісність із пристроями клієнта.</p>`
  },
  {
    type: "productCatalog",
    title: "AirPods — базова лінійка",
    products: airpodsMainCatalog
  },
  {
    type: "productCatalog",
    title: "AirPods Pro — моделі та характеристики",
    products: airpodsProCatalog
  },
  {
    type: "productCatalog",
    title: "AirPods Max — повнорозмірна лінійка",
    products: airpodsMaxCatalog
  },
  {
    type: "text",
    title: "Apple EarPods",
    html: `<p>Apple EarPods залишаються актуальними для клієнтів, яким потрібне просте дротове рішення без зарядки, зі стабільним з’єднанням і зрозумілою сумісністю. Важливо правильно підібрати тип конектора: 3,5 мм, Lightning або USB-C.</p>`
  },
  {
    type: "productCatalog",
    title: "EarPods — дротові варіанти",
    products: earpodsCatalog
  },
  {
    type: "facts",
    title: "Як обрати модель",
    items: [
  "Найдоступніший вхід у бездротові Apple-навушники: AirPods 2 або AirPods 3 залежно від бюджету й вимог до дизайну.",
  "Для сучасної відкритої моделі з H2: AirPods 4.",
  "Для відкритого формату з ANC: AirPods 4 ANC.",
  "Pro 2 та Pro 3 — внутрішньоканальні з ANC; Pro 3 додає пульс для тренувань,5 розмірів насадок і до 8 годин з ANC. Порівняйте посадку, автономність та ціну.",
  "Для повнорозмірного формату: AirPods Max; уточніть покоління та роз’єм заряджання.",
  "Для дротового сценарію — підбирайте EarPods за конектором пристрою: 3,5 мм, Lightning або USB-C."
]
  },
  {
    type: "text",
    title: "Що перевірити перед покупкою",
    html: `<p>Звірте покоління, роз’єм зарядного кейса та потрібні функції з конкретною моделлю навушників. Доступність окремих можливостей залежить від пристрою, версії програмного забезпечення, мови та регіону.</p><p>Характеристики: <a href="https://www.apple.com/airpods-pro/specs/" target="_blank" rel="noopener noreferrer">AirPods Pro 3</a>, <a href="https://support.apple.com/en-us/121205" target="_blank" rel="noopener noreferrer">AirPods Max із USB-C (2024)</a>.</p>`
  }
];

const appleAirpodsContent = {
  airpodsMainCatalog,
  airpodsProCatalog,
  airpodsMaxCatalog,
  earpodsCatalog,
  airpodsFoundationBlocks,
  airpodsCatalogBlocks
};

export default appleAirpodsContent;
