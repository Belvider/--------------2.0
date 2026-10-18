import bcrypt from "bcryptjs";
import { PrismaClient, ProgressStatus, QuestionType, Role } from "@prisma/client";
import appleIphoneContent from "../lib/content/apple-iphone";
import appleIpadContent from "../lib/content/apple-ipad";
import appleMacbookContent from "../lib/content/apple-macbook";
import appleImacContent from "../lib/content/apple-imac";
import appleWatchContent from "../lib/content/apple-watch";
import appleAirpodsContent from "../lib/content/apple-airpods";
import applePeripheralsContent from "../lib/content/apple-peripherals";
import dysonHairStylersContent from "../lib/content/dyson-hair-stylers";
import dysonAirPurifiersContent from "../lib/content/dyson-air-purifiers";
import dysonVacuumsContent from "../lib/content/dyson-vacuums";
import garminSmartWatchesContent from "../lib/content/garmin-smart-watches";
import jblBluetoothSpeakersContent from "../lib/content/jbl-bluetooth-speakers";
import marshallBluetoothSpeakersContent from "../lib/content/marshall-bluetooth-speakers";
import playstationGamingConsolesContent from "../lib/content/playstation-gaming-consoles";
import camerasDigitalCamerasContent from "../lib/content/cameras-digital-cameras";
import camerasGoProContent from "../lib/content/cameras-go-pro";
import smegCoffeeMachinesContent from "../lib/content/smeg-coffee-machines";
import smegKettlesContent from "../lib/content/smeg-kettles";
import smegToastersContent from "../lib/content/smeg-toasters";
import harmanHomeAudioContent from "../lib/content/harman-home-audio";
import whoopFitnessTrackersContent from "../lib/content/whoop-fitness-trackers";
import portablePowerStationsContent from "../lib/content/portable-power-stations";
import { getLearningTopicBlocks, getLearningTopicForCategory, getLearningTopicQuestions } from "../lib/content/learning-category-repairs";

const prisma = new PrismaClient();
const { iphoneCatalogBlocks, iphoneFoundationBlocks } = appleIphoneContent;
const { ipadCatalogBlocks, ipadFoundationBlocks } = appleIpadContent;
const { macbookCatalogBlocks, macbookFoundationBlocks } = appleMacbookContent;
const { imacCatalogBlocks, imacFoundationBlocks } = appleImacContent;
const { appleWatchCatalogBlocks, appleWatchFoundationBlocks } = appleWatchContent;
const { airpodsCatalogBlocks, airpodsFoundationBlocks } = appleAirpodsContent;
const { applePeripheralsCatalogBlocks, applePeripheralsFoundationBlocks } = applePeripheralsContent;
const { dysonHairStylersCatalogBlocks, dysonHairStylersFoundationBlocks } = dysonHairStylersContent;
const { dysonAirPurifiersCatalogBlocks, dysonAirPurifiersFoundationBlocks } = dysonAirPurifiersContent;
const { dysonVacuumsCatalogBlocks, dysonVacuumsFoundationBlocks } = dysonVacuumsContent;
const { garminSmartWatchesCatalogBlocks, garminSmartWatchesFoundationBlocks } = garminSmartWatchesContent;
const { jblCatalogBlocks, jblFoundationBlocks } = jblBluetoothSpeakersContent;
const { marshallSpeakersCatalogBlocks, marshallSpeakersFoundationBlocks } = marshallBluetoothSpeakersContent;
const { gamingConsolesCatalogBlocks, gamingConsolesFoundationBlocks } = playstationGamingConsolesContent;
const { digitalCamerasCatalogBlocks, digitalCamerasFoundationBlocks } = camerasDigitalCamerasContent;
const { goProCatalogBlocks, goProFoundationBlocks } = camerasGoProContent;
const { smegCoffeeMachinesCatalogBlocks, smegCoffeeMachinesFoundationBlocks } = smegCoffeeMachinesContent;
const { smegKettlesCatalogBlocks, smegKettlesFoundationBlocks } = smegKettlesContent;
const { smegToastersCatalogBlocks, smegToastersFoundationBlocks } = smegToastersContent;
const { harmanHomeAudioCatalogBlocks, harmanHomeAudioFoundationBlocks } = harmanHomeAudioContent;
const { whoopFitnessTrackersCatalogBlocks, whoopFitnessTrackersFoundationBlocks } = whoopFitnessTrackersContent;
const { portablePowerStationsCatalogBlocks, portablePowerStationsFoundationBlocks } = portablePowerStationsContent;

const brandsSeed = [
  {
    name: "Apple",
    slug: "apple",
    logoUrl: "/logos/apple.svg",
    description: "Преміальна екосистема пристроїв та сервісів для щоденної роботи і творчості.",
    categories: [
      { name: "iPhone", slug: "iphone", description: "Повний матеріал по iPhone: лінійка, ринки, технології та моделі.", sortOrder: 1 },
      { name: "iPad", slug: "ipad", description: "Планшети для навчання, бізнесу та творчості.", sortOrder: 2 },
      { name: "MacBook", slug: "macbook", description: "Ноутбуки Apple: підбір конфігурацій та сценаріїв.", sortOrder: 3 },
      { name: "iMac", slug: "imac", description: "Моноблоки для офісу та творчих задач.", sortOrder: 4 },
      { name: "Apple Watch", slug: "apple-watch", description: "Смарт-годинники, здоров'я та активність.", sortOrder: 5 },
      { name: "AirPods", slug: "airpods", description: "Навушники та сценарії підключення в екосистемі.", sortOrder: 6 },
      { name: "Периферія", slug: "peripherals", description: "Аксесуари та сумісність із технікою Apple.", sortOrder: 7 }
    ]
  },
  {
    name: "Dyson",
    slug: "dyson",
    logoUrl: "/logos/dyson.svg",
    description: "Інноваційна техніка для догляду за домом та повітрям.",
    categories: [
      { name: "Фени та стайлери", slug: "hair-stylers", description: "Стайлери Dyson: аргументи продажу та демонстрації.", sortOrder: 1 },
      { name: "Пилососи", slug: "vacuums", description: "Вертикальні та ручні моделі, фільтрація, автономність.", sortOrder: 2 },
      { name: "Очищувачі повітря", slug: "air-purifiers", description: "Сценарії використання для дому та офісу.", sortOrder: 3 }
    ]
  },
  {
    name: "Garmin",
    slug: "garmin",
    logoUrl: "/logos/garmin.svg",
    description: "Надійні спортивні та туристичні пристрої.",
    categories: [
      { name: "Смарт-годинники", slug: "smart-watches", description: "Лінійки, метрики тренувань, автономність.", sortOrder: 1 }
    ]
  },
  {
    name: "Marshall",
    slug: "marshall",
    logoUrl: "/logos/marshall.svg",
    description: "Акустика з фірмовим звучанням і дизайном.",
    categories: [
      { name: "Bluetooth-колонки", slug: "bluetooth-speakers", description: "Портативні колонки для дому й подорожей.", sortOrder: 1 }
    ]
  },
  {
    name: "JBL",
    slug: "jbl",
    logoUrl: "/logos/jbl.svg",
    description: "Портативне аудіо для активного способу життя.",
    categories: [
      { name: "Bluetooth-колонки", slug: "bluetooth-speakers", description: "Моделі, захист, автономність, сценарії продажу.", sortOrder: 1 }
    ]
  },
  {
    name: "PlayStation",
    slug: "playstation",
    logoUrl: "/logos/playstation.svg",
    description: "Ігрова екосистема Sony: консолі, сервіси, аксесуари.",
    categories: [
      { name: "Ігрові консолі", slug: "gaming-consoles", description: "PS5, комплектації, підписки та геймінг-сценарії.", sortOrder: 1 },
      { name: "Периферія", slug: "peripherals", description: "Геймпади, гарнітури, зарядні станції.", sortOrder: 2 }
    ]
  },
  {
    name: "Камери",
    slug: "cameras",
    logoUrl: "/logos/cameras.svg",
    description: "Фото- та відеотехніка для ентузіастів і професіоналів.",
    categories: [
      { name: "Цифрові камери", slug: "digital-cameras", description: "Матриці, об'єктиви, стабілізація та аксесуари.", sortOrder: 1 },
      { name: "GoPro", slug: "go-pro", description: "Екшн-камери для подорожей та спорту.", sortOrder: 2 },
      { name: "DJI", slug: "dji", description: "Екосистема DJI: стабілізатори, дрони, камери.", sortOrder: 3 }
    ]
  },
  {
    name: "Smeg",
    slug: "smeg",
    logoUrl: "/logos/smeg.svg",
    description: "Преміальна кухонна техніка з фокусом на дизайн.",
    categories: [
      { name: "Кавомашини", slug: "coffee-machines", description: "Різновиди напоїв, догляд, аргументи продажу.", sortOrder: 1 },
      { name: "Тостери", slug: "toasters", description: "Моделі, режими, догляд та апсейл аксесуарів.", sortOrder: 2 },
      { name: "Чайники", slug: "kettles", description: "Переваги матеріалів і контроль температури.", sortOrder: 3 }
    ]
  },
  {
    name: "Harman",
    slug: "harman",
    logoUrl: "/logos/harman.svg",
    description: "Преміальне аудіо для дому, подорожей і сучасного lifestyle-сегмента.",
    categories: [
      { name: "Портативна акустика", slug: "portable-audio", description: "Компактні аудіорішення, автономність, захист та сценарії продажу.", sortOrder: 1 },
      { name: "Домашня акустика", slug: "home-audio", description: "Колонки для дому, мультирум, дизайн і позиціонування.", sortOrder: 2 },
      { name: "Саундбари", slug: "soundbars", description: "Покращення домашнього кінотеатру, підключення і апсейл.", sortOrder: 3 }
    ]
  },
  {
    name: "Whoop",
    slug: "whoop",
    logoUrl: "/logos/whoop.svg",
    description: "Платформа для відстеження відновлення, навантаження і якості сну.",
    categories: [
      { name: "Фітнес-трекери", slug: "fitness-trackers", description: "Whoop Strap, сенсори, сценарії використання та робота з запереченнями.", sortOrder: 1 },
      { name: "Аналітика та відновлення", slug: "recovery-analytics", description: "Recovery, Strain, Sleep Coach та цінність підписки.", sortOrder: 2 }
    ]
  },
  {
    name: "Портативні станції",
    slug: "portable-power",
    logoUrl: "/logos/portable-power.svg",
    description: "Резервне живлення для дому, подорожей, кемпінгу та професійного використання.",
    categories: [
      { name: "Зарядні станції", slug: "power-stations", description: "Ємність, потужність, сценарії резервного живлення та підбір під техніку.", sortOrder: 1 },
      { name: "Сонячні панелі", slug: "solar-panels", description: "Підзарядка станцій у польових умовах та додаткові сценарії використання.", sortOrder: 2 },
      { name: "Аксесуари живлення", slug: "power-accessories", description: "Кабелі, адаптери, чохли та супутні рішення для апсейлу.", sortOrder: 3 }
    ]
  }
] as const;

function moduleContent(title: string, categoryName: string) {
  return [
    {
      type: "video",
      title: `Відео-огляд: ${categoryName}`,
      provider: "youtube",
      url: "https://www.youtube.com/embed/1La4QzGeaaQ"
    },
    {
      type: "text",
      title: "Що має знати продавець",
      html: `<h3>Ключові тези</h3><ul><li>Визначайте потребу клієнта через 3 уточнювальні питання.</li><li>Пояснюйте вигоди простою мовою.</li><li>Додавайте релевантний аксесуар або сервіс.</li></ul><p>Модуль <strong>${title}</strong> допоможе впевнено презентувати товар.</p>`
    },
    {
      type: "image",
      title: "Візуальні акценти",
      url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      caption: "Приклад викладки товарів у торговому залі"
    },
    {
      type: "facts",
      title: "Важливо знати",
      items: [
        "Починайте консультацію з уточнення сценарію використання.",
        "Порівнюйте не лише характеристики, а й кінцеву цінність для клієнта.",
        "Фіксуйте сумісні аксесуари у чеку для збільшення середнього кошика."
      ]
    },
    {
      type: "pdf",
      title: "Швидкий конспект",
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    }
  ];
}

function moduleQuestions(categoryName: string) {
  return [
    {
      question: `Що є найкращим першим кроком під час консультації у категорії «${categoryName}»?`,
      type: QuestionType.SINGLE,
      options: [
        "Відразу запропонувати найдорожчу модель",
        "Поставити уточнювальні питання про потреби",
        "Показати тільки акційні товари",
        "Уникати порівняння моделей"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "True/False: Апсейл аксесуарів підвищує цінність покупки для клієнта.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 2
    },
    {
      question: "Оберіть валідні техніки презентації продукту:",
      type: QuestionType.MULTIPLE,
      options: [
        "Пояснювати вигоди через сценарії використання",
        "Ігнорувати заперечення клієнта",
        "Порівнювати 2-3 релевантні моделі",
        "Говорити лише про знижку"
      ],
      correctAnswer: { indices: [0, 2] },
      sortOrder: 3
    },
    {
      question: "Яка ціль блоку «Важливо знати» у навчальному модулі?",
      type: QuestionType.SINGLE,
      options: [
        "Дати юридичну консультацію",
        "Закріпити ключові акценти для практики продажів",
        "Замінити весь навчальний контент",
        "Виключно рекламувати бренд"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 4
    },
    {
      question: "Що варто зробити після успішної презентації товару?",
      type: QuestionType.SINGLE,
      options: [
        "Завершити діалог без пропозицій",
        "Запропонувати сумісний аксесуар або сервіс",
        "Скасувати гарантійні опції",
        "Уникати уточнення бюджету"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function iphoneFoundationQuestions() {
  return [
    {
      question: "Що потрібно перевірити, щоб точно визначити підтримувані SIM-картки конкретного iPhone?",
      type: QuestionType.SINGLE,
      options: ["Номер моделі та офіційні характеристики регіональної версії", "Лише колір корпусу", "Лише назву Global у прайсі", "Кількість встановлених програм"],
      correctAnswer: { index: 0 },
      sortOrder: 1
    },
    {
      question: "Що з переліченого не приймаємо і не продаємо ні на викуп, ні в Trade-In?",
      type: QuestionType.MULTIPLE,
      options: ["Пристрої з R-SIM", "Пристрої з MDM", "Офіційно відновлені iPhone", "Вживані iPhone з заміненою АКБ"],
      correctAnswer: { indices: [0, 1] },
      sortOrder: 2
    },
    {
      question: "True/False: ProMotion з частотою до 120 Гц з'явився в Pro-моделях, починаючи з iPhone 13 Pro.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Яке позначення потрібно звірити з довідником Apple, щоб визначити модель і регіональну версію?",
      type: QuestionType.SINGLE,
      options: ["Номер моделі Axxxx", "Колір шпалер", "Першу літеру імені власника", "Кількість встановлених програм"],
      correctAnswer: { index: 0 },
      sortOrder: 4
    },
    {
      question: "Яка сильна сторона iOS у порівнянні з багатьма конкурентами, згідно з матеріалом?",
      type: QuestionType.SINGLE,
      options: [
        "Коротка підтримка оновлень",
        "Довга підтримка навіть старіших моделей",
        "Повна відсутність екосистеми",
        "Залежність лише від сторонніх сервісів"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function iphoneCatalogQuestions() {
  return [
    {
      question: "Яка лінійка iPhone найкраще підходить клієнту, якому потрібні 120 Гц та максимум можливостей камери?",
      type: QuestionType.SINGLE,
      options: ["SE / e", "Mini", "Pro / Pro Max", "Базова лінійка"],
      correctAnswer: { index: 2 },
      sortOrder: 1
    },
    {
      question: "У якій моделі з матеріалу окремо підкреслено відсутність MagSafe?",
      type: QuestionType.SINGLE,
      options: ["iPhone 15", "iPhone 16e", "iPhone 14 Pro", "iPhone 13 mini"],
      correctAnswer: { index: 1 },
      sortOrder: 2
    },
    {
      question: "Оберіть моделі, де в характеристиках вказано титановий корпус або титанові рамки.",
      type: QuestionType.MULTIPLE,
      options: ["iPhone 15 Pro / 15 Pro Max", "iPhone 16 Pro / 16 Pro Max", "iPhone Air", "iPhone XR"],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 3
    },
    {
      question: "True/False: iPhone SE 2 gen і SE 3 gen використовують Touch ID замість Face ID.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 4
    },
    {
      question: "Який варіант найкраще описує серію Pro Max у вашому матеріалі?",
      type: QuestionType.SINGLE,
      options: [
        "Компактні моделі з мінімальним екраном",
        "Максимальна автономність і великий дисплей",
        "Версії лише для дітей",
        "Моделі без фокусу на камеру"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function ipadFoundationQuestions() {
  return [
    {
      question: "Яка лінійка iPad у матеріалі позиціонується як найкраща для професійних задач і максимальної потужності?",
      type: QuestionType.SINGLE,
      options: ["iPad", "iPad Air", "iPad mini", "iPad Pro"],
      correctAnswer: { index: 3 },
      sortOrder: 1
    },
    {
      question: "Які технології з матеріалу напряму пов’язані з роботою дисплея та комфортом користування?",
      type: QuestionType.MULTIPLE,
      options: ["True Tone", "ProMotion", "LiDAR", "Nano-Texture Glass"],
      correctAnswer: { indices: [0, 1, 3] },
      sortOrder: 2
    },
    {
      question: "True/False: iPad Wi‑Fi + Cellular підходить для клієнтів, яким потрібен мобільний інтернет у поїздках.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Що з переліченого не продаємо і не приймаємо у Trade‑In згідно з матеріалом?",
      type: QuestionType.MULTIPLE,
      options: ["Пристрої з MDM", "Пристрої з R-SIM", "Офіційні Cellular-версії", "iPad з Touch ID"],
      correctAnswer: { indices: [0, 1] },
      sortOrder: 4
    },
    {
      question: "Яка сильна сторона iPadOS підкреслюється в модулі?",
      type: QuestionType.SINGLE,
      options: [
        "Вона не підтримує багатозадачність",
        "Вона робить iPad ближчим до сценаріїв ноутбука",
        "Вона працює лише без клавіатур",
        "Вона не підтримує Apple Pencil"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function ipadCatalogQuestions() {
  return [
    {
      question: "Яку лінійку iPad краще пропонувати клієнту, якщо потрібні дизайн, монтаж, топовий дисплей і професійні задачі?",
      type: QuestionType.SINGLE,
      options: ["iPad", "iPad Air", "iPad mini", "iPad Pro"],
      correctAnswer: { index: 3 },
      sortOrder: 1
    },
    {
      question: "Яка лінійка в каталозі підходить для максимально компактного формату та мобільного користування?",
      type: QuestionType.SINGLE,
      options: ["iPad Pro", "iPad mini", "iPad Air", "Базовий iPad"],
      correctAnswer: { index: 1 },
      sortOrder: 2
    },
    {
      question: "Оберіть моделі або лінійки, де в характеристиках явно фігурують чипи M-серії.",
      type: QuestionType.MULTIPLE,
      options: ["iPad Air 5gen", "iPad Air 6gen", "iPad Pro 2021-2024", "iPad 8gen"],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 3
    },
    {
      question: "True/False: У каталозі iPad Pro 2024 згадано Nano-Texture Glass для конфігурацій від 1 ТБ.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 4
    },
    {
      question: "Що є найкращим базовим вибором для старту в екосистемі Apple та щоденних задач, згідно з підказками каталогу?",
      type: QuestionType.SINGLE,
      options: ["iPad", "iPad Pro", "iPad mini", "Лише Cellular-версія"],
      correctAnswer: { index: 0 },
      sortOrder: 5
    }
  ];
}

function macbookFoundationQuestions() {
  return [
    {
      question: "Яка операційна система використовується на MacBook?",
      type: QuestionType.SINGLE,
      options: ["iPadOS", "macOS", "watchOS", "tvOS"],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Який клавіатурний механізм у матеріалі згадується як найбільш схильний до «залипання» через пил?",
      type: QuestionType.SINGLE,
      options: ["Ножиці", "Метелик", "Magic Keyboard", "Мембранний"],
      correctAnswer: { index: 1 },
      sortOrder: 2
    },
    {
      question: "Оберіть технології MacBook, що стосуються дисплея або введення.",
      type: QuestionType.MULTIPLE,
      options: ["True Tone", "ProMotion", "Touch ID", "Nano-Texture Glass"],
      correctAnswer: { indices: [0, 1, 2, 3] },
      sortOrder: 3
    },
    {
      question: "True/False: Пристрої з MDM не продаємо і не приймаємо на Trade‑In.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 4
    },
    {
      question: "Яка серія процесорів Apple стала переходом MacBook від Intel до ARM-архітектури?",
      type: QuestionType.SINGLE,
      options: ["A-серія", "M-серія Apple Silicon", "Intel Core Ultra", "T-серія"],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function macbookCatalogQuestions() {
  return [
    {
      question: "Яка лінійка MacBook найкраще підходить для більшості клієнтів, яким важливі легкість, автономність і щоденна робота?",
      type: QuestionType.SINGLE,
      options: ["MacBook Air", "MacBook Pro 16″", "MacBook Pro 15″ Intel", "MacBook 12″"],
      correctAnswer: { index: 0 },
      sortOrder: 1
    },
    {
      question: "У яких MacBook з матеріалу окремо підкреслюється дискретна графіка як сильна сторона старших Intel-моделей?",
      type: QuestionType.MULTIPLE,
      options: ["MacBook Pro 15″", "MacBook Pro 16″ (2019)", "MacBook Air 13″ M2", "MacBook 12″"],
      correctAnswer: { indices: [0, 1] },
      sortOrder: 2
    },
    {
      question: "True/False: MacBook Pro 14″ / 16″ на Apple Silicon у каталозі мають Liquid Retina XDR і ProMotion.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Яка лінійка в каталозі позиціонується як максимально компактний MacBook для поїздок і базових задач?",
      type: QuestionType.SINGLE,
      options: ["MacBook 12″", "MacBook Air 15″", "MacBook Pro 14″", "MacBook Pro 16″"],
      correctAnswer: { index: 0 },
      sortOrder: 4
    },
    {
      question: "Що потрібно уточнювати під час підбору MacBook згідно з підказками в каталозі?",
      type: QuestionType.MULTIPLE,
      options: ["Сценарій роботи", "Обсяг пам’яті", "Кількість портів", "Лише колір корпуса"],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 5
    }
  ];
}

function imacFoundationQuestions() {
  return [
    {
      question: "Яка головна конструктивна перевага iMac підкреслюється в матеріалі?",
      type: QuestionType.SINGLE,
      options: [
        "Можливість скласти корпус окремо",
        "Моноблок: усі компоненти в одному корпусі",
        "Знімний дисплей",
        "Підтримка SIM-карти"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Яка технологія дисплея допомагає зменшувати відблиски при яскравому освітленні?",
      type: QuestionType.SINGLE,
      options: ["True Tone", "P3", "Nano-Texture Glass", "Fusion Drive"],
      correctAnswer: { index: 2 },
      sortOrder: 2
    },
    {
      question: "True/False: macOS у матеріалі описується як система з тісною інтеграцією з iPhone, iPad та іншими пристроями Apple.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Що з переліченого входить до регіональних відмінностей iMac у матеріалі?",
      type: QuestionType.MULTIPLE,
      options: [
        "Тип вилки та напруга",
        "Клавіатурні розкладки",
        "Регіональні коди в артикулах",
        "Колір логотипа Apple"
      ],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 4
    },
    {
      question: "Що означає MDM у контексті Apple-техніки?",
      type: QuestionType.SINGLE,
      options: [
        "Режим макрозйомки дисплея",
        "Система централізованого керування пристроями",
        "Формат серійного номера",
        "Тип кабелю живлення"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function imacCatalogQuestions() {
  return [
    {
      question: "Яка модель у матеріалі є першим iMac на Apple Silicon?",
      type: QuestionType.SINGLE,
      options: [
        "iMac 27″ Intel (2020)",
        "iMac 24″ M1 (2021)",
        "iMac 24″ M3 (2023)",
        "iMac Pro 27″ Intel (2017)"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Який пристрій із каталогу найкраще підійде клієнту, який уже має свій монітор і хоче компактний настільний Mac?",
      type: QuestionType.SINGLE,
      options: ["iMac 24″", "Mac mini", "Mac Studio", "Mac Pro"],
      correctAnswer: { index: 1 },
      sortOrder: 2
    },
    {
      question: "True/False: Mac Pro у матеріалі позиціонується як флагманський настільний Mac для професійних задач.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Яка модель у матеріалі подається в кольорі Space Gray?",
      type: QuestionType.SINGLE,
      options: [
        "iMac 27″ Intel (2020)",
        "iMac Pro 27″ Intel (2017)",
        "Mac Pro M2 (2023)",
        "Mac mini M1 (2020)"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 4
    },
    {
      question: "Яка лінійка з каталогу підходить для 8K-відео, 3D-рендерингу та ML у компактному професійному корпусі?",
      type: QuestionType.SINGLE,
      options: ["Mac mini", "iMac 21.5″", "Mac Studio", "iMac 24″"],
      correctAnswer: { index: 2 },
      sortOrder: 5
    }
  ];
}

function appleWatchFoundationQuestions() {
  return [
    {
      question: "Яка головна різниця між Apple Watch GPS і GPS + Cellular (LTE) у вашому матеріалі?",
      type: QuestionType.SINGLE,
      options: [
        "GPS-версія підтримує лише Android",
        "LTE-версія може працювати автономніше без iPhone поруч",
        "GPS-версія має сапфірове скло, а LTE — ні",
        "LTE-версія не підтримує дзвінки"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "True/False: Червоне кільце на Digital Crown є ознакою LTE-версії Apple Watch.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 2
    },
    {
      question: "Яка функція вперше з’явилася в Apple Watch Series 5 згідно з модулем?",
      type: QuestionType.SINGLE,
      options: ["ЕКГ", "Always-On Display", "Crash Detection", "Siri через супутник"],
      correctAnswer: { index: 1 },
      sortOrder: 3
    },
    {
      question: "Оберіть коректні тези з розділу про регіональні відмінності Apple Watch.",
      type: QuestionType.MULTIPLE,
      options: [
        "ЕКГ доступна не в усіх країнах",
        "У США є обмеження щодо кисню в крові для частини нових моделей",
        "LTE Apple Watch повноцінно працює в Україні без обмежень",
        "Китайські моделі можуть мати інші локальні обмеження"
      ],
      correctAnswer: { indices: [0, 1, 3] },
      sortOrder: 4
    },
    {
      question: "Який варіант найкраще описує позиціонування Apple Watch Ultra?",
      type: QuestionType.SINGLE,
      options: [
        "Модель тільки для дитячого сегмента",
        "Найдоступніший варіант входу в екосистему",
        "Лінійка для спорту, outdoor і максимальної витривалості",
        "Годинник без health-функцій"
      ],
      correctAnswer: { index: 2 },
      sortOrder: 5
    }
  ];
}

function appleWatchCatalogQuestions() {
  return [
    {
      question: "Яка лінійка Apple Watch найкраще підходить клієнту, якому потрібен доступніший вхід в екосистему Apple Watch?",
      type: QuestionType.SINGLE,
      options: ["Ultra", "SE", "Series 10", "Hermes Edition"],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "У якій моделі з каталогу вперше окремо підкреслюється Always-On Display?",
      type: QuestionType.SINGLE,
      options: ["Series 3", "Series 4", "Series 5", "SE 2020"],
      correctAnswer: { index: 2 },
      sortOrder: 2
    },
    {
      question: "Оберіть моделі Apple Watch Ultra з каталогу.",
      type: QuestionType.MULTIPLE,
      options: [
        "Apple Watch Ultra (2022)",
        "Apple Watch Ultra 2 (2023/2024)",
        "Apple Watch Ultra 3 (2025)",
        "Apple Watch SE 2 (2022)"
      ],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 3
    },
    {
      question: "True/False: Apple Watch Ultra та Ultra 2 у вашому каталозі мають 49 мм титановий корпус.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 4
    },
    {
      question: "Яка модель у каталозі є хорошим сучасним універсальним вибором завдяки S9, Double Tap і яскравішому екрану?",
      type: QuestionType.SINGLE,
      options: ["Series 7", "Series 9", "SE 2020", "Series 4"],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function airpodsFoundationQuestions() {
  return [
    {
      question: "Яка перевага найкраще описує роботу AirPods усередині екосистеми Apple?",
      type: QuestionType.SINGLE,
      options: [
        "Працюють лише з iPhone і не сумісні з Mac",
        "Автоматично перемикаються між пристроями Apple",
        "Працюють тільки через кабель",
        "Не підтримують Siri"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Які функції прямо згадані у базовому модулі AirPods?",
      type: QuestionType.MULTIPLE,
      options: [
        "Спільне аудіо",
        "Просторове аудіо",
        "Автоматичне перемикання між пристроями",
        "Механічна клавіатура"
      ],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 2
    },
    {
      question: "True/False: AirPods Pro та AirPods 4 ANC позиціонуються як моделі для клієнтів, яким важливе шумозаглушення.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Яка лінійка найкраще відповідає повнорозмірному формату з Digital Crown і домашньо-офісному сценарію?",
      type: QuestionType.SINGLE,
      options: ["AirPods 2", "AirPods Pro", "AirPods Max", "EarPods"],
      correctAnswer: { index: 2 },
      sortOrder: 4
    },
    {
      question: "Коли EarPods мають найкраще позиціонування у консультації?",
      type: QuestionType.SINGLE,
      options: [
        "Коли клієнту потрібні лише ANC і просторове аудіо",
        "Коли важливі дротовий формат, стабільність і відсутність потреби заряджати навушники",
        "Коли потрібні силіконові амбушури та H2",
        "Коли клієнт обирає Apple Watch"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function airpodsCatalogQuestions() {
  return [
    {
      question: "Яка модель у каталозі поєднує відкритий формат і Active Noise Cancellation?",
      type: QuestionType.SINGLE,
      options: ["AirPods 2", "AirPods 3", "AirPods 4 ANC", "EarPods USB-C"],
      correctAnswer: { index: 2 },
      sortOrder: 1
    },
    {
      question: "Яка модель має чип H2 у навушниках і чип U1 у зарядному кейсі?",
      type: QuestionType.SINGLE,
      options: ["AirPods 3", "AirPods Pro 2", "AirPods Max із USB-C (2024)", "AirPods Pro 1"],
      correctAnswer: { index: 1 },
      sortOrder: 2
    },
    {
      question: "Оберіть дротові моделі EarPods із каталогу.",
      type: QuestionType.MULTIPLE,
      options: [
        "EarPods з 3,5 мм",
        "EarPods з Lightning",
        "EarPods з USB-C",
        "AirPods Max із USB-C (2024)"
      ],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 3
    },
    {
      question: "True/False: AirPods Max із USB-C (2024) мають роз’єм USB-C для заряджання.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 4
    },
    {
      question: "Яка лінійка найкраще підходить клієнту, якому потрібні силіконові амбушури, ANC та глибша посадка?",
      type: QuestionType.SINGLE,
      options: ["AirPods", "AirPods Pro", "AirPods Max", "EarPods"],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function applePeripheralsFoundationQuestions() {
  return [
    {
      question: "Що найкраще описує роль категорії Apple Периферія у консультації?",
      type: QuestionType.SINGLE,
      options: [
        "Це окрема лінійка смартфонів Apple",
        "Це категорія доповнень до вже наявної техніки Apple: TV, iPad, Mac, iPhone та розумного дому",
        "Це лише розділ з кабелями",
        "Це тільки аксесуари без прив'язки до екосистеми"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Які сімейства прямо входять до модуля по Apple Периферії?",
      type: QuestionType.MULTIPLE,
      options: [
        "Apple TV",
        "HomePod",
        "Apple Pencil",
        "AirTag",
        "Magic Mouse та Magic Trackpad"
      ],
      correctAnswer: { indices: [0, 1, 2, 3, 4] },
      sortOrder: 2
    },
    {
      question: "True/False: Apple Pencil треба підбирати насамперед за сумісністю з конкретною моделлю iPad.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Який продукт із цього модуля найкраще позиціонується як трекер для ключів, сумок і багажу через Find My?",
      type: QuestionType.SINGLE,
      options: ["Apple TV", "AirTag", "HomePod mini", "Magic Mouse"],
      correctAnswer: { index: 1 },
      sortOrder: 4
    },
    {
      question: "Що найсильніше допомагає продавати периферію Apple?",
      type: QuestionType.SINGLE,
      options: [
        "Говорити лише про кількість гігабайтів",
        "Прив'язувати аксесуар до вже наявного сценарію використання клієнта в екосистемі Apple",
        "Уникати згадки про сумісність",
        "Продавати периферію лише разом з iPhone"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function applePeripheralsCatalogQuestions() {
  return [
    {
      question: "Яка модель Apple TV у вашому каталозі має чип A15 Bionic?",
      type: QuestionType.SINGLE,
      options: [
        "Apple TV HD",
        "Apple TV 4K (1-го покоління, 2017)",
        "Apple TV 4K (2-го покоління, 2021)",
        "Apple TV 4K (3-го покоління, 2022)"
      ],
      correctAnswer: { index: 3 },
      sortOrder: 1
    },
    {
      question: "Оберіть моделі Apple Pencil із каталогу.",
      type: QuestionType.MULTIPLE,
      options: [
        "Apple Pencil (1-го покоління)",
        "Apple Pencil (2-го покоління)",
        "Apple Pencil (USB-C)",
        "Apple Pencil Pro",
        "Siri Remote"
      ],
      correctAnswer: { indices: [0, 1, 2, 3] },
      sortOrder: 2
    },
    {
      question: "True/False: HomePod mini у вашому матеріалі базується на Apple S5.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Який пристрій у каталозі найкраще відповідає сценарію Multi-Touch жестів і Force Touch для Mac?",
      type: QuestionType.SINGLE,
      options: ["AirTag", "Magic Trackpad", "Apple TV 4K", "HomePod"],
      correctAnswer: { index: 1 },
      sortOrder: 4
    },
    {
      question: "Яка лінійка в каталозі позиціонується як фірмова миша Apple з Multi-Touch поверхнею?",
      type: QuestionType.SINGLE,
      options: ["Magic Mouse", "Apple Pencil", "HomePod", "AirTag"],
      correctAnswer: { index: 0 },
      sortOrder: 5
    }
  ];
}

function dysonHairStylersFoundationQuestions() {
  return [
    {
      question: "Що в Dyson hair-категорії найкраще продає бренд ще до конкретної моделі?",
      type: QuestionType.SINGLE,
      options: [
        "Тільки велика кількість кольорів",
        "Поєднання мотора, контролю температури, ергономіки та дбайливого ставлення до волосся",
        "Лише мінімальна ціна",
        "Виключно популярність у соцмережах"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Які фактори критично уточнювати при консультації по Dyson, особливо якщо пристрій привезений з іншого ринку?",
      type: QuestionType.MULTIPLE,
      options: [
        "Тип вилки",
        "Напруга мережі",
        "Сервісна придатність у регіоні купівлі",
        "Колір коробки",
        "Комплектація під конкретний ринок"
      ],
      correctAnswer: { indices: [0, 1, 2, 4] },
      sortOrder: 2
    },
    {
      question: "True/False: Complete Long відрізняється від базового Airwrap насамперед довшими циліндричними насадками.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Яка версія Airwrap найкраще підходить клієнту з кучерявим або кудрявим волоссям?",
      type: QuestionType.SINGLE,
      options: [
        "Volumise",
        "Straight to Wavy",
        "Curly to Coily",
        "Corrale"
      ],
      correctAnswer: { index: 2 },
      sortOrder: 4
    },
    {
      question: "Що найкраще рекомендувати клієнту, якому важливі одночасне сушіння й вирівнювання без гарячих пластин?",
      type: QuestionType.SINGLE,
      options: [
        "Dyson Corrale",
        "Dyson Airstrait",
        "Dyson Supersonic HD11",
        "Dyson Airwrap Volumise"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function dysonHairStylersCatalogQuestions() {
  return [
    {
      question: "Яка модель у вашому каталозі Dyson додає Bluetooth і роботу з додатком MyDyson?",
      type: QuestionType.SINGLE,
      options: [
        "Dyson Airwrap Multi-styler / Complete Long",
        "Dyson Airwrap i.d.",
        "Dyson Supersonic HD07",
        "Dyson Corrale"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Оберіть моделі з лінійки Dyson Supersonic у цьому каталозі.",
      type: QuestionType.MULTIPLE,
      options: [
        "HD07",
        "HD11",
        "HD18",
        "Nural",
        "Coanda 2x"
      ],
      correctAnswer: { indices: [0, 1, 2, 3] },
      sortOrder: 2
    },
    {
      question: "True/False: Dyson Corrale може працювати без кабелю приблизно до 30 хвилин.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Яка модель позиціонується як найінтелектуальніший фен Dyson із захистом шкіри голови?",
      type: QuestionType.SINGLE,
      options: [
        "Dyson Supersonic HD07",
        "Dyson Supersonic Nural",
        "Dyson Supersonic HD11",
        "Dyson Supersonic Pro HD18"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 4
    },
    {
      question: "Яка новація найбільше відрізняє Dyson Airwrap Coanda 2x від попередніх версій у вашому матеріалі?",
      type: QuestionType.SINGLE,
      options: [
        "Перехід на провід Lightning",
        "Повна відмова від насадок",
        "Двигун Hyperdymium 2 та 2x сильніший повітряний потік",
        "Робота тільки з мокрим волоссям"
      ],
      correctAnswer: { index: 2 },
      sortOrder: 5
    }
  ];
}

function dysonAirPurifiersFoundationQuestions() {
  return [
    {
      question: "Який запит клієнта найкраще веде до моделі Dyson PH04?",
      type: QuestionType.SINGLE,
      options: [
        "Потрібен тільки локальний обігрівач",
        "Потрібно очищення повітря плюс зволоження в одному пристрої",
        "Потрібен пилосос для килима",
        "Потрібен лише вентилятор без додаткових функцій"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Які технологічні акценти важливі в категорії Dyson Air Care?",
      type: QuestionType.MULTIPLE,
      options: [
        "Air Multiplier",
        "HEPA-фільтрація",
        "Активоване вугілля",
        "UV-стерилізація у відповідних моделях",
        "Фізична клавіатура"
      ],
      correctAnswer: { indices: [0, 1, 2, 3] },
      sortOrder: 2
    },
    {
      question: "True/False: Dyson AM09 продається насамперед як очищувач повітря з HEPA-фільтром.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: false },
      sortOrder: 3
    },
    {
      question: "Яка модель найкраще підходить, якщо клієнту потрібне потужне очищення великого приміщення і тиха робота?",
      type: QuestionType.SINGLE,
      options: [
        "Dyson AM09 Hot and Cool",
        "Dyson Purifier Big+Quiet BP03",
        "Dyson Purifier Humidify+Cool PH04",
        "Dyson Corrale"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 4
    },
    {
      question: "Що варто з'ясувати на старті консультації в Dyson Air Care?",
      type: QuestionType.SINGLE,
      options: [
        "Який колір коробки подобається клієнту",
        "Яку проблему клієнт хоче вирішити: пил, сухість повітря, спеку, холод чи універсальний сценарій",
        "Чи любить клієнт дротові навушники",
        "Який у клієнта улюблений бренд телефону"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function dysonAirPurifiersCatalogQuestions() {
  return [
    {
      question: "Яка модель у каталозі Dyson поєднує очищення, зволоження та охолодження?",
      type: QuestionType.SINGLE,
      options: [
        "Dyson Purifier Big+Quiet BP03",
        "Dyson Purifier Humidify+Cool PH04",
        "Dyson AM09 Hot and Cool",
        "Dyson Supersonic Nural"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Оберіть моделі, що входять до каталогу Dyson Air Care у вашому матеріалі.",
      type: QuestionType.MULTIPLE,
      options: [
        "Dyson Purifier Big+Quiet Formaldehyde BP03",
        "Dyson Purifier Humidify+Cool Formaldehyde PH04",
        "Dyson Purifier Hot+Cool Formaldehyde HP09",
        "Dyson AM09 Hot and Cool",
        "Dyson Airwrap i.d."
      ],
      correctAnswer: { indices: [0, 1, 2, 3] },
      sortOrder: 2
    },
    {
      question: "True/False: HP09 позиціонується як цілорічне рішення з очищенням, обігрівом та охолодженням.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Яка модель у каталозі найкраще відповідає сценарію преміального Hot+Cool без акценту на HEPA-очищення як головну цінність?",
      type: QuestionType.SINGLE,
      options: [
        "Dyson AM09 Hot and Cool",
        "Dyson Purifier Humidify+Cool PH04",
        "Dyson Purifier Big+Quiet BP03",
        "Dyson Purifier Hot+Cool HP09"
      ],
      correctAnswer: { index: 0 },
      sortOrder: 4
    },
    {
      question: "Що є найсильнішим позиціонуванням BP03 у вашому каталозі?",
      type: QuestionType.SINGLE,
      options: [
        "Пристрій для укладки волосся",
        "Очищення повітря для великих приміщень із тихою роботою",
        "Компактний трекер для пошуку ключів",
        "Бездротовий випрямляч"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function dysonVacuumsFoundationQuestions() {
  return [
    {
      question: "Що найкраще продає Dyson у категорії cordless-пилососів?",
      type: QuestionType.SINGLE,
      options: [
        "Тільки яскравий колір корпусу",
        "Поєднання потужності всмоктування, ергономіки, насадок і бездротового сценарію",
        "Лише найнижча ціна в категорії",
        "Виключно маленький контейнер"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Які комплектації або позиціонування важливо пояснювати клієнту в Dyson-пилососах?",
      type: QuestionType.MULTIPLE,
      options: [
        "Standard",
        "Absolute",
        "Animal",
        "Pro",
        "Satellite"
      ],
      correctAnswer: { indices: [0, 1, 2, 3] },
      sortOrder: 2
    },
    {
      question: "True/False: WashG1 варто продавати насамперед як рішення для твердих підлог, а не як головний варіант для килимів.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Яка модель найкраще відповідає сценарію прибирання шерсті тварин уже на рівні назви комплектації?",
      type: QuestionType.SINGLE,
      options: [
        "Dyson V11 Animal",
        "Dyson V8 Standard",
        "Dyson WashG1",
        "Dyson 360 Heurist"
      ],
      correctAnswer: { index: 0 },
      sortOrder: 4
    },
    {
      question: "Що потрібно з'ясувати перед рекомендацією моделі Dyson-пилососа?",
      type: QuestionType.SINGLE,
      options: [
        "Лише улюблений колір клієнта",
        "Тип покриттів, наявність тварин, потребу у вологому прибиранні, площу та бажаний формат",
        "Тільки бренд смартфона клієнта",
        "Тільки розмір коробки"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function dysonVacuumsCatalogQuestions() {
  return [
    {
      question: "Яка модель у вашому каталозі Dyson додає сценарій вологого прибирання завдяки насадці Submarine?",
      type: QuestionType.SINGLE,
      options: [
        "Dyson V15 Detect",
        "Dyson V15s Detect Submarine",
        "Dyson V11",
        "Dyson Gen5detect"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Оберіть моделі, що входять до лінійки Dyson Gen5detect у вашому каталозі.",
      type: QuestionType.MULTIPLE,
      options: [
        "Gen5detect Absolute Pro",
        "Gen5detect Absolute",
        "Gen5detect",
        "V15 Detect Absolute",
        "WashG1"
      ],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 2
    },
    {
      question: "True/False: Dyson Gen5detect Absolute Pro у вашому матеріалі має гнучку щілинну насадку та адаптер для зарядки в автомобілі.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Яка модель найкраще відповідає сценарію роботизованого прибирання з камерою 360° та картографією?",
      type: QuestionType.SINGLE,
      options: [
        "Dyson WashG1",
        "Dyson V10 Absolute",
        "Dyson 360 Heurist",
        "Dyson V8 Absolute"
      ],
      correctAnswer: { index: 2 },
      sortOrder: 4
    },
    {
      question: "Що є найсильнішим позиціонуванням Dyson V15 Detect Absolute у вашому каталозі?",
      type: QuestionType.SINGLE,
      options: [
        "Базовий бюджетний Dyson без лазера",
        "Один із найсильніших Dyson із лазерним підсвічуванням і ширшою комплектацією",
        "Лише миючий пристрій для плитки",
        "Робот-пилосос для автономного прибирання"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function garminSmartWatchesFoundationQuestions() {
  return [
    {
      question: "Яка серія Garmin найкраще підходить клієнту, для якого головний сценарій — біг і триатлон?",
      type: QuestionType.SINGLE,
      options: ["Fenix", "Forerunner", "Approach", "Descent"],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Оберіть спеціалізовані серії Garmin, які прив'язані до конкретного виду активності або професії.",
      type: QuestionType.MULTIPLE,
      options: ["Approach", "Descent", "MARQ", "Forerunner", "Instinct"],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 2
    },
    {
      question: "True/False: Instinct продається через rugged-захист, outdoor-сценарії та tactical-версії, а не як lifestyle-лінійка з акцентом на AMOLED.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Яка лінійка Garmin найкраще відповідає сценарію щоденного використання, здоров'я та стильного AMOLED-досвіду без жорсткого outdoor-акценту?",
      type: QuestionType.SINGLE,
      options: ["Enduro", "Vivoactive / Venu", "Tactix", "Descent"],
      correctAnswer: { index: 1 },
      sortOrder: 4
    },
    {
      question: "З чого найкраще починати консультацію по Garmin?",
      type: QuestionType.SINGLE,
      options: [
        "З демонстрації найдорожчої моделі",
        "З уточнення головного сценарію: біг, outdoor, здоров'я, гольф, дайвінг або tactical",
        "З порівняння тільки кольорів корпусу",
        "З вибору ремінця до годинника"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function garminSmartWatchesCatalogQuestions() {
  return [
    {
      question: "Яка серія Garmin створена саме для гольфу?",
      type: QuestionType.SINGLE,
      options: ["Approach", "Instinct", "Enduro", "Epix"],
      correctAnswer: { index: 0 },
      sortOrder: 1
    },
    {
      question: "Оберіть серії Garmin, які найчастіше рекомендують для outdoor, експедицій і жорстких умов.",
      type: QuestionType.MULTIPLE,
      options: ["Fenix", "Enduro", "Instinct", "Tactix", "Venu"],
      correctAnswer: { indices: [0, 1, 2, 3] },
      sortOrder: 2
    },
    {
      question: "True/False: Epix — це преміальна AMOLED-альтернатива Fenix для клієнта, якому важливий більш яскравий дисплей.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Яка серія Garmin є найбільш спеціалізованою під дайвінг?",
      type: QuestionType.SINGLE,
      options: ["Forerunner", "Approach", "Descent", "MARQ Driver"],
      correctAnswer: { index: 2 },
      sortOrder: 4
    },
    {
      question: "Яка серія Garmin найкраще відповідає запиту на люксовий дизайн, преміальні матеріали та вузьку спеціалізацію під стиль життя або професію?",
      type: QuestionType.SINGLE,
      options: ["MARQ", "Instinct", "Forerunner 55", "Approach S12"],
      correctAnswer: { index: 0 },
      sortOrder: 5
    }
  ];
}

function marshallSpeakersFoundationQuestions() {
  return [
    {
      question: "Яка серія Marshall найкраще підходить для великої кімнати або домашніх вечірок, коли клієнту потрібна максимальна потужність?",
      type: QuestionType.SINGLE,
      options: ["Woburn", "Acton", "Willen", "Emberton"],
      correctAnswer: { index: 0 },
      sortOrder: 1
    },
    {
      question: "Оберіть портативні моделі Marshall із вашого матеріалу.",
      type: QuestionType.MULTIPLE,
      options: ["Tufton", "Kilburn II", "Middleton", "Stockwell II", "Woburn II"],
      correctAnswer: { indices: [0, 1, 2, 3] },
      sortOrder: 2
    },
    {
      question: "True/False: Acton у вашому матеріалі позиціонується як компактна домашня колонка, а не як портативний варіант з акумулятором.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Що найкраще запитати в клієнта на старті консультації по Marshall?",
      type: QuestionType.SINGLE,
      options: [
        "Який колір логотипа подобається більше",
        "Для дому чи для вулиці потрібна колонка, і який розмір простору або сценарій використання",
        "Чи потрібен лише найдорожчий варіант",
        "Який смартфон у клієнта, без уточнення інших потреб"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 4
    },
    {
      question: "Яка модель Marshall у вашому матеріалі описана як найуніверсальніша домашня колонка для вітальні?",
      type: QuestionType.SINGLE,
      options: ["Stanmore", "Willen", "Emberton II", "Stockwell II"],
      correctAnswer: { index: 0 },
      sortOrder: 5
    }
  ];
}

function marshallSpeakersCatalogQuestions() {
  return [
    {
      question: "Яка модель Marshall у вашому каталозі має HDMI серед основних підключень?",
      type: QuestionType.SINGLE,
      options: ["Woburn III", "Stanmore II", "Acton II", "Kilburn II"],
      correctAnswer: { index: 0 },
      sortOrder: 1
    },
    {
      question: "Оберіть моделі Marshall, для яких у матеріалі прямо зазначений захист IP67.",
      type: QuestionType.MULTIPLE,
      options: ["Middleton", "Willen", "Tufton", "Stockwell II", "Woburn II"],
      correctAnswer: { indices: [0, 1] },
      sortOrder: 2
    },
    {
      question: "True/False: Tufton у вашому матеріалі продається як найбільший і найпотужніший portable Marshall із 20+ год автономності.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Яка модель Marshall є найменшою та найлегшою у вашому каталозі?",
      type: QuestionType.SINGLE,
      options: ["Willen", "Emberton", "Stockwell II", "Middleton"],
      correctAnswer: { index: 0 },
      sortOrder: 4
    },
    {
      question: "Що найкраще описує позиціонування Middleton у вашому матеріалі?",
      type: QuestionType.SINGLE,
      options: [
        "Базова домашня колонка для маленької кімнати",
        "Сучасний premium portable Marshall із True Stereophonic та IP67",
        "Стара стаціонарна модель лише з RCA",
        "Ультрапортативна модель вагою 0,31 кг"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function jblFoundationQuestions() {
  return [
    {
      question: "Що найкраще уточнити на старті консультації по JBL, перш ніж переходити до конкретної моделі?",
      type: QuestionType.SINGLE,
      options: [
        "Лише улюблений колір колонки",
        "Сценарій: компактний portable, універсальна колонка, party-формат, домашнє аудіо чи саундбар під ТВ",
        "Тільки максимальну гучність без інших уточнень",
        "Чи потрібна модель з найдорожчої лінійки"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Яка лінійка JBL у вашому матеріалі позиціонується як преміальне домашнє аудіо з ретро-дизайном?",
      type: QuestionType.SINGLE,
      options: ["PartyBox", "Pulse", "Authentics", "Go"],
      correctAnswer: { index: 2 },
      sortOrder: 2
    },
    {
      question: "Оберіть компактні JBL-напрямки з модуля, які відповідають за максимум мобільності.",
      type: QuestionType.MULTIPLE,
      options: ["Go", "Clip", "Wind", "Bar", "Authentics"],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 3
    },
    {
      question: "True/False: PartyBoost у JBL важливо продавати як аргумент для об'єднання сумісних колонок у гучнішу систему або стереопару.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 4
    },
    {
      question: "Яка JBL-лінійка у вашому матеріалі відповідає за сценарій телевізора, фільмів та домашнього кінотеатру?",
      type: QuestionType.SINGLE,
      options: ["Charge", "Pulse", "JBL Bar", "Xtreme"],
      correctAnswer: { index: 2 },
      sortOrder: 5
    }
  ];
}

function jblCatalogQuestions() {
  return [
    {
      question: "Яка модель JBL у вашому каталозі має потужність 1170 Вт, 10-дюймовий сабвуфер і знімні бездротові колонки?",
      type: QuestionType.SINGLE,
      options: ["JBL Bar 500", "JBL PartyBox 710", "JBL Bar 1300", "JBL Boombox 3"],
      correctAnswer: { index: 2 },
      sortOrder: 1
    },
    {
      question: "Оберіть JBL-моделі, де у вашому матеріалі прямо присутній powerbank-сценарій або USB для заряджання інших пристроїв.",
      type: QuestionType.MULTIPLE,
      options: ["Charge 5", "Xtreme 3", "Boombox 2", "Pulse 5", "Go 4"],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 2
    },
    {
      question: "True/False: JBL Pulse 5 у вашому каталозі поєднує світлове шоу 360° і захист IP67.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Яка модель JBL найкраще відповідає сценарію велосипеда, самоката або мотоцикла?",
      type: QuestionType.SINGLE,
      options: ["JBL Clip 4", "JBL Wind 3S", "JBL Go 3", "JBL PartyBox Club 120"],
      correctAnswer: { index: 1 },
      sortOrder: 4
    },
    {
      question: "Яке сімейство JBL у вашому матеріалі треба продавати через мікрофонні входи, гітару, підсвітку та вечірковий сценарій?",
      type: QuestionType.SINGLE,
      options: ["Authentics", "JBL Bar", "PartyBox", "Flip"],
      correctAnswer: { index: 2 },
      sortOrder: 5
    }
  ];
}

function gamingConsolesFoundationQuestions() {
  return [
    {
      question: "Що найкраще з'ясувати на старті консультації по ігрових консолях?",
      type: QuestionType.SINGLE,
      options: [
        "Лише улюблений колір консолі",
        "Сценарій гри: дім, дорога, ексклюзиви, підписки, диск чи digital",
        "Тільки розмір коробки",
        "Чи потрібна тільки найдорожча модель"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Яка платформа у вашому матеріалі позиціонується як гібридна консоль для дому й подорожей?",
      type: QuestionType.SINGLE,
      options: ["PlayStation 5 Pro", "Xbox Series X", "Nintendo Switch", "PlayStation VR2"],
      correctAnswer: { index: 2 },
      sortOrder: 2
    },
    {
      question: "Оберіть рішення, які підходять для portable PC-геймінгу.",
      type: QuestionType.MULTIPLE,
      options: ["Steam Deck", "Asus ROG Ally / Ally X", "Nintendo Switch Lite", "PlayStation VR2"],
      correctAnswer: { indices: [0, 1] },
      sortOrder: 3
    },
    {
      question: "True/False: PlayStation VR2 потребує PlayStation 5 і працює через кабельне USB-C підключення.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 4
    },
    {
      question: "Яка екосистема у вашому матеріалі найсильніше продається через ексклюзиви Sony та DualSense?",
      type: QuestionType.SINGLE,
      options: ["Steam Deck", "Nintendo Switch", "PlayStation 5", "Xbox Series S"],
      correctAnswer: { index: 2 },
      sortOrder: 5
    }
  ];
}

function gamingConsolesCatalogQuestions() {
  return [
    {
      question: "Яка модель у вашому каталозі має 2 ТБ SSD, PSSR і найсильнішу графіку в лінійці PlayStation?",
      type: QuestionType.SINGLE,
      options: ["PS5 Slim", "PS5 Pro", "Xbox Series X", "Steam Deck OLED"],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Яка Xbox-консоль у вашому матеріалі має дисковод і флагманський 4K-сценарій?",
      type: QuestionType.SINGLE,
      options: ["Xbox Series S", "Xbox Series X", "Nintendo Switch OLED", "PS5 Digital Edition"],
      correctAnswer: { index: 1 },
      sortOrder: 2
    },
    {
      question: "Яка портативна платформа у вашому каталозі працює на Windows 11 Home і підтримує Game Pass, Steam та Epic Games?",
      type: QuestionType.SINGLE,
      options: ["Steam Deck", "Nintendo Switch", "Asus ROG Ally / Ally X", "PlayStation VR2"],
      correctAnswer: { index: 2 },
      sortOrder: 3
    },
    {
      question: "Оберіть portable або hybrid-рішення з вашого каталогу.",
      type: QuestionType.MULTIPLE,
      options: ["Steam Deck", "Nintendo Switch family", "Asus ROG Ally / Ally X", "PlayStation 5 Slim", "Xbox Series X"],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 4
    },
    {
      question: "Яка платформа найкраще відповідає запиту на Mario, Zelda, Animal Crossing і сімейний мультиплеєр?",
      type: QuestionType.SINGLE,
      options: ["Xbox Series S", "Nintendo Switch family", "Steam Deck", "PS5 Pro"],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function digitalCamerasFoundationQuestions() {
  return [
    {
      question: "Коли Instax зазвичай є кращою рекомендацією, ніж Canon DSLR?",
      type: QuestionType.SINGLE,
      options: [
        "Коли клієнту потрібні комерційні зйомки з повним ручним контролем",
        "Коли потрібні емоції тут і зараз, подарунок, подія або подорож",
        "Коли головна вимога - швидкий автофокус на спорті",
        "Коли потрібна змінна оптика і full frame"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Які формати Instax згадуються у матеріалі?",
      type: QuestionType.MULTIPLE,
      options: ["Mini", "Square", "Wide", "Panorama"],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 2
    },
    {
      question: "Що найкраще описує різницю між Instax і Canon 5D?",
      type: QuestionType.SINGLE,
      options: [
        "Instax - це цифровий full frame, Canon - моментальний друк",
        "Instax - простий моментальний друк, Canon - професійніший контроль і змінна оптика",
        "Обидва продукти розраховані лише на дитячу аудиторію",
        "Canon 5D друкує фото відразу після натискання"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 3
    },
    {
      question: "True/False: Картриджі Instax є витратним матеріалом, тому їх логічно пропонувати разом із камерою.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 4
    },
    {
      question: "Що важливо уточнити перед продажем Canon DSLR?",
      type: QuestionType.SINGLE,
      options: [
        "Тільки колір корпусу",
        "Чи потрібні оптика, карта пам'яті, додатковий акумулятор і сценарій зйомки",
        "Лише наявність Bluetooth-динаміка",
        "Чи хоче клієнт друкувати фото миттєво"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function digitalCamerasCatalogQuestions() {
  return [
    {
      question: "Яка Instax-модель у вашому каталозі використовує найбільший формат плівки?",
      type: QuestionType.SINGLE,
      options: ["Instax Mini 12", "Instax SQ1", "Instax Wide 300", "Instax Mini 40"],
      correctAnswer: { index: 2 },
      sortOrder: 1
    },
    {
      question: "Яка модель поєднує цифрову камеру, прев'ю на екрані та друк зі смартфона з 100 творчими комбінаціями ефектів?",
      type: QuestionType.SINGLE,
      options: ["Instax Mini Evo", "Instax Mini 90", "Canon EOS 5D Mark II", "Instax SQ1"],
      correctAnswer: { index: 0 },
      sortOrder: 2
    },
    {
      question: "Яка Canon-модель у вашому матеріалі має 61 точку автофокусу та два слоти карт пам'яті?",
      type: QuestionType.SINGLE,
      options: ["Canon EOS 5D Mark II", "Canon EOS 5D Mark III", "Instax Mini LiPlay", "Instax Wide 300"],
      correctAnswer: { index: 1 },
      sortOrder: 3
    },
    {
      question: "Оберіть моделі з акумуляторним сценарієм живлення, а не з одноразовими AA/CR2.",
      type: QuestionType.MULTIPLE,
      options: ["Instax Mini 90", "Instax Mini Evo", "Instax Mini LiPlay", "Instax Mini 12", "Instax SQ1"],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 4
    },
    {
      question: "Яка модель найкраще підходить як доступніший вхід у повний кадр Canon?",
      type: QuestionType.SINGLE,
      options: ["Canon EOS 5D Mark II", "Canon EOS 5D Mark III", "Instax Mini 40", "Instax Wide 300"],
      correctAnswer: { index: 0 },
      sortOrder: 5
    }
  ];
}

function goProFoundationQuestions() {
  return [
    {
      question: "У якому сценарії GoPro зазвичай буде кращою рекомендацією, ніж DJI Pocket?",
      type: QuestionType.SINGLE,
      options: [
        "Коли потрібен кишеньковий стедікам для спокійних проходок",
        "Коли камера буде кріпитись на шолом, кермо чи груди й працювати у спорті та воді",
        "Коли клієнту потрібен лише квадратний друк фото",
        "Коли головна вимога - змінна оптика"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Що найкраще уточнити перед рекомендацією GoPro?",
      type: QuestionType.MULTIPLE,
      options: [
        "Сценарій зйомки: спорт, вода, тревел, влог",
        "Чи потрібні LOG, 8:7 або creator-комплект",
        "Якого кольору має бути кришка коробки",
        "Чи потрібне 360° або MAX-сценарій"
      ],
      correctAnswer: { indices: [0, 1, 3] },
      sortOrder: 2
    },
    {
      question: "Який аксесуар з вашого матеріалу найсильніше продається під довгі записи й creator-сценарій?",
      type: QuestionType.SINGLE,
      options: ["Volta", "Паперовий альбом", "Штатив для DSLR", "Спалах Speedlite"],
      correctAnswer: { index: 0 },
      sortOrder: 3
    },
    {
      question: "True/False: GoPro MAX варто рекомендувати, якщо клієнту потрібне 360° і свобода перекадровки.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 4
    },
    {
      question: "Яка логіка правильна для консультації по GoPro?",
      type: QuestionType.SINGLE,
      options: [
        "Спершу тільки ціна, усе інше неважливо",
        "Спершу сценарій зйомки, потім формат контенту, аксесуари й потрібний рівень моделі",
        "Рекомендувати лише найновішу камеру без уточнень",
        "Усім клієнтам однаково підходить GoPro MAX"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function goProCatalogQuestions() {
  return [
    {
      question: "Яка модель у вашому матеріалі має 10-бітний LOG, Enduro 1900 мА·год і кращий запас по теплу?",
      type: QuestionType.SINGLE,
      options: ["GoPro HERO 11 Black", "GoPro HERO 12 Black", "GoPro HERO 13 Black", "GoPro MAX"],
      correctAnswer: { index: 2 },
      sortOrder: 1
    },
    {
      question: "Яка модель поєднує GoPro, 360°-камеру і влог-сценарій в одному корпусі?",
      type: QuestionType.SINGLE,
      options: ["GoPro HERO 10 Black", "GoPro HERO 11 Mini", "GoPro MAX", "GoPro HERO 12 Creator Edition"],
      correctAnswer: { index: 2 },
      sortOrder: 2
    },
    {
      question: "Оберіть комплекти Creator Edition з вашого каталогу.",
      type: QuestionType.MULTIPLE,
      options: [
        "GoPro HERO 12 Black Creator Edition",
        "GoPro HERO 11 Black Creator Edition",
        "GoPro HERO 11 Mini",
        "GoPro HERO 9 Black"
      ],
      correctAnswer: { indices: [0, 1] },
      sortOrder: 3
    },
    {
      question: "Яка модель у вашому матеріалі позиціонується як найкращий варіант для максимально компактного кріплення?",
      type: QuestionType.SINGLE,
      options: ["GoPro HERO 13 Black", "GoPro HERO 11 Mini", "GoPro MAX", "GoPro HERO 9 Black"],
      correctAnswer: { index: 1 },
      sortOrder: 4
    },
    {
      question: "Яка GoPro-модель принесла фронтальний екран і модульний підхід як доступніший вхід у систему?",
      type: QuestionType.SINGLE,
      options: ["GoPro HERO 9 Black", "GoPro HERO 10 Black", "GoPro HERO 12 Black", "GoPro HERO 13 Black"],
      correctAnswer: { index: 0 },
      sortOrder: 5
    }
  ];
}

function smegCoffeeMachinesFoundationQuestions() {
  return [
    {
      question: "Яке питання найкраще допомагає на старті консультації по кавоварках Smeg?",
      type: QuestionType.SINGLE,
      options: [
        "Який у клієнта улюблений колір коробки",
        "Яку каву він п'є найчастіше і чи потрібен еспресо-сценарій або кілька чашок одразу",
        "Чи хоче клієнт тільки найдорожчу модель",
        "Чи планує він купувати телевізор"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Що правильніше описує різницю між ECF02 і DCF02?",
      type: QuestionType.SINGLE,
      options: [
        "ECF02 - крапельна, DCF02 - рожкова",
        "ECF02 - для еспресо і молочних напоїв, DCF02 - для кількох чашок фільтр-кави",
        "Обидві моделі працюють лише як чайники",
        "DCF02 не підтримує сценарій кількох чашок"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 2
    },
    {
      question: "Оберіть важливі речі, які треба уточнити перед рекомендацією.",
      type: QuestionType.MULTIPLE,
      options: [
        "Який тип кави п'є клієнт",
        "Скільки людей будуть користуватись кавоваркою",
        "Чи важливий колір та інтер'єр",
        "Який у клієнта пароль від Wi-Fi"
      ],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 3
    },
    {
      question: "True/False: У Smeg колір і зовнішній вигляд часто є повноцінним аргументом продажу, а не другорядною деталлю.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 4
    },
    {
      question: "Що варто робити перед обіцянкою конкретних термінів поставки під замовлення?",
      type: QuestionType.SINGLE,
      options: [
        "Пообіцяти будь-який термін одразу",
        "Звірити актуальну наявність у постачальника",
        "Орієнтуватись лише на стару пам'ять",
        "Не відповідати клієнту взагалі"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function smegCoffeeMachinesCatalogQuestions() {
  return [
    {
      question: "Яка модель у вашому каталозі є рожковою кавоваркою з тиском 15 бар?",
      type: QuestionType.SINGLE,
      options: ["Smeg DCF02", "Smeg ECF02", "Smeg KLF03", "Smeg TSF01"],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Яка модель підходить для приготування до 10 чашок кави завдяки резервуару 1.4 л?",
      type: QuestionType.SINGLE,
      options: ["Smeg ECF02", "Smeg DCF02", "GoPro HERO 13", "Canon EOS 5D Mark III"],
      correctAnswer: { index: 1 },
      sortOrder: 2
    },
    {
      question: "Оберіть сильні сторони Smeg DCF02.",
      type: QuestionType.MULTIPLE,
      options: [
        "Таймер запуску",
        "Підтримка тепла",
        "Дві порції еспресо одночасно",
        "Кілька чашок кави за один цикл"
      ],
      correctAnswer: { indices: [0, 1, 3] },
      sortOrder: 3
    },
    {
      question: "Яка модель більше підійде клієнту, який хоче домашній еспресо-куточок і молочні напої?",
      type: QuestionType.SINGLE,
      options: ["Smeg DCF02", "Smeg ECF02", "Будь-яка крапельна модель", "Жодна з моделей"],
      correctAnswer: { index: 1 },
      sortOrder: 4
    },
    {
      question: "Що з наведеного є коректним апсейлом для категорії Smeg-кавоварок?",
      type: QuestionType.SINGLE,
      options: [
        "Засоби для догляду й декальцинації",
        "Модуль HyperSmooth",
        "VR-гарнітура",
        "Стілус для планшета"
      ],
      correctAnswer: { index: 0 },
      sortOrder: 5
    }
  ];
}

function smegKettlesFoundationQuestions() {
  return [
    {
      question: "Яке питання найважливіше на старті консультації по чайниках Smeg?",
      type: QuestionType.SINGLE,
      options: [
        "Чи подобається клієнту сама коробка",
        "Чи потрібне просто кип'ятіння води або температурні режими з підтримкою тепла",
        "Який у клієнта пароль від телефону",
        "Чи хоче клієнт одразу пилосос"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Що з наведеного важливо уточнити перед рекомендацією?",
      type: QuestionType.MULTIPLE,
      options: [
        "Чи потрібні температурні режими",
        "Чи важливий колір під інтер'єр",
        "Чи готують напої, де важлива не кипляча вода",
        "Який серіал зараз дивиться клієнт"
      ],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 2
    },
    {
      question: "Яка модель у лінійці відповідає за сценарій з терморегуляцією?",
      type: QuestionType.SINGLE,
      options: ["KLF03", "KLF04", "DCF02", "ECF02"],
      correctAnswer: { index: 1 },
      sortOrder: 3
    },
    {
      question: "True/False: У Smeg колір чайника часто є повноцінним аргументом продажу.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 4
    },
    {
      question: "Яка логіка консультації по Smeg-чайниках є правильною?",
      type: QuestionType.SINGLE,
      options: [
        "Рекомендувати лише дорожчу модель без уточнень",
        "Визначити сценарій використання, потім підібрати модель і тільки після цього колір",
        "Починати й завершувати консультацію лише кольором",
        "Не пояснювати різницю між KLF03 і KLF04"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function smegKettlesCatalogQuestions() {
  return [
    {
      question: "Яка модель у вашому каталозі має температурні режими 50-100°C?",
      type: QuestionType.SINGLE,
      options: ["KLF03", "KLF04", "DCF02", "ECF02"],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Яка модель позиціонується як класичний чайник без терморегуляції?",
      type: QuestionType.SINGLE,
      options: ["KLF04", "KLF03", "GoPro MAX", "Smeg DCF02"],
      correctAnswer: { index: 1 },
      sortOrder: 2
    },
    {
      question: "Оберіть сильні сторони KLF03.",
      type: QuestionType.MULTIPLE,
      options: [
        "Потужність 2400 Вт",
        "Захист від сухого ходу",
        "Температурні режими 50-100°C",
        "База 360°"
      ],
      correctAnswer: { indices: [0, 1, 3] },
      sortOrder: 3
    },
    {
      question: "Яка модель більше підійде клієнту, який хоче підтримання тепла після нагріву?",
      type: QuestionType.SINGLE,
      options: ["KLF03", "KLF04", "Обидві однаково", "Жодна"],
      correctAnswer: { index: 1 },
      sortOrder: 4
    },
    {
      question: "Що з наведеного є логічним апсейлом для Smeg-чайників?",
      type: QuestionType.SINGLE,
      options: [
        "Інша техніка Smeg у тому ж кольорі або стилі",
        "Media Mod",
        "Карта microSD",
        "VR-контролер"
      ],
      correctAnswer: { index: 0 },
      sortOrder: 5
    }
  ];
}

function smegToastersFoundationQuestions() {
  return [
    {
      question: "Яке питання найкраще допомагає на старті консультації по тостерах Smeg?",
      type: QuestionType.SINGLE,
      options: [
        "Який серіал зараз дивиться клієнт",
        "Скільки тостів клієнт готує за один раз і чи потрібен більший формат",
        "Чи хоче клієнт одразу пральну машину",
        "Який у клієнта улюблений пароль"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Що з наведеного важливо уточнити перед рекомендацією тостера?",
      type: QuestionType.MULTIPLE,
      options: [
        "Кількість скибок за один раз",
        "Чи важливий колір під інтер'єр",
        "Чи потрібні режими розморожування та підігріву",
        "Який у клієнта мобільний оператор"
      ],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 2
    },
    {
      question: "True/False: Для тостерів Smeg дизайн і колір часто є повноцінним аргументом продажу.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Що спільного для обох моделей у вашому матеріалі?",
      type: QuestionType.SINGLE,
      options: [
        "6 рівнів підсмажування та режими підігріву/розморожування/bagel",
        "Температурні режими 50-100°C",
        "Паровий режим",
        "Вбудований кавомолочний блок"
      ],
      correctAnswer: { index: 0 },
      sortOrder: 4
    },
    {
      question: "Яка логіка консультації по Smeg-тостерах є правильною?",
      type: QuestionType.SINGLE,
      options: [
        "Рекомендувати будь-яку модель без уточнень",
        "Спершу зрозуміти сценарій, потім формат тостера, після цього вже колір",
        "Починати і завершувати лише кольором",
        "Не згадувати про режими і догляд"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function smegToastersCatalogQuestions() {
  return [
    {
      question: "Яка модель у вашому каталозі позиціонується як варіант на 4 скибки / 2 довгі щілини?",
      type: QuestionType.SINGLE,
      options: ["TSF03", "TSF02", "KLF04", "ECF02"],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Яка модель має чотири окремі слоти та дві незалежні зони керування?",
      type: QuestionType.SINGLE,
      options: ["TSF02", "TSF03", "KLF03", "DCF02"],
      correctAnswer: { index: 1 },
      sortOrder: 2
    },
    {
      question: "Оберіть функції, які згадані для лінійки тостерів Smeg.",
      type: QuestionType.MULTIPLE,
      options: [
        "Підігрів",
        "Розморожування",
        "Bagel",
        "HyperSmooth"
      ],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 3
    },
    {
      question: "Яка модель має два довгі слоти зі спільним керуванням?",
      type: QuestionType.SINGLE,
      options: ["TSF03", "TSF02", "Обидві однаково", "Жодна"],
      correctAnswer: { index: 1 },
      sortOrder: 4
    },
    {
      question: "Що з наведеного є логічним апсейлом для тостерів Smeg?",
      type: QuestionType.SINGLE,
      options: [
        "Інша техніка Smeg у тому ж кольорі або стилі",
        "Media Mod",
        "Карта microSD",
        "VR-шолом"
      ],
      correctAnswer: { index: 0 },
      sortOrder: 5
    }
  ];
}

function harmanHomeAudioFoundationQuestions() {
  return [
    {
      question: "Яке перше питання найкраще поставити клієнту під час консультації по Harman Kardon?",
      type: QuestionType.SINGLE,
      options: [
        "Який колір коробки подобається більше",
        "Де стоятиме колонка, чи треба її переносити і чи потрібні smart / Wi-Fi функції",
        "Чи хоче клієнт одразу найдорожчу модель",
        "Чи потрібен лише логотип бренду"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Оберіть лінійки або серії Harman Kardon, які у вашому матеріалі відносяться до portable-сценарію.",
      type: QuestionType.MULTIPLE,
      options: ["Onyx", "Go + Play", "Luna", "Citation 200", "Radiance 2400"],
      correctAnswer: { indices: [0, 1, 2, 3] },
      sortOrder: 2
    },
    {
      question: "True/False: Citation у вашому матеріалі позиціонується як smart / Wi-Fi / multiroom-лінійка.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Яка модель найкраще відповідає сценарію \"дизайнерська 360° колонка з підсвіткою для атмосфери\"?",
      type: QuestionType.SINGLE,
      options: ["Aura Studio", "Luna", "Citation Oasis", "Onyx Studio 7"],
      correctAnswer: { index: 0 },
      sortOrder: 4
    },
    {
      question: "Що найкраще відрізняє Harman Kardon у продажі від більш утилітарних колонок?",
      type: QuestionType.SINGLE,
      options: [
        "Поєднання теплого фірмового звучання, дизайну і сценарності",
        "Повна відсутність дизайну",
        "Лише захист від води",
        "Тільки найнижча ціна"
      ],
      correctAnswer: { index: 0 },
      sortOrder: 5
    }
  ];
}

function harmanHomeAudioCatalogQuestions() {
  return [
    {
      question: "Яка модель Harman Kardon у вашому матеріалі є культовою 2.1-системою з окремим сабвуфером?",
      type: QuestionType.SINGLE,
      options: ["Aura Studio 4", "SoundSticks 4", "Onyx Studio 9", "Citation 100"],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Оберіть моделі Harman Kardon, для яких у вашому матеріалі прямо згадано Wi-Fi / multiroom сценарій.",
      type: QuestionType.MULTIPLE,
      options: ["Citation One MKIII", "Citation 200", "Citation 500", "Luna", "Citation Oasis MKIII"],
      correctAnswer: { indices: [0, 1, 2, 4] },
      sortOrder: 2
    },
    {
      question: "True/False: Go + Play 3 у вашому матеріалі описується як великий преміальний portable-бумбокс із масштабним звуком.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Яка модель Harman Kardon у вашому каталозі найбільше підходить для спальні як smart-будильник із Qi-зарядкою?",
      type: QuestionType.SINGLE,
      options: ["Citation 300", "Citation Oasis MKIII", "Onyx Studio 8", "Radiance 2400"],
      correctAnswer: { index: 1 },
      sortOrder: 4
    },
    {
      question: "Що найкраще описує позиціонування Radiance 2400 у вашому матеріалі?",
      type: QuestionType.SINGLE,
      options: [
        "Компактна travel-колонка з IP67",
        "Преміальна домашня система для великої вітальні без складного ресивера",
        "Базова Bluetooth-колонка для кухні",
        "Дизайнерський нічний будильник"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function whoopFitnessTrackersFoundationQuestions() {
  return [
    {
      question: "Що найкраще описує саму концепцію WHOOP?",
      type: QuestionType.SINGLE,
      options: [
        "Смарт-годинник з великим екраном і GPS",
        "Система керування режимом і відновленням через біометрію та підписку",
        "Лише крокомір без застосунку",
        "Медичний діагностичний прилад"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Оберіть ключові метрики WHOOP із вашого матеріалу.",
      type: QuestionType.MULTIPLE,
      options: ["Recovery", "Strain", "Sleep", "Stress", "Face ID"],
      correctAnswer: { indices: [0, 1, 2, 3] },
      sortOrder: 2
    },
    {
      question: "True/False: WHOOP має екран і продається насамперед як класичний смарт-годинник.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: false },
      sortOrder: 3
    },
    {
      question: "Який важливий нюанс потрібно чесно проговорити під час продажу WHOOP?",
      type: QuestionType.SINGLE,
      options: [
        "Що продукт не потребує застосунку",
        "Що WHOOP продається через підписку і частина функцій залежить від плану",
        "Що браслет має великий AMOLED-екран",
        "Що всі функції є медичною діагностикою"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 4
    },
    {
      question: "Що з наведеного є сильним аргументом на користь WHOOP 5.0 / MG?",
      type: QuestionType.SINGLE,
      options: [
        "14+ днів батареї для постійного носіння",
        "Механічний безель",
        "Вбудований SIM-слот",
        "Обов'язковий GPS без телефона"
      ],
      correctAnswer: { index: 0 },
      sortOrder: 5
    }
  ];
}

function whoopFitnessTrackersCatalogQuestions() {
  return [
    {
      question: "Яке покоління WHOOP у вашому матеріалі позиціонується як золота середина для більшості користувачів?",
      type: QuestionType.SINGLE,
      options: ["WHOOP 3.0", "WHOOP 4.0", "WHOOP 5.0", "WHOOP MG"],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Оберіть функції, які відрізняють WHOOP MG від базового WHOOP 5.0 у вашому матеріалі.",
      type: QuestionType.MULTIPLE,
      options: ["ECG", "Blood Pressure Insights", "Irregular Rhythm Notifications", "Вбудований GPS"],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 2
    },
    {
      question: "True/False: WHOOP 5.0 у вашому матеріалі має 14+ днів автономності.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Який план WHOOP у вашому матеріалі додає Stress Monitor, Health Monitor і Healthspan / WHOOP Age?",
      type: QuestionType.SINGLE,
      options: ["WHOOP One", "WHOOP Peak", "WHOOP Life", "Усі однаково"],
      correctAnswer: { index: 1 },
      sortOrder: 4
    },
    {
      question: "Кому з наведених клієнтів WHOOP підходить найкраще?",
      type: QuestionType.SINGLE,
      options: [
        "Тому, хто хоче смарт-годинник з екраном і навігацією",
        "Тому, хто хоче 24/7-аналітику відновлення, сну і режиму без екрану",
        "Тому, хто шукає лише бюджетний крокомір без підписки",
        "Тому, кому потрібен медичний тонометр"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 5
    }
  ];
}

function portablePowerStationsFoundationQuestions() {
  return [
    {
      question: "Яка формула використовується для швидкого підбору потрібної ємності станції?",
      type: QuestionType.SINGLE,
      options: [
        "Wh = Вт + год + ККД",
        "Wh = (Вт × год) / ККД",
        "Wh = Вт / год",
        "Wh = пікова потужність × 2"
      ],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Що потрібно уточнити в клієнта на старті консультації по зарядній станції?",
      type: QuestionType.MULTIPLE,
      options: [
        "Що саме буде живити",
        "На скільки годин потрібна автономність",
        "Чи планує підключати сонячні панелі",
        "Який улюблений колір корпусу"
      ],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 2
    },
    {
      question: "True/False: W і Wh означають одне й те саме.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: false },
      sortOrder: 3
    },
    {
      question: "Яка хімія АКБ у вашому матеріалі подається як безпечніша і довговічніша, але важча?",
      type: QuestionType.SINGLE,
      options: ["NMC", "LiFePO₄", "Ni-MH", "Lead Acid"],
      correctAnswer: { index: 1 },
      sortOrder: 4
    },
    {
      question: "Чому для холодильника або насоса важливо перевіряти не лише Wh, а й W та пікову потужність?",
      type: QuestionType.SINGLE,
      options: [
        "Бо ці пристрої часто мають високий пусковий струм",
        "Бо їм не потрібна чиста синусоїда",
        "Бо вони заряджаються лише від USB-C",
        "Бо для них неважлива ємність станції"
      ],
      correctAnswer: { index: 0 },
      sortOrder: 5
    }
  ];
}

function portablePowerStationsCatalogQuestions() {
  return [
    {
      question: "До якої лінійки у вашому матеріалі належать моделі RIVER і DELTA?",
      type: QuestionType.SINGLE,
      options: ["Bluetti", "EcoFlow", "Anker SOLIX", "Jackery"],
      correctAnswer: { index: 1 },
      sortOrder: 1
    },
    {
      question: "Яка модель Bluetti у вашому матеріалі має IP65 пиловодо-захист?",
      type: QuestionType.SINGLE,
      options: ["EB3A", "AC2P", "AC240", "AC200L"],
      correctAnswer: { index: 2 },
      sortOrder: 2
    },
    {
      question: "True/False: Anker SOLIX F3800 у вашому матеріалі позиціонується як резерв для дому.",
      type: QuestionType.TRUE_FALSE,
      options: ["True", "False"],
      correctAnswer: { value: true },
      sortOrder: 3
    },
    {
      question: "Яка модель Jackery у вашому матеріалі масштабується до 12 кВт·год системно?",
      type: QuestionType.SINGLE,
      options: ["Explorer 500", "Explorer 1000 Plus", "Explorer 2000 Plus", "Жодна"],
      correctAnswer: { index: 2 },
      sortOrder: 4
    },
    {
      question: "Що в розширених таблицях потрібно перевіряти у PV-вході, окрім простої цифри у Вт?",
      type: QuestionType.MULTIPLE,
      options: [
        "Діапазон напруги",
        "Струм",
        "Тип роз’єму",
        "Колір дисплея"
      ],
      correctAnswer: { indices: [0, 1, 2] },
      sortOrder: 5
    }
  ];
}

async function main() {
  const hashedPassword = await bcrypt.hash("Password123!", 10);

  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.module.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.loginAttempt.deleteMany();
  await prisma.appSetting.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      name: "Адміністратор Порталу",
      firstName: "Адміністратор",
      lastName: "Порталу",
      email: "admin@portal.ua",
      passwordHash: hashedPassword,
      role: Role.ADMIN,
      position: "Адміністратор",
      department: "Навчання",
      store: "Центральний офіс"
    }
  });

  const manager = await prisma.user.create({
    data: {
      name: "Олена Менеджер",
      firstName: "Олена",
      lastName: "Менеджер",
      email: "manager@portal.ua",
      passwordHash: hashedPassword,
      role: Role.MANAGER,
      position: "Менеджер",
      department: "Продажі",
      store: "Київ #1"
    }
  });

  const seller = await prisma.user.create({
    data: {
      name: "Ігор Продавець",
      firstName: "Ігор",
      lastName: "Продавець",
      email: "seller@portal.ua",
      passwordHash: hashedPassword,
      role: Role.SELLER,
      position: "Продавець-консультант",
      department: "Мобільна техніка",
      store: "Київ #1"
    }
  });

  for (const [brandIndex, brand] of brandsSeed.entries()) {
    await prisma.brand.create({
      data: {
        name: brand.name,
        slug: brand.slug,
        logoUrl: brand.logoUrl,
        description: brand.description,
        sortOrder: brandIndex + 1,
        categories: {
          create: brand.categories.map((category) => ({
            name: category.name,
            slug: category.slug,
            description: category.description,
            sortOrder: category.sortOrder
          }))
        }
      }
    });
  }

  const categories = await prisma.category.findMany({ include: { brand: true } });

  for (const category of categories) {
    if (category.brand.slug === "apple" && category.slug === "iphone") {
      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Apple iPhone: Лінійка, ринки та ключові технології",
          description: "Внутрішній конспект по сегментах iPhone, регіональних версіях, MDM/R-SIM, дисплеях і технологіях Apple.",
          contentBlocks: iphoneFoundationBlocks,
          durationMin: 28,
          sortOrder: 1,
          questions: {
            create: iphoneFoundationQuestions()
          }
        }
      });

      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Apple iPhone: Моделі та технічні характеристики",
          description: "Інтерактивний каталог моделей iPhone з кольорами, діагоналями, пам'яттю та ключовими характеристиками.",
          contentBlocks: iphoneCatalogBlocks,
          durationMin: 35,
          sortOrder: 2,
          questions: {
            create: iphoneCatalogQuestions()
          }
        }
      });

      continue;
    }

    if (category.brand.slug === "apple" && category.slug === "ipad") {
      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Apple iPad: Лінійки, технології та iPadOS",
          description: "Внутрішній конспект по лінійках iPad, ключових технологіях Apple, iPadOS, підключенню до інтернету та блокуванням.",
          contentBlocks: ipadFoundationBlocks,
          durationMin: 24,
          sortOrder: 1,
          questions: {
            create: ipadFoundationQuestions()
          }
        }
      });

      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Apple iPad: Моделі та технічні характеристики",
          description: "Каталог поколінь iPad, iPad Air, iPad mini та iPad Pro з кольорами, пам'яттю і ключовими технічними характеристиками.",
          contentBlocks: ipadCatalogBlocks,
          durationMin: 38,
          sortOrder: 2,
          questions: {
            create: ipadCatalogQuestions()
          }
        }
      });

      continue;
    }

    if (category.brand.slug === "apple" && category.slug === "macbook") {
      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Apple MacBook: macOS, Apple Silicon та особливості лінійки",
          description: "Внутрішній конспект по macOS, дисплеях, введенню, Apple Silicon, регіональних відмінностях і MDM у MacBook.",
          contentBlocks: macbookFoundationBlocks,
          durationMin: 34,
          sortOrder: 1,
          questions: {
            create: macbookFoundationQuestions()
          }
        }
      });

      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Apple MacBook: Моделі та технічні характеристики",
          description: "Каталог моделей MacBook 12, MacBook Air і MacBook Pro з кольорами, конфігураціями та ключовими технічними характеристиками.",
          contentBlocks: macbookCatalogBlocks,
          durationMin: 46,
          sortOrder: 2,
          questions: {
            create: macbookCatalogQuestions()
          }
        }
      });

      continue;
    }

    if (category.brand.slug === "apple" && category.slug === "imac") {
      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Apple iMac: Огляд лінійки, macOS та регіональні особливості",
          description: "Внутрішній конспект по iMac, ключових перевагах, macOS, регіональних відмінностях і MDM для настільних Mac Apple.",
          contentBlocks: imacFoundationBlocks,
          durationMin: 26,
          sortOrder: 1,
          questions: {
            create: imacFoundationQuestions()
          }
        }
      });

      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Apple iMac: Моделі iMac, Mac mini, Mac Studio та Mac Pro",
          description: "Каталог моделей iMac і настільних Mac Apple з ключовими характеристиками, комплектацією та позиціонуванням.",
          contentBlocks: imacCatalogBlocks,
          durationMin: 34,
          sortOrder: 2,
          questions: {
            create: imacCatalogQuestions()
          }
        }
      });

      continue;
    }

    if (category.brand.slug === "apple" && category.slug === "apple-watch") {
      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Apple Watch: GPS/LTE, здоров'я та регіональні особливості",
          description: "Внутрішній конспект по Apple Watch: GPS vs LTE, ключові функції здоров'я, дисплеї, регіональні відмінності та позиціонування.",
          contentBlocks: appleWatchFoundationBlocks,
          durationMin: 29,
          sortOrder: 1,
          questions: {
            create: appleWatchFoundationQuestions()
          }
        }
      });

      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Apple Watch: Series, SE та Ultra — моделі й технічні характеристики",
          description: "Каталог моделей Apple Watch Series, SE та Ultra з кольорами, конфігураціями та ключовими технічними характеристиками.",
          contentBlocks: appleWatchCatalogBlocks,
          durationMin: 41,
          sortOrder: 2,
          questions: {
            create: appleWatchCatalogQuestions()
          }
        }
      });

      continue;
    }

    if (category.brand.slug === "apple" && category.slug === "airpods") {
      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Apple AirPods та EarPods: функції, екосистема та сценарії використання",
          description: "Внутрішній конспект по Apple AirPods та EarPods: ключові функції, позиціонування сімейств, екосистема Apple та сценарії консультації.",
          contentBlocks: airpodsFoundationBlocks,
          durationMin: 23,
          sortOrder: 1,
          questions: {
            create: airpodsFoundationQuestions()
          }
        }
      });

      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Apple AirPods та EarPods: моделі й технічні характеристики",
          description: "Каталог моделей AirPods, AirPods Pro, AirPods Max та EarPods з ключовими характеристиками, типами підключення і позиціонуванням.",
          contentBlocks: airpodsCatalogBlocks,
          durationMin: 36,
          sortOrder: 2,
          questions: {
            create: airpodsCatalogQuestions()
          }
        }
      });

      continue;
    }

    if (category.brand.slug === "apple" && category.slug === "peripherals") {
      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Apple Периферія: Apple TV, HomePod, Pencil, AirTag та аксесуари",
          description: "Внутрішній конспект по Apple периферії: Apple TV, HomePod, Apple Pencil, AirTag, Magic Mouse і Magic Trackpad у сценаріях екосистеми Apple.",
          contentBlocks: applePeripheralsFoundationBlocks,
          durationMin: 27,
          sortOrder: 1,
          questions: {
            create: applePeripheralsFoundationQuestions()
          }
        }
      });

      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Apple Периферія: моделі Apple TV, HomePod, Pencil, AirTag, Magic Mouse та Trackpad",
          description: "Каталог моделей Apple TV, HomePod, Apple Pencil, AirTag, Magic Mouse і Magic Trackpad з ключовими характеристиками та позиціонуванням.",
          contentBlocks: applePeripheralsCatalogBlocks,
          durationMin: 39,
          sortOrder: 2,
          questions: {
            create: applePeripheralsCatalogQuestions()
          }
        }
      });

      continue;
    }

    if (category.brand.slug === "dyson" && category.slug === "hair-stylers") {
      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Dyson Фени та стайлери: Airwrap, ринки та підбір під тип волосся",
          description: "Внутрішній конспект по Dyson Hair: ринки, насадки, Airwrap, Supersonic, Corrale, Airstrait і логіка підбору під потреби клієнта.",
          contentBlocks: dysonHairStylersFoundationBlocks,
          durationMin: 32,
          sortOrder: 1,
          questions: {
            create: dysonHairStylersFoundationQuestions()
          }
        }
      });

      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Dyson Фени та стайлери: моделі Airwrap, Supersonic, Corrale та Airstrait",
          description: "Каталог лінійок Dyson Hair з моделями, кольорами, ключовими характеристиками та швидкою логікою рекомендації під запит клієнта.",
          contentBlocks: dysonHairStylersCatalogBlocks,
          durationMin: 44,
          sortOrder: 2,
          questions: {
            create: dysonHairStylersCatalogQuestions()
          }
        }
      });

      continue;
    }

    if (category.brand.slug === "dyson" && category.slug === "vacuums") {
      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Dyson Пилососи: лінійки, комплектації та підбір під сценарій прибирання",
          description: "Внутрішній конспект по пилососах Dyson: cordless-моделі, комплектації Standard / Absolute / Animal / Pro, вологе прибирання і роботи-пилососи.",
          contentBlocks: dysonVacuumsFoundationBlocks,
          durationMin: 34,
          sortOrder: 1,
          questions: {
            create: dysonVacuumsFoundationQuestions()
          }
        }
      });

      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Dyson Пилососи: моделі Gen5, V15, V11, V10, V8, WashG1 та 360",
          description: "Каталог Dyson Vacuum з ключовими лінійками, комплектаціями і сценаріями використання для швидкого порівняння в консультації.",
          contentBlocks: dysonVacuumsCatalogBlocks,
          durationMin: 41,
          sortOrder: 2,
          questions: {
            create: dysonVacuumsCatalogQuestions()
          }
        }
      });

      continue;
    }

    if (category.brand.slug === "dyson" && category.slug === "air-purifiers") {
      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Dyson Очищувачі повітря: зволоження, формальдегід і підбір під сценарій",
          description: "Внутрішній конспект по Dyson Air Care: очищення повітря, зволоження, формальдегід, обігрів, охолодження і логіка підбору моделі під потребу клієнта.",
          contentBlocks: dysonAirPurifiersFoundationBlocks,
          durationMin: 26,
          sortOrder: 1,
          questions: {
            create: dysonAirPurifiersFoundationQuestions()
          }
        }
      });

      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Dyson Очищувачі повітря: моделі BP03, PH04, HP09 та AM09",
          description: "Каталог Dyson Air Care з ключовими моделями очищення, зволоження та Hot+Cool сценаріїв для швидкої консультації й порівняння.",
          contentBlocks: dysonAirPurifiersCatalogBlocks,
          durationMin: 29,
          sortOrder: 2,
          questions: {
            create: dysonAirPurifiersCatalogQuestions()
          }
        }
      });

      continue;
    }

    if (category.brand.slug === "garmin" && category.slug === "smart-watches") {
      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Garmin Смарт-годинники: серії, позиціонування та логіка підбору",
          description:
            "Внутрішній конспект по Garmin: бренд, ключові серії, сценарії використання та швидка логіка рекомендації під спорт, outdoor, здоров'я, гольф і дайвінг.",
          contentBlocks: garminSmartWatchesFoundationBlocks,
          durationMin: 28,
          sortOrder: 1,
          questions: {
            create: garminSmartWatchesFoundationQuestions()
          }
        }
      });

      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Garmin Смарт-годинники: Fenix, Epix, Forerunner, Instinct, MARQ та інші серії",
          description:
            "Каталог серій Garmin з ключовими відмінностями, позиціонуванням і швидким маршрутом підбору під запит клієнта.",
          contentBlocks: garminSmartWatchesCatalogBlocks,
          durationMin: 37,
          sortOrder: 2,
          questions: {
            create: garminSmartWatchesCatalogQuestions()
          }
        }
      });

      continue;
    }

    if (category.brand.slug === "marshall" && category.slug === "bluetooth-speakers") {
      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Marshall Bluetooth-колонки: лінійка, формати та логіка підбору",
          description:
            "Внутрішній конспект по Marshall: бренд, домашні й портативні формати, ключові відмінності між серіями та швидка логіка рекомендації під сценарій клієнта.",
          contentBlocks: marshallSpeakersFoundationBlocks,
          durationMin: 23,
          sortOrder: 1,
          questions: {
            create: marshallSpeakersFoundationQuestions()
          }
        }
      });

      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Marshall Bluetooth-колонки: Woburn, Stanmore, Acton, Tufton, Middleton та інші моделі",
          description:
            "Каталог Marshall-колонок з ключовими характеристиками, позиціонуванням і швидким підбором під дім, подорожі, вечірки та щоденне використання.",
          contentBlocks: marshallSpeakersCatalogBlocks,
          durationMin: 34,
          sortOrder: 2,
          questions: {
            create: marshallSpeakersCatalogQuestions()
          }
        }
      });

      continue;
    }

    if (category.brand.slug === "jbl" && category.slug === "bluetooth-speakers") {
      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "JBL аудіо: лінійки, сценарії та логіка консультації",
          description:
            "Внутрішній конспект по JBL: portable-моделі, PartyBox, Authentics, JBL Bar і швидкий маршрут підбору під сценарій клієнта.",
          contentBlocks: jblFoundationBlocks,
          durationMin: 27,
          sortOrder: 1,
          questions: {
            create: jblFoundationQuestions()
          }
        }
      });

      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "JBL: Go, Clip, Flip, Charge, Pulse, Xtreme, PartyBox, Authentics і Bar",
          description:
            "Каталог JBL-моделей із ключовими характеристиками, позиціонуванням та швидким підбором під мобільний, домашній і кінотеатральний сценарій.",
          contentBlocks: jblCatalogBlocks,
          durationMin: 39,
          sortOrder: 2,
          questions: {
            create: jblCatalogQuestions()
          }
        }
      });

      continue;
    }

    if (category.brand.slug === "playstation" && category.slug === "gaming-consoles") {
      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Ігрові консолі: платформи, екосистеми та логіка консультації",
          description:
            "Внутрішній конспект по сучасних ігрових платформах: домашні консолі, портативні рішення, VR, ексклюзиви, підписки та сценарії підбору.",
          contentBlocks: gamingConsolesFoundationBlocks,
          durationMin: 29,
          sortOrder: 1,
          questions: {
            create: gamingConsolesFoundationQuestions()
          }
        }
      });

      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Ігрові консолі: PS5, Xbox, Steam Deck, Nintendo Switch та ROG Ally",
          description:
            "Каталог сучасних консолей і handheld-рішень з ключовими відмінностями, аксесуарами та короткою логікою рекомендації під запит клієнта.",
          contentBlocks: gamingConsolesCatalogBlocks,
          durationMin: 42,
          sortOrder: 2,
          questions: {
            create: gamingConsolesCatalogQuestions()
          }
        }
      });

      continue;
    }

    if (category.brand.slug === "cameras" && category.slug === "digital-cameras") {
      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Портативні камери: Instax, DSLR та логіка консультації",
          description:
            "Практичний модуль для консультації по миттєвих камерах Fujifilm Instax і DSLR Canon: сценарії, формати, апсейл і коротка логіка підбору.",
          contentBlocks: digitalCamerasFoundationBlocks,
          durationMin: 27,
          sortOrder: 1,
          questions: {
            create: digitalCamerasFoundationQuestions()
          }
        }
      });

      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Портативні камери: Fujifilm Instax і Canon EOS 5D",
          description:
            "Каталог моделей Instax і Canon 5D з позиціонуванням, форматами плівки, відмінностями між моделями та рекомендаціями під запит клієнта.",
          contentBlocks: digitalCamerasCatalogBlocks,
          durationMin: 38,
          sortOrder: 2,
          questions: {
            create: digitalCamerasCatalogQuestions()
          }
        }
      });

      continue;
    }

    if (category.brand.slug === "cameras" && category.slug === "go-pro") {
      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "GoPro: лінійки, сценарії та логіка консультації",
          description:
            "Практичний модуль по GoPro: як швидко розвести Hero, Creator Edition і MAX, коли порівнювати з DJI та що допродавати в екшн-сценарії.",
          contentBlocks: goProFoundationBlocks,
          durationMin: 28,
          sortOrder: 1,
          questions: {
            create: goProFoundationQuestions()
          }
        }
      });

      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "GoPro HERO, MAX, Creator Edition та аксесуари",
          description:
            "Каталог GoPro-моделей з позиціонуванням, ключовими відмінностями, creator-наборами, 360-сценарієм і швидкою логікою рекомендації.",
          contentBlocks: goProCatalogBlocks,
          durationMin: 41,
          sortOrder: 2,
          questions: {
            create: goProCatalogQuestions()
          }
        }
      });

      continue;
    }

    if (category.brand.slug === "smeg" && category.slug === "coffee-machines") {
      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Smeg: кавомашини, сценарії та логіка консультації",
          description:
            "Практичний модуль по кавомашинах Smeg: як розвести еспресо- й крапельний сценарій, які питання ставити клієнту та на чому будувати рекомендацію.",
          contentBlocks: smegCoffeeMachinesFoundationBlocks,
          durationMin: 24,
          sortOrder: 1,
          questions: {
            create: smegCoffeeMachinesFoundationQuestions()
          }
        }
      });

      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Smeg ECF02 та DCF02: моделі, кольори й аргументи продажу",
          description:
            "Каталог кавоварок Smeg з ключовими відмінностями між рожковою та крапельною моделлю, кольоровими варіантами й короткою логікою підбору.",
          contentBlocks: smegCoffeeMachinesCatalogBlocks,
          durationMin: 31,
          sortOrder: 2,
          questions: {
            create: smegCoffeeMachinesCatalogQuestions()
          }
        }
      });

      continue;
    }

    if (category.brand.slug === "smeg" && category.slug === "kettles") {
      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Smeg: чайники, сценарії та логіка консультації",
          description:
            "Практичний модуль по чайниках Smeg: як розвести класичний сценарій і сценарій з терморегуляцією, які питання ставити та як продавати через дизайн.",
          contentBlocks: smegKettlesFoundationBlocks,
          durationMin: 22,
          sortOrder: 1,
          questions: {
            create: smegKettlesFoundationQuestions()
          }
        }
      });

      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Smeg KLF03 та KLF04: моделі, кольори й аргументи продажу",
          description:
            "Каталог чайників Smeg з ключовими відмінностями між KLF03 і KLF04, кольоровими варіантами та короткою логікою рекомендації під запит клієнта.",
          contentBlocks: smegKettlesCatalogBlocks,
          durationMin: 29,
          sortOrder: 2,
          questions: {
            create: smegKettlesCatalogQuestions()
          }
        }
      });

      continue;
    }

    if (category.brand.slug === "smeg" && category.slug === "toasters") {
      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Smeg: тостери, сценарії та логіка консультації",
          description:
            "Практичний модуль по тостерах Smeg: як визначати потрібний формат, які питання ставити клієнту та як продавати через дизайн і побутовий комфорт.",
          contentBlocks: smegToastersFoundationBlocks,
          durationMin: 21,
          sortOrder: 1,
          questions: {
            create: smegToastersFoundationQuestions()
          }
        }
      });

      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Smeg TSF02 та TSF03: моделі, кольори й аргументи продажу",
          description:
            "Каталог тостерів Smeg з ключовими відмінностями між TSF02 і TSF03, кольоровими варіантами та короткою логікою рекомендації.",
          contentBlocks: smegToastersCatalogBlocks,
          durationMin: 27,
          sortOrder: 2,
          questions: {
            create: smegToastersCatalogQuestions()
          }
        }
      });

      continue;
    }

    if (category.brand.slug === "harman" && category.slug === "home-audio") {
      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Harman Kardon: лінійки, звук і логіка консультації",
          description:
            "Внутрішній конспект по Harman Kardon: дизайнерська домашня акустика, portable-серії, Citation multiroom і швидка логіка підбору під сценарій клієнта.",
          contentBlocks: harmanHomeAudioFoundationBlocks,
          durationMin: 24,
          sortOrder: 1,
          questions: {
            create: harmanHomeAudioFoundationQuestions()
          }
        }
      });

      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Harman Kardon: SoundSticks, Aura, Onyx, Citation та інші моделі",
          description:
            "Каталог Harman Kardon з ключовими моделями для дому, portable і smart Wi-Fi сценаріїв: позиціонування, відмінності та швидкі аргументи продажу.",
          contentBlocks: harmanHomeAudioCatalogBlocks,
          durationMin: 36,
          sortOrder: 2,
          questions: {
            create: harmanHomeAudioCatalogQuestions()
          }
        }
      });

      continue;
    }

    if (category.brand.slug === "whoop" && category.slug === "fitness-trackers") {
      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "WHOOP: метрики, підписка і логіка консультації",
          description:
            "Повний конспект по WHOOP: концепція безекранного браслета, Recovery / Strain / Sleep, підписка, ремінці, обмеження та чесна логіка продажу.",
          contentBlocks: whoopFitnessTrackersFoundationBlocks,
          durationMin: 25,
          sortOrder: 1,
          questions: {
            create: whoopFitnessTrackersFoundationQuestions()
          }
        }
      });

      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "WHOOP Strap 3.0, 4.0, 5.0, MG та плани членства",
          description:
            "Каталог поколінь WHOOP і членств: ключові відмінності між 3.0, 4.0, 5.0, MG, а також логіка вибору планів One, Peak і Life.",
          contentBlocks: whoopFitnessTrackersCatalogBlocks,
          durationMin: 31,
          sortOrder: 2,
          questions: {
            create: whoopFitnessTrackersCatalogQuestions()
          }
        }
      });

      continue;
    }

    if (category.brand.slug === "portable-power" && category.slug === "power-stations") {
      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Портативні зарядні станції: основи, розрахунок і логіка консультації",
          description:
            "Повний конспект по портативних зарядних станціях: сценарії, формула розрахунку, порти, сонячні панелі, типові помилки, заперечення та логіка підбору.",
          contentBlocks: portablePowerStationsFoundationBlocks,
          durationMin: 34,
          sortOrder: 1,
          questions: {
            create: portablePowerStationsFoundationQuestions()
          }
        }
      });

      await prisma.module.create({
        data: {
          categoryId: category.id,
          title: "Портативні зарядні станції: EcoFlow, Bluetti, Anker SOLIX, Jackery",
          description:
            "Розширене порівняння популярних лінійок зарядних станцій: повні таблиці по EcoFlow, Bluetti, Anker SOLIX і Jackery та правила читання характеристик.",
          contentBlocks: portablePowerStationsCatalogBlocks,
          durationMin: 39,
          sortOrder: 2,
          questions: {
            create: portablePowerStationsCatalogQuestions()
          }
        }
      });

      continue;
    }

    const learningTopic = getLearningTopicForCategory(category.brand.slug, category.slug);
    const baseTitle = `${category.brand.name} ${category.name}`;

    await prisma.module.create({
      data: {
        categoryId: category.id,
        title: `${baseTitle}: Базові знання`,
        description: "Огляд лінійки, ключові характеристики, позиціонування і робота із запереченнями.",
        contentBlocks: learningTopic ? getLearningTopicBlocks(learningTopic, "basics") : moduleContent(`${baseTitle}: Базові знання`, category.name),
        durationMin: 18,
        sortOrder: 1,
        questions: {
          create: learningTopic ? getLearningTopicQuestions(learningTopic, "basics") : moduleQuestions(category.name)
        }
      }
    });

    await prisma.module.create({
      data: {
        categoryId: category.id,
        title: `${baseTitle}: Скрипти продажу`,
        description: "Практичні сценарії консультації, апсейл аксесуарів і сервісних продуктів.",
        contentBlocks: learningTopic ? getLearningTopicBlocks(learningTopic, "sales") : moduleContent(`${baseTitle}: Скрипти продажу`, category.name),
        durationMin: 24,
        sortOrder: 2,
        questions: {
          create: learningTopic ? getLearningTopicQuestions(learningTopic, "sales") : moduleQuestions(category.name)
        }
      }
    });
  }

  const firstModules = await prisma.module.findMany({
    take: 8,
    orderBy: [{ id: "asc" }]
  });

  if (firstModules.length > 0) {
    await prisma.userProgress.createMany({
      data: [
        {
          userId: seller.id,
          moduleId: firstModules[0].id,
          status: ProgressStatus.COMPLETED,
          progressPct: 100,
          completedAt: new Date()
        },
        {
          userId: seller.id,
          moduleId: firstModules[1].id,
          status: ProgressStatus.IN_PROGRESS,
          progressPct: 65
        },
        {
          userId: manager.id,
          moduleId: firstModules[0].id,
          status: ProgressStatus.COMPLETED,
          progressPct: 100,
          completedAt: new Date()
        },
        {
          userId: manager.id,
          moduleId: firstModules[2].id,
          status: ProgressStatus.COMPLETED,
          progressPct: 100,
          completedAt: new Date()
        }
      ]
    });

    await prisma.quizAttempt.createMany({
      data: [
        {
          userId: seller.id,
          moduleId: firstModules[0].id,
          score: 88,
          passed: true,
          answers: { demo: true }
        },
        {
          userId: seller.id,
          moduleId: firstModules[1].id,
          score: 64,
          passed: false,
          answers: { demo: true }
        },
        {
          userId: manager.id,
          moduleId: firstModules[2].id,
          score: 93,
          passed: true,
          answers: { demo: true }
        }
      ]
    });

    await prisma.certificate.create({
      data: {
        userId: seller.id,
        moduleId: firstModules[0].id,
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
      }
    });
  }

  const firstStepBadge = await prisma.badge.create({
    data: {
      code: "FIRST_STEP",
      name: "Перший крок",
      description: "Успішно завершено перший модуль.",
      icon: "rocket"
    }
  });

  const expertBadge = await prisma.badge.create({
    data: {
      code: "BRAND_EXPERT",
      name: "Експерт бренду",
      description: "Середній результат тестів понад 85%.",
      icon: "award"
    }
  });

  await prisma.userBadge.createMany({
    data: [
      { userId: seller.id, badgeId: firstStepBadge.id },
      { userId: manager.id, badgeId: expertBadge.id }
    ]
  });

  await prisma.appSetting.createMany({
    data: [
      {
        key: "quiz_rules",
        value: {
          passScore: 70,
          maxAttempts: 3,
          scoringMode: "BEST"
        }
      },
      {
        key: "notifications",
        value: {
          weeklyReminder: true,
          newContentEmail: true
        }
      }
    ]
  });

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
