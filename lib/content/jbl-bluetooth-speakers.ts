import type { ModuleCatalogProduct, ModuleContentBlock } from "../module-content";

export const jblPortableCatalog: ModuleCatalogProduct[] = [
  {
    slug: "jbl-go-3",
    title: "JBL Go 3",
    family: "Ultra-portable",
    summary: "Ультракомпактна JBL для щоденного носіння, прогулянок і простого сценарію 'кинути в сумку й взяти з собою'.",
    overview: ["Потужність: 4,2 Вт", "Bluetooth: 5.1", "Захист: IP67"],
    highlights: [
      "Максимально компактний формат і вага близько 0,209 кг",
      "Час відтворення до 5 годин, заряджання близько 2,5 години",
      "Кодеки SBC та AAC",
      "Захист IP67 від пилу та вологи",
      "Широка палітра кольорів і молодіжне позиціонування",
      "Хороший вибір для клієнта, якому потрібен найменший JBL без складного сценарію використання"
    ],
    colors: [{ label: "Go 3", imageUrl: "/materials/jbl-bluetooth-speakers/go-3.png", caption: "JBL Go 3", default: true }]
  },
  {
    slug: "jbl-wind-3s",
    title: "JBL Wind 3S",
    family: "Bike / moto portable",
    summary: "Спеціальна компактна модель JBL для велосипеда, самоката або мотоцикла з акцентом на активний рух і мобільність.",
    overview: ["Потужність: 5 Вт", "Bluetooth: 5.0", "Сценарій: bike / moto"],
    highlights: [
      "Створена під активне використання на велосипеді та мотоциклі",
      "Частотний діапазон: 110 Гц – 20 кГц",
      "Акумулятор 1050 мА·год і до 5 годин відтворення",
      "Захист IP67",
      "Bluetooth-профілі A2DP, AVRCP, HFP",
      "Найкраща рекомендація, коли клієнт шукає не просто маленьку колонку, а рішення саме для транспорту чи активного відпочинку"
    ],
    colors: [{ label: "Wind 3S", imageUrl: "/materials/jbl-bluetooth-speakers/wind-3s.png", caption: "JBL Wind 3S", default: true }]
  },
  {
    slug: "jbl-go-4",
    title: "JBL Go 4",
    family: "Ultra-portable",
    summary: "Нове покоління маленького JBL із сучаснішим Bluetooth і трохи сильнішою автономністю для щоденного мобільного сценарію.",
    overview: ["Потужність: 4,2 Вт", "Bluetooth: 5.3", "Час роботи: до 7 год"],
    highlights: [
      "Динамік 45 мм і покращений компактний сценарій у порівнянні з ранніми Go",
      "Частотний діапазон: 90 Гц – 20 кГц",
      "До 7 годин відтворення",
      "Час заряджання близько 3 годин",
      "Захист IPX7",
      "Для клієнта, який хоче мінімальний розмір, але свіже покоління JBL"
    ],
    colors: [{ label: "Go 4", imageUrl: "/materials/jbl-bluetooth-speakers/go-4.png", caption: "JBL Go 4", default: true }]
  },
  {
    slug: "jbl-clip-4",
    title: "JBL Clip 4",
    family: "Portable with carabiner",
    summary: "Невелика portable-колонка JBL із вбудованим карабіном для рюкзака, велосипеда чи щоденного активного використання.",
    overview: ["Потужність: 5 Вт", "Bluetooth: 5.1", "Захист: IP67"],
    highlights: [
      "Оновлений дизайн із покращеним карабіном",
      "До 10 годин автономної роботи",
      "Кодеки SBC та AAC",
      "Захист IP67",
      "Вага близько 0,239 кг",
      "Добре підходить клієнту, який хоче компактність, але зручніше кріплення, ніж у JBL Go"
    ],
    colors: [{ label: "Clip 4", imageUrl: "/materials/jbl-bluetooth-speakers/clip-4.png", caption: "JBL Clip 4", default: true }]
  },
  {
    slug: "jbl-clip-4-eco",
    title: "JBL Clip 4 Eco",
    family: "Portable with carabiner",
    summary: "Еко-версія Clip 4 для клієнта, який хоче той самий формат із додатковим акцентом на перероблені матеріали.",
    overview: ["Потужність: 5 Вт", "Bluetooth: 5.1", "Фокус: eco version"],
    highlights: [
      "Зберігає сценарій Clip 4 з карабіном та IP67",
      "До 10 годин роботи та близько 3 годин заряджання",
      "Кодеки SBC та AAC",
      "Вага близько 0,239 кг",
      "Позиціонується як екологічніша версія популярної моделі",
      "Добрий варіант для клієнта, якому важлива ідея перероблених матеріалів без втрати функціональності"
    ],
    colors: [{ label: "Clip 4 Eco", imageUrl: "/materials/jbl-bluetooth-speakers/clip-4-eco.png", caption: "JBL Clip 4 Eco", default: true }]
  },
  {
    slug: "jbl-flip-5",
    title: "JBL Flip 5",
    family: "Everyday portable",
    summary: "Класичний JBL-сценарій для більшості клієнтів: portable середнього розміру, хороший баланс ціни, гучності та мобільності.",
    overview: ["Потужність: 20 Вт", "Bluetooth: 4.2", "Час роботи: до 12 год"],
    highlights: [
      "Одна з найпопулярніших серій JBL для повсякденного portable-сценарію",
      "IPX7 і до 12 годин автономності",
      "PartyBoost для об'єднання сумісних JBL у гучнішу систему",
      "Вага близько 0,54 кг",
      "Кодек SBC",
      "Добре продається клієнту, який хоче універсальний JBL без переходу в великі моделі"
    ],
    colors: [{ label: "Flip 5", imageUrl: "/materials/jbl-bluetooth-speakers/flip-5.png", caption: "JBL Flip 5", default: true }]
  },
  {
    slug: "jbl-flip-essential-2",
    title: "JBL Flip Essential 2",
    family: "Everyday portable",
    summary: "Спрощений portable JBL для клієнта, якому потрібен формат Flip, але без акценту на розширені фішки старших версій.",
    overview: ["Потужність: 20 Вт", "Bluetooth: 5.1", "Час роботи: до 10 год"],
    highlights: [
      "JBL Original Pro Sound у більш простому виконанні серії Flip",
      "IPX7 і до 10 годин відтворення",
      "Вага близько 0,52 кг",
      "Колір: Gun Metal",
      "Підходить для базового portable-сценарію без переплати за яскравіші старші моделі",
      "Хороша відповідь, коли клієнт хоче 'щось типу Flip, але простіше'"
    ],
    colors: [{ label: "Flip Essential 2", imageUrl: "/materials/jbl-bluetooth-speakers/flip-essential-2.png", caption: "JBL Flip Essential 2", default: true }]
  },
  {
    slug: "jbl-flip-6",
    title: "JBL Flip 6",
    family: "Everyday portable",
    summary: "Одна з найсильніших універсальних portable-моделей JBL: голосніша, чистіша та сучасніша за Flip 5.",
    overview: ["Потужність: 30 Вт", "Bluetooth: 5.1", "Захист: IP67"],
    highlights: [
      "Двосмугова акустика та виразніше звучання порівняно з попередніми Flip",
      "IP67, до 12 годин автономності",
      "PartyBoost для зв'язування кількох сумісних JBL",
      "Вага близько 0,54 кг",
      "Частотний діапазон: 63 Гц – 20 кГц",
      "Одна з найкращих рекомендацій, коли клієнту потрібен JBL 'на всі випадки'"
    ],
    colors: [{ label: "Flip 6", imageUrl: "/materials/jbl-bluetooth-speakers/flip-6.png", caption: "JBL Flip 6", default: true }]
  },
  {
    slug: "jbl-charge-5",
    title: "JBL Charge 5",
    family: "Portable with powerbank",
    summary: "Серія JBL для клієнта, який хоче більше басу, довшу автономність і функцію павербанку в одному portable-корпусі.",
    overview: ["Потужність: 40 Вт", "Bluetooth: 5.1", "Час роботи: до 20 год"],
    highlights: [
      "Потужніший сценарій, ніж у Flip, плюс функція заряджання інших гаджетів",
      "До 20 годин автономності",
      "Захист IP67",
      "PartyBoost для об'єднання кількох колонок",
      "Вага близько 0,96 кг",
      "Найкраще продається клієнту, який хоче portable JBL із запасом по батареї та потужності"
    ],
    colors: [{ label: "Charge 5", imageUrl: "/materials/jbl-bluetooth-speakers/charge-5.png", caption: "JBL Charge 5", default: true }]
  },
  {
    slug: "jbl-charge-essential-2",
    title: "JBL Charge Essential 2",
    family: "Portable with powerbank",
    summary: "Більш проста версія Charge із довгою автономністю та функцією павербанку для клієнта, якому важливий практичний portable-сценарій.",
    overview: ["Потужність: 30 Вт", "Bluetooth: 5.1", "Час роботи: до 20 год"],
    highlights: [
      "Поєднує portable-формат із powerbank-сценарієм",
      "До 20 годин автономної роботи",
      "Захист IPX7",
      "Вага близько 0,93 кг",
      "Колір: Black",
      "Добрий варіант, коли клієнту потрібна батарея надовго та практичність без акценту на PartyBoost-фішках старших моделей"
    ],
    colors: [{ label: "Charge Essential 2", imageUrl: "/materials/jbl-bluetooth-speakers/charge-essential-2.png", caption: "JBL Charge Essential 2", default: true }]
  },
  {
    slug: "jbl-pulse-4",
    title: "JBL Pulse 4",
    family: "Portable with light show",
    summary: "JBL для клієнтів, яким важливе не тільки звучання, а й атмосферне світлове шоу в колонці.",
    overview: ["Потужність: 20 Вт", "Bluetooth: 4.2", "Фокус: 360° light show"],
    highlights: [
      "360°-світлове шоу під музику або окремо",
      "Звук на 360° за рахунок бас-порту та спрямованого вгору драйвера",
      "До 12 годин автономності",
      "IPX7",
      "Вага близько 1,2 кг",
      "Підходить клієнтам, яким важлива вау-подача на вечірках і вдома"
    ],
    colors: [{ label: "Pulse 4", imageUrl: "/materials/jbl-bluetooth-speakers/pulse-4.png", caption: "JBL Pulse 4", default: true }]
  },
  {
    slug: "jbl-pulse-5",
    title: "JBL Pulse 5",
    family: "Portable with light show",
    summary: "Оновлена Pulse-серія з виразнішим JBL Pro Sound і сучаснішим світловим шоу для вечірок та емоційного сценарію продажу.",
    overview: ["Потужність: 40 Вт", "Bluetooth: 5.3", "Захист: IP67"],
    highlights: [
      "Окремі низькочастотний і висхідний драйвери плюс пасивний радіатор",
      "Світлове шоу 360° під музику",
      "До 12 годин автономності",
      "IP67",
      "PartyBoost і додаток JBL Portable",
      "Сильна модель для клієнта, який хоче видовищність, стиль і вау-ефект"
    ],
    colors: [{ label: "Pulse 5", imageUrl: "/materials/jbl-bluetooth-speakers/pulse-5.png", caption: "JBL Pulse 5", default: true }]
  },
  {
    slug: "jbl-xtreme-3",
    title: "JBL Xtreme 3",
    family: "Large portable",
    summary: "Потужний outdoor-portable JBL із великим звуком, powerbank-сценарієм і гарним запасом автономності.",
    overview: ["Потужність: 100 Вт", "Bluetooth: 5.1", "Час роботи: до 15 год"],
    highlights: [
      "4 динаміки загальною потужністю 100 Вт",
      "IP67 і формат для виїздів, відпочинку та великого outdoor-сценарію",
      "USB для заряджання пристроїв",
      "До 15 годин автономності",
      "PartyBoost для об'єднання з іншими сумісними JBL",
      "Рекомендується клієнту, якому Charge вже замалий, але Boombox ще занадто великий"
    ],
    colors: [{ label: "Xtreme 3", imageUrl: "/materials/jbl-bluetooth-speakers/xtreme-3.png", caption: "JBL Xtreme 3", default: true }]
  },
  {
    slug: "jbl-boombox-2",
    title: "JBL Boombox 2",
    family: "Large party portable",
    summary: "Великий portable JBL для гучних вечірок і тривалого відтворення без прив'язки до розетки.",
    overview: ["Потужність: 80 Вт", "Bluetooth: 5.1", "Час роботи: до 24 год"],
    highlights: [
      "Великий корпус і відчутний запас гучності",
      "До 24 годин автономності",
      "IPX7",
      "USB для заряджання зовнішніх пристроїв",
      "Сценарій великих компаній, дачі, пікніків і outdoor-вечірок",
      "Добре заходить клієнтам, яким потрібен максимально гучний portable JBL"
    ],
    colors: [{ label: "Boombox 2", imageUrl: "/materials/jbl-bluetooth-speakers/boombox-2.png", caption: "JBL Boombox 2", default: true }]
  },
  {
    slug: "jbl-boombox-3",
    title: "JBL Boombox 3",
    family: "Large party portable",
    summary: "Ще потужніший portable-флагман JBL для великих просторів і клієнтів, яким потрібен максимально агресивний party-сценарій.",
    overview: ["Потужність: 180 Вт", "Bluetooth: 5.3", "Час роботи: до 24 год"],
    highlights: [
      "3-смугова акустика й сильніший, масштабніший звук, ніж у Boombox 2",
      "До 24 годин автономності",
      "IP67",
      "USB для заряджання пристроїв",
      "PartyBoost для зв'язування сумісних JBL",
      "Коли клієнт питає 'найбільший і найсерйозніший portable JBL', це один із перших варіантів"
    ],
    colors: [{ label: "Boombox 3", imageUrl: "/materials/jbl-bluetooth-speakers/boombox-3.png", caption: "JBL Boombox 3", default: true }]
  },
  {
    slug: "jbl-partybox-club-120",
    title: "JBL PartyBox Club 120",
    family: "Party speaker",
    summary: "Портативна PartyBox для вечірок і заходів, де важливі світлове шоу, мікрофонні входи й гучний JBL-звук.",
    overview: ["Потужність: 160 Вт", "Час роботи: до 12 год", "Захист: IPX4"],
    highlights: [
      "2 × 5,25-дюймові низькочастотні та 2 × 2,25-дюймові високочастотні динаміки",
      "RGB-підсвітка, синхронізована з музикою",
      "До 12 годин автономності і швидка зарядка 10 хв = 80 хв",
      "2 входи під мікрофони та 1 гітарний вхід",
      "Зручна ручка для перенесення",
      "Хороший варіант для клієнта, якому потрібна саме party-колонка, але ще не найбільший формат"
    ],
    colors: [{ label: "PartyBox Club 120", imageUrl: "/materials/jbl-bluetooth-speakers/partybox-club-120.png", caption: "JBL PartyBox Club 120", default: true }]
  },
  {
    slug: "jbl-partybox-310",
    title: "JBL PartyBox 310",
    family: "Party speaker",
    summary: "Потужна party-система JBL на колесах для виїзних подій, великих компаній і яскравого вечіркового сценарію.",
    overview: ["Потужність: 240 Вт", "Час роботи: до 18 год", "Захист: IPX4"],
    highlights: [
      "2 × 6,5-дюймові низькочастотні та 2 × 2,5-дюймові високочастотні драйвери",
      "RGB-світлове шоу",
      "До 18 годин автономності",
      "Колеса та ручка для транспортування",
      "2 мікрофонні входи й 1 гітарний",
      "Сильна рекомендація для клієнта, якому потрібна мобільна party-колонка з запасом по гучності"
    ],
    colors: [{ label: "PartyBox 310", imageUrl: "/materials/jbl-bluetooth-speakers/partybox-310.png", caption: "JBL PartyBox 310", default: true }]
  },
  {
    slug: "jbl-partybox-stage-320",
    title: "JBL PartyBox Stage 320",
    family: "Party speaker",
    summary: "Свіжіший party-сценарій JBL з телескопічною ручкою, колесами й швидкою зарядкою для мобільних івентів.",
    overview: ["Потужність: 240 Вт", "Час роботи: до 18 год", "Захист: IPX4"],
    highlights: [
      "2 × 6,5-дюймові низькочастотні та 2 × 2,5-дюймові високочастотні драйвери",
      "RGB-світлове шоу під музику",
      "До 18 годин роботи, швидка зарядка 10 хв = 2 години",
      "Телескопічна ручка та колеса",
      "2 мікрофонні входи й 1 гітарний",
      "Коли клієнт порівнює PartyBox 310 і новіший формат, Stage 320 виглядає актуальніше по мобільності"
    ],
    colors: [{ label: "PartyBox Stage 320", imageUrl: "/materials/jbl-bluetooth-speakers/partybox-stage-320.png", caption: "JBL PartyBox Stage 320", default: true }]
  },
  {
    slug: "jbl-partybox-710",
    title: "JBL PartyBox 710",
    family: "Party speaker",
    summary: "Велика party-система JBL для максимально гучних вечірок і наймасштабнішого домашнього або івент-сценарію.",
    overview: ["Потужність: 800 Вт", "Захист: IPX4", "Фокус: великий party format"],
    highlights: [
      "2 × 8-дюймові низькочастотні та 2 × 2-дюймові високочастотні драйвери",
      "Світлове шоу з різними стилями підсвітки",
      "Колеса й ручка для переміщення",
      "2 мікрофонні входи та 1 гітарний",
      "Сильний JBL Pro Sound для великих просторів і вечірок",
      "Для клієнта, який хоче саме дуже велику party-систему, а не просто portable-колонку"
    ],
    colors: [{ label: "PartyBox 710", imageUrl: "/materials/jbl-bluetooth-speakers/partybox-710.png", caption: "JBL PartyBox 710", default: true }]
  }
];

export const jblAuthenticsCatalog: ModuleCatalogProduct[] = [
  {
    slug: "jbl-authentics-l8",
    title: "JBL Authentics L8",
    family: "Authentics",
    summary: "Компактна преміальна домашня акустика JBL у ретро-стилі для клієнта, якому важливі не лише звук і стрімінг, а й статусний вигляд у інтер'єрі.",
    overview: ["Потужність: 90 Вт сумарно", "Підключення: Wi-Fi + Bluetooth + AirPlay + DLNA", "Формат: home premium"],
    highlights: [
      "2 × 30 Вт середньочастотні й 2 × 15 Вт високочастотні динаміки",
      "Частотний діапазон: 45 Гц – 35 кГц",
      "Підтримує Wi-Fi, Bluetooth, AirPlay і DLNA",
      "Є USB для зарядки, AUX 3,5 мм та оптичний вхід",
      "Ретро-корпус із чорного дерева",
      "Для клієнта, який хоче компактний, але дуже дизайнерський JBL додому"
    ],
    colors: [{ label: "Authentics L8", imageUrl: "/materials/jbl-bluetooth-speakers/authentics-l8.png", caption: "JBL Authentics L8", default: true }]
  },
  {
    slug: "jbl-authentics-200",
    title: "JBL Authentics 200",
    family: "Authentics",
    summary: "Сучасний домашній JBL із ретро-естетикою, Wi‑Fi-сценарієм і голосовими помічниками для преміального житлового простору.",
    overview: ["Потужність: 90 Вт", "Підключення: Bluetooth + Wi-Fi", "Фокус: smart home audio"],
    highlights: [
      "Підтримка Bluetooth 5.0, Wi-Fi, Spotify Connect та Amazon Alexa",
      "Сумісність із Google Chromecast",
      "Частотний діапазон: 50 Гц – 20 кГц",
      "Ретро-мінімалізм із преміальними матеріалами",
      "Хороший варіант для дому, коли клієнту важливі стиль, стрімінг і смарт-функції",
      "Добре продається як JBL для інтер'єру, а не лише як portable-колонка"
    ],
    colors: [{ label: "Authentics 200", imageUrl: "/materials/jbl-bluetooth-speakers/authentics-200.png", caption: "JBL Authentics 200", default: true }]
  },
  {
    slug: "jbl-authentics-500",
    title: "JBL Authentics 500",
    family: "Authentics",
    summary: "Флагманська домашня Authentics-модель JBL для великих приміщень, аудіофільського сценарію та сильного вау-ефекту в інтер'єрі.",
    overview: ["Потужність: 270 Вт", "Підключення: Bluetooth + Wi-Fi + AirPlay + Chromecast", "Фокус: flagship home audio"],
    highlights: [
      "Флагманська потужність 270 Вт",
      "Підтримка Bluetooth, Wi-Fi, Google Chromecast, AirPlay та Spotify Connect",
      "3D-звук і ефект більш об'ємного звучання",
      "Автокалібрування під акустику приміщення",
      "Можливість об'єднання кількох колонок для розширеного сценарію",
      "Ідеально для клієнта, який хоче преміум-JBL для великого простору й статусного домашнього аудіо"
    ],
    colors: [{ label: "Authentics 500", imageUrl: "/materials/jbl-bluetooth-speakers/authentics-500.png", caption: "JBL Authentics 500", default: true }]
  }
];

export const jblBarCatalog: ModuleCatalogProduct[] = [
  {
    slug: "jbl-bar-1300",
    title: "JBL Bar 1300",
    family: "JBL Bar",
    summary: "Топова саундбар-система JBL для домашнього кінотеатру з потужним сабвуфером, від'єднуваними колонками й максимально об'ємним 3D-звуком.",
    overview: ["Потужність: 1170 Вт", "Формат: premium soundbar", "Фокус: Dolby Atmos + detachable surrounds"],
    highlights: [
      "10-дюймовий бездротовий сабвуфер",
      "Знімні бездротові колонки для реального surround-сценарію",
      "Підтримка Dolby Atmos і DTS:X",
      "Wi‑Fi з AirPlay, Alexa Multi-Room Music та Chromecast",
      "PureVoice для кращої розбірливості діалогів",
      "Один із найсильніших JBL-варіантів для клієнта, який будує серйозний домашній кінотеатр"
    ],
    colors: [{ label: "Bar 1300", imageUrl: "/materials/jbl-bluetooth-speakers/bar-1300.png", caption: "JBL Bar 1300", default: true }]
  },
  {
    slug: "jbl-bar-1000",
    title: "JBL Bar 1000",
    family: "JBL Bar",
    summary: "Преміальна саундбар-система JBL для клієнта, якому потрібен дуже сильний 3D-звук, але не обов'язково максимальний флагман бренду.",
    overview: ["Потужність: 880 Вт", "Конфігурація: 7.1.4", "Фокус: cinematic sound"],
    highlights: [
      "7.1.4-конфігурація з Dolby Atmos і DTS:X",
      "Знімні бездротові колонки та сабвуфер",
      "Потужність 880 Вт",
      "MultiBeam і Room Calibration",
      "HDMI eARC та кілька HDMI-входів",
      "Добре продається як домашній кінотеатр JBL високого рівня без переходу в Bar 1300"
    ],
    colors: [{ label: "Bar 1000", imageUrl: "/materials/jbl-bluetooth-speakers/bar-1000.png", caption: "JBL Bar 1000", default: true }]
  },
  {
    slug: "jbl-bar-800",
    title: "JBL Bar 800",
    family: "JBL Bar",
    summary: "Сильний середній саундбар-сценарій JBL із Dolby Atmos і знімними колонками для клієнта, який хоче об'ємний звук без входу в найдорожчі системи.",
    overview: ["Потужність: 720 Вт", "Конфігурація: 5.1.2", "Фокус: surround + value"],
    highlights: [
      "5.1.2-система з Dolby Atmos",
      "Знімні бездротові колонки та 10-дюймовий сабвуфер",
      "Потужність 720 Вт",
      "MultiBeam та Room Calibration",
      "HDMI eARC і Bluetooth",
      "Логічна рекомендація для клієнта, який хоче справжній surround без бюджету на Bar 1000 / 1300"
    ],
    colors: [{ label: "Bar 800", imageUrl: "/materials/jbl-bluetooth-speakers/bar-800.png", caption: "JBL Bar 800", default: true }]
  },
  {
    slug: "jbl-bar-500",
    title: "JBL Bar 500",
    family: "JBL Bar",
    summary: "Більш доступний 5.1-саундбар JBL для клієнта, якому потрібне серйозне покращення телевізійного звуку без переходу в топові surround-системи.",
    overview: ["Потужність: 590 Вт", "Формат: 5.1 soundbar", "Фокус: TV upgrade"],
    highlights: [
      "Потужність 590 Вт і 10-дюймовий сабвуфер",
      "Dolby Atmos і MultiBeam",
      "Wi‑Fi з AirPlay, Alexa Multi-Room Music та Chromecast",
      "HDMI eARC і кілька HDMI-входів",
      "Room Calibration для підстроювання під кімнату",
      "Добрий варіант для клієнта, якому треба суттєво кращий звук телевізора, але без топового бюджету"
    ],
    colors: [{ label: "Bar 500", imageUrl: "/materials/jbl-bluetooth-speakers/bar-500.png", caption: "JBL Bar 500", default: true }]
  }
];

export const jblFoundationBlocks: ModuleContentBlock[] = [
  {
    type: "text",
    title: "JBL",
    html: `<p>JBL є американським брендом аудіообладнання, що спеціалізується на розробці та виробництві акустичних систем, портативних динаміків, навушників та інших пристроїв звукового відтворення.</p><p>Колонки JBL відрізняються високою якістю звуку, потужними басами та широким діапазоном звукових частот, що забезпечує високий рівень звукового досвіду. Компанія JBL була заснована в 1946 році та протягом більш як 75 років займається виробництвом високоякісних аудіообладнання для домашнього, студійного та професійного використання. Одним з ключових принципів JBL є інноваційність та постійний пошук нових технологій, які дозволяють покращувати якість звуку.</p>`
  },
  {
    type: "text",
    title: "JBL: як позиціонувати бренд у консультації",
    html: `<p>JBL — американський аудіобренд, який добре продається через поєднання потужного звуку, впізнаваного басового характеру, широкої лінійки сценаріїв і сильної впізнаваності серед масового клієнта. У JBL є все: від маленьких portable-колонок до великих PartyBox, домашніх Authentics і JBL Bar для кінотеатру.</p><p>Головне в консультації по JBL — не починати з моделі, а швидко визначити сценарій: <strong>кишеньковий portable</strong>, <strong>універсальна portable-колонка</strong>, <strong>великий party-формат</strong>, <strong>стильне домашнє аудіо</strong> чи <strong>саундбар під телевізор</strong>.</p>`
  },
  {
    type: "text",
    title: "Як пояснити різницю між лінійками JBL",
    html: `<h3>Компактні portable</h3><ul><li><strong>Go / Clip / Wind:</strong> максимум мобільності, карабін, велосипедний або кишеньковий сценарій.</li></ul><h3>Універсальні portable</h3><ul><li><strong>Flip / Charge / Pulse:</strong> щоденне використання, подорожі, дім, вулиця.</li></ul><h3>Великі portable та party</h3><ul><li><strong>Xtreme / Boombox / PartyBox:</strong> більше гучності, вечірки, outdoor, великі компанії.</li></ul><h3>Домашнє преміум-аудіо</h3><ul><li><strong>Authentics:</strong> ретро-дизайн, Wi-Fi, AirPlay, преміальний домашній сценарій.</li></ul><h3>Домашній кінотеатр</h3><ul><li><strong>JBL Bar:</strong> саундбари з сабвуферами, Dolby Atmos і кінотеатральним позиціонуванням.</li></ul>`
  },
  {
    type: "image",
    title: "JBL Charge 5",
    url: "/materials/jbl-bluetooth-speakers/charge-5.png",
    caption: "Одна з найсильніших універсальних portable-моделей JBL"
  },
  {
    type: "text",
    title: "Ключові технології та аргументи продажу JBL",
    html: `<ul><li><strong>IP-захист:</strong> важливий для пляжу, подорожей, басейну, кемпінгу та активного способу життя.</li><li><strong>PartyBoost:</strong> допомагає об'єднувати сумісні JBL у гучнішу систему або стереопару.</li><li><strong>Powerbank-сценарій:</strong> у Charge, Xtreme, Boombox окремо підсилює цінність для поїздок.</li><li><strong>Світлове шоу:</strong> ключова історія для Pulse і PartyBox.</li><li><strong>Wi‑Fi, AirPlay, Chromecast:</strong> аргументи для Authentics і JBL Bar, коли клієнту важливий домашній стрімінг і smart-home сценарій.</li><li><strong>Знімні бездротові колонки:</strong> сильний selling point у JBL Bar 800/1000/1300.</li></ul>`
  },
  {
    type: "image",
    title: "JBL Bar 1300",
    url: "/materials/jbl-bluetooth-speakers/bar-1300.png",
    caption: "Преміальний JBL-сценарій для домашнього кінотеатру"
  },
  {
    type: "facts",
    title: "Швидка логіка підбору JBL",
    items: [
      "Go / Clip / Wind = максимум компактності та мобільності.",
      "Flip = найзручніший повсякденний JBL для більшості клієнтів.",
      "Charge = portable + довга автономність + powerbank.",
      "Pulse = музика плюс світловий вау-ефект.",
      "Xtreme / Boombox = великий portable-звук для компаній і відпочинку.",
      "PartyBox = коли клієнту потрібна саме вечіркова система, мікрофони, RGB і більше гучності.",
      "Authentics = стильний преміальний JBL для дому й інтер'єру.",
      "JBL Bar = рішення для телевізора, фільмів і домашнього кінотеатру."
    ]
  }
];

export const jblCatalogBlocks: ModuleContentBlock[] = [
  {
    type: "text",
    title: "JBL portable, Authentics і Bar — як читати каталог",
    html: `<p>У JBL є три різні напрями: <strong>портативні колонки</strong> для мобільного використання, <strong>домашня серія Authentics</strong> для музики в приміщенні та <strong>саундбари JBL Bar</strong> для телевізора.</p><p>Спочатку уточніть місце використання й джерело звуку, потім порівняйте розмір, підключення, автономність і потрібні функції.</p>`
  },
  {
    type: "productCatalog",
    title: "JBL портативна акустика",
    products: jblPortableCatalog
  },
  {
    type: "text",
    title: "JBL Authentics",
    html: `<p>Лінійка Authentics — це JBL для клієнтів, які хочуть преміальне домашнє звучання, ретро-естетику та сучасні бездротові технології. У наданому матеріалі окремо згадувалися моделі <strong>L8</strong>, <strong>L16</strong>, <strong>Authentics 200</strong> та <strong>Authentics 500</strong>; детальні характеристики були саме для L8, 200 і 500.</p>`
  },
  {
    type: "productCatalog",
    title: "JBL Authentics: домашня преміальна акустика",
    products: jblAuthenticsCatalog
  },
  {
    type: "text",
    title: "JBL Bar soundbars",
    html: `<p>Серія JBL Bar потрібна тоді, коли клієнт шукає не portable-колонку, а рішення для телевізора, фільмів, ігор і домашнього кінотеатру. Тут важливі Dolby Atmos, сабвуфер, бездротові тилові колонки та калібрування під кімнату.</p>`
  },
  {
    type: "productCatalog",
    title: "JBL Bar: саундбари та домашній кінотеатр",
    products: jblBarCatalog
  },
  {
    type: "facts",
    title: "Ключові орієнтири по JBL",
    items: [
      "Flip / Charge / Pulse — найчастіший центр консультації в portable-сегменті.",
      "PartyBoost є сильним аргументом апсейлу, коли клієнт думає про пару колонок або майбутнє розширення системи.",
      "Charge, Xtreme і Boombox добре заходять клієнтам, які хочуть portable із запасом по батареї та гучності.",
      "PartyBox продається не через компактність, а через вечірку, мікрофони, підсвітку і атмосферу виступу.",
      "Authentics — це вже не просто 'ще одна колонка JBL', а більш преміальна домашня історія з ретро-дизайном.",
      "JBL Bar треба продавати через сценарій фільмів і телевізора, а не як альтернативу portable-колонкам."
    ]
  },
  {
    type: "text",
    title: "Загальні переваги лінійки JBL Authentics",
    html: `<ul><li>Преміальний ретро-дизайн із сучасними технологіями бездротового відтворення.</li><li>Дерев'яний корпус, який покращує акустичні характеристики.</li><li>Підтримка популярних сервісів і стрімінгових протоколів.</li><li>Сильний вибір для клієнта, який цінує якість звуку, функціональність та стильний дизайн.</li></ul><p>Ці колонки створені для тих, хто цінує якість звуку, функціональність та стильний дизайн. Якщо ви шукаєте преміальну акустику з акцентом на ретро-естетиці, JBL Authentics – ваш вибір.</p>`
  }
];

const jblBluetoothSpeakersContent = {
  jblPortableCatalog,
  jblAuthenticsCatalog,
  jblBarCatalog,
  jblFoundationBlocks,
  jblCatalogBlocks
};

export default jblBluetoothSpeakersContent;
