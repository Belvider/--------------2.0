import type { ModuleCatalogProduct, ModuleContentBlock } from "../module-content";

export const garminSmartWatchesCatalog: ModuleCatalogProduct[] = [
  {
    slug: "garmin-fenix",
    title: "Garmin Fenix",
    family: "Outdoor flagship",
    summary:
      "Універсальний outdoor-флагман Garmin для експедицій, навігації, складних умов і клієнтів, яким потрібна витривалість без компромісів.",
    overview: ["Фокус: outdoor + multisport", "Дисплей: MIP або AMOLED залежно від покоління", "Сценарій: експедиції, трекінг, професійне використання"],
    highlights: [
      "GPS, GLONASS, Galileo, карти та навігаційні інструменти",
      "Покоління Fenix 7 / 7 Pro / 8 / E закривають різний бюджет і сценарії",
      "У Pro- і старших версіях є ліхтарик, мультичастотний GNSS і сильніші outdoor-метрики",
      "Корпуси з акцентом на міцність: сталь, титан, сапфір у старших виконаннях",
      "Дуже сильна автономність у смарт-режимі та експедиційних сценаріях",
      "Найкраще продається клієнту, який хоче максимум надійності, автономності та карт у годиннику"
    ],
    colors: [
      {
        label: "Серія Fenix",
        imageUrl: "/materials/garmin-smart-watches/fenix.png",
        caption: "Garmin Fenix",
        default: true
      }
    ]
  },
  {
    slug: "garmin-epix",
    title: "Garmin Epix",
    family: "Premium AMOLED outdoor",
    summary:
      "Преміальна альтернатива Fenix для клієнта, який хоче майже той самий рівень можливостей, але з яскравим AMOLED-дисплеєм.",
    overview: ["Фокус: outdoor + premium AMOLED", "Матеріали: сапфір, титан", "Сценарій: спорт + стиль + преміум"],
    highlights: [
      "AMOLED-дисплей з насиченим зображенням і кращою візуальною подачею карт та інтерфейсу",
      "Навігація, топографічні карти, ClimbPro, маршрути й мульти-GNSS",
      "Epix Gen 2 і Epix Pro Gen 2 дають outdoor-рівень функцій у більш 'вітринному' форматі",
      "У Pro-версіях є ліхтарик, нові метрики типу Hill Score та Endurance Score",
      "Преміальні матеріали корпусу та 10 ATM роблять лінійку по-справжньому універсальною",
      "Правильна рекомендація для клієнта, який вагається між Fenix і красивішим AMOLED-виконанням"
    ],
    colors: [
      {
        label: "Серія Epix",
        imageUrl: "/materials/garmin-smart-watches/epix.png",
        caption: "Garmin Epix",
        default: true
      }
    ]
  },
  {
    slug: "garmin-enduro",
    title: "Garmin Enduro",
    family: "Ultra-endurance",
    summary:
      "Лінійка Garmin для ультрадистанцій і сценаріїв, де найважливішим аргументом стає автономність.",
    overview: ["Фокус: автономність", "Solar: Power Glass", "Сценарій: трейл, ультра, довгі експедиції"],
    highlights: [
      "Один із головних selling points Garmin для ультрамарафонців і трейлранерів",
      "Solar-підзарядка допомагає розтягнути автономність на дуже довгі дистанції",
      "Має навігацію, мультиспорт режими, Body Battery, VO2 Max, Pulse Ox",
      "PacePro та ClimbPro добре працюють у сценаріях гірського бігу та складних маршрутів",
      "Водозахист до 100 м і міцний корпус підходять для жорстких умов",
      "Рекомендуємо клієнту, який ставить автономність вище за яскравість дисплея та lifestyle-функції"
    ],
    colors: [
      {
        label: "Серія Enduro",
        imageUrl: "/materials/garmin-smart-watches/enduro.png",
        caption: "Garmin Enduro",
        default: true
      }
    ]
  },
  {
    slug: "garmin-forerunner",
    title: "Garmin Forerunner",
    family: "Running and triathlon",
    summary:
      "Найлогічніша серія Garmin для бігунів і триатлетів: від простих моделей для старту до флагманів із картами й глибокою аналітикою.",
    overview: ["Фокус: біг + триатлон", "Діапазон: від базового до флагмана", "Сценарій: системні тренування"],
    highlights: [
      "Forerunner 55 закриває базовий вхід у спортивний Garmin",
      "Forerunner 165 / 265 дають AMOLED і сильний баланс між ціною, виглядом та точністю",
      "Forerunner 255 добре продається як мультиспорт без карт",
      "Forerunner 955 / 965 потрібні тим, кому важливі карти, Stamina, HRV і Training Readiness",
      "Легка вага та точні бігові метрики роблять серію дуже комфортною для щоденних тренувань",
      "Найкращий вибір, коли клієнт одразу каже: біг, триатлон, пульсові зони, прогрес і підготовка до стартів"
    ],
    colors: [
      {
        label: "Серія Forerunner",
        imageUrl: "/materials/garmin-smart-watches/forerunner.png",
        caption: "Garmin Forerunner",
        default: true
      }
    ]
  },
  {
    slug: "garmin-instinct",
    title: "Garmin Instinct",
    family: "Rugged outdoor",
    summary:
      "Захищена серія Garmin для туристів, військових, outdoor-користувачів і клієнтів, яким важливий брутальний дизайн та ресурсність.",
    overview: ["Фокус: rugged + tactical", "Захист: MIL-STD-810", "Сценарій: туризм, служба, щоденний outdoor"],
    highlights: [
      "Корпус із MIL-STD-810, водозахистом 100 м і дуже високою живучістю в польових умовах",
      "Моделі Instinct 2 / 2S / 2X перекривають різні розміри руки та рівні автономності",
      "Solar-версії можуть працювати дуже довго при достатньому освітленні",
      "Tactical-варіанти дають Stealth Mode, Kill Switch, Jumpmaster і сумісність із нічним баченням",
      "Crossover поєднує аналогові стрілки та смарт-функції для більш незвичного стилю",
      "Ідеально заходить клієнту, який хоче Garmin 'не про красу, а про виживання і функціональність'"
    ],
    colors: [
      {
        label: "Серія Instinct",
        imageUrl: "/materials/garmin-smart-watches/instinct.png",
        caption: "Garmin Instinct",
        default: true
      }
    ]
  },
  {
    slug: "garmin-tactix",
    title: "Garmin Tactix",
    family: "Tactical premium",
    summary:
      "Тактичний преміум Garmin для службових, польових і спеціалізованих сценаріїв, де важливі stealth-функції та витривалий корпус.",
    overview: ["Фокус: tactical", "Матеріали: титан + сапфір", "Сценарій: безпека, служба, спеціальні задачі"],
    highlights: [
      "Тактичні функції: Stealth Mode, Kill Switch, Jumpmaster, нічне бачення, подвійний GPS-формат",
      "Tactix 7 існує у версіях Standard, Pro, Pro Ballistics та AMOLED Edition",
      "У Pro Ballistics є Applied Ballistics для максимально специфічного сценарію",
      "Корпус із титановим безелем і сапфіровим склом добре працює в жорсткому використанні",
      "Є карти, треки, ліхтарик у Pro-моделях і дуже серйозна автономність",
      "Рекомендуємо, коли клієнт шукає не просто outdoor, а саме tactical-рівень Garmin"
    ],
    colors: [
      {
        label: "Серія Tactix",
        imageUrl: "/materials/garmin-smart-watches/tactix.png",
        caption: "Garmin Tactix",
        default: true
      }
    ]
  },
  {
    slug: "garmin-approach",
    title: "Garmin Approach",
    family: "Golf",
    summary:
      "Спеціалізована серія Garmin для гольфу з базою полів, GPS-аналітикою й фокусом саме на грі, а не на загальному outdoor-сценарії.",
    overview: ["Фокус: гольф", "База: 43 000+ полів", "Сценарій: тренування і гра"],
    highlights: [
      "Показує відстані до гріну, хазардів і дог-легів прямо на годиннику",
      "Green View, PlaysLike Distance та AutoShot дають відчутно сильнішу консультацію для гольф-клієнта",
      "S12 — простий вхід, S42 — комфортний lifestyle-сценарій, S62 / S70 — сильніші по аналітиці",
      "S70 додає AMOLED і виглядає сучасніше в повсякденному використанні",
      "Цифрова картка рахунку і смарт-функції підвищують цінність поза полем",
      "Якщо клієнт питає саме 'Garmin для гольфу', це майже завжди Approach"
    ],
    colors: [
      {
        label: "Серія Approach",
        imageUrl: "/materials/garmin-smart-watches/approach.png",
        caption: "Garmin Approach",
        default: true
      }
    ]
  },
  {
    slug: "garmin-descent",
    title: "Garmin Descent",
    family: "Diving",
    summary:
      "Garmin для дайверів і водних спортсменів, де головний selling point — спеціалізовані режими занурення, безпека та журнали дайвінгу.",
    overview: ["Фокус: diving", "Режими: Scuba, Freedive, apnea", "Сценарій: занурення + мультиспорт"],
    highlights: [
      "Підтримує глибокі занурення, мультигазові суміші, попередження та dive-логи",
      "Descent Mk2 / Mk2i добре відомі як повноцінні дайв-інструменти Garmin",
      "Descent G1 дає більш доступний вхід у водні сценарії Garmin",
      "Працює не лише як дайв-комп'ютер, а і як multisport-годинник на суші",
      "GPS допомагає зберігати місця занурень і працювати з маршрутами на суші та воді",
      "Серію продаємо тоді, коли дайвінг — не просто хобі раз на рік, а реальний сценарій користування"
    ],
    colors: [
      {
        label: "Серія Descent",
        imageUrl: "/materials/garmin-smart-watches/descent.png",
        caption: "Garmin Descent",
        default: true
      }
    ]
  },
  {
    slug: "garmin-marq",
    title: "Garmin MARQ",
    family: "Luxury tool watch",
    summary:
      "Найпреміальніша лінійка Garmin для клієнтів, які хочуть не просто спорт-годинник, а статусний інструмент під конкретний lifestyle або професію.",
    overview: ["Фокус: luxury + specialization", "Матеріали: титан, сапфір, преміальні сплави", "Сценарій: статус + спеціалізація"],
    highlights: [
      "Серії Adventurer, Athlete, Golfer, Captain, Aviator, Commander, Driver закривають вузькі lifestyle-сценарії",
      "MARQ 2 отримав AMOLED, кращу автономність і ще преміальніші матеріали",
      "У всіх моделях 32 ГБ пам'яті та високий клас виконання",
      "Продається через дизайн, матеріали, ексклюзивність і релевантну професійну історію",
      "Це той Garmin, який варто показувати клієнту, коли запит звучить як 'щось особливе, не масове'",
      "Для правильного продажу важливо підібрати не просто MARQ, а правильну спеціалізацію всередині серії"
    ],
    colors: [
      {
        label: "Серія MARQ",
        imageUrl: "/materials/garmin-smart-watches/marq.png",
        caption: "Garmin MARQ",
        default: true
      }
    ]
  },
  {
    slug: "garmin-vivoactive-venu",
    title: "Garmin Vivoactive / Venu",
    family: "Lifestyle fitness",
    summary:
      "Найзручніша лінійка Garmin для щоденного використання, здоров'я і тренувань без акценту на жорсткий outdoor або глибокий професійний спорт.",
    overview: ["Фокус: health + everyday", "Дисплей: AMOLED у Venu і Vivoactive 5", "Сценарій: місто, фітнес, здоров'я"],
    highlights: [
      "Venu продається через красивий AMOLED, стиль і комфорт на кожен день",
      "Venu 2 Plus і Venu 3 додають сильніший смарт-сценарій, включно з дзвінками в окремих моделях",
      "Vivoactive 5 добре заходить клієнтам із фокусом на здоров'я, сон, Body Battery та регулярну активність",
      "Є GPS, музика, Garmin Pay, сповіщення та фітнес-програми без перевантаження професійними метриками",
      "Хороший вибір для клієнта, який переходить з Apple Watch / фітнес-браслета у бік автономнішого Garmin",
      "Цю лінійку легко продавати як 'здоров'я + стиль + спорт без складності Fenix або Forerunner'"
    ],
    colors: [
      {
        label: "Серія Venu / Vivoactive",
        imageUrl: "/materials/garmin-smart-watches/venu-vivoactive.png",
        caption: "Garmin Vivoactive / Venu",
        default: true
      }
    ]
  }
];

export const garminSmartWatchesFoundationBlocks: ModuleContentBlock[] = [
  {
    type: "text",
    title: "Garmin: що це за бренд і як його правильно позиціонувати",
    html: `<p>Garmin — американський бренд, який виріс із навігаційних GPS-рішень і з часом став одним із найсильніших гравців у спорті, outdoor, дайвінгу, гольфі, авіації та тактичних сценаріях. Назва бренду походить від імен засновників Gary Burrell та Min Kao.</p><p>Для консультації важливо одразу пояснювати, що Garmin — це не про один універсальний годинник на всіх, а про правильно підібрану серію під сценарій: біг, експедиції, щоденне здоров'я, гольф, дайвінг або tactical.</p><p>У магазині ці моделі можна везти під клієнта, тому ключовий навик продавця тут — не показати фізичну полицю, а чітко зорієнтувати по серіях і не помилитися з позиціонуванням.</p>`
  },
  {
    type: "image",
    title: "Рекомендації по вибору Garmin",
    url: "/materials/garmin-smart-watches/recommendations.png",
    caption: "Візуальний орієнтир по серіях Garmin під різні сценарії"
  },
  {
    type: "text",
    title: "Кому що радити з Garmin",
    html: `<ul><li><strong>Екстрим, туризм, експедиції:</strong> Fenix або Instinct.</li><li><strong>Ультрадистанції:</strong> Enduro.</li><li><strong>Біг і триатлон:</strong> Forerunner.</li><li><strong>Щоденне використання, здоров'я, спортзал:</strong> Vivoactive або Venu.</li><li><strong>Гольф:</strong> Approach.</li><li><strong>Дайвінг:</strong> Descent.</li><li><strong>Тактичні сценарії та служба:</strong> Tactix або Instinct Tactical.</li><li><strong>Преміум-дизайн і спеціалізація:</strong> MARQ.</li></ul><p>Найшвидший шлях до правильної рекомендації — почати не з моделі, а з питання: <strong>який вид активності або роботи для клієнта головний</strong>.</p>`
  },
  {
    type: "text",
    title: "Як відрізняються головні серії Garmin",
    html: `<h3>Outdoor і витривалість</h3><ul><li><strong>Fenix:</strong> найуніверсальніший outdoor-флагман.</li><li><strong>Epix:</strong> преміум outdoor з AMOLED.</li><li><strong>Enduro:</strong> максимум автономності.</li><li><strong>Instinct:</strong> rugged і tactical-стиль за нижчий бюджет.</li><li><strong>Tactix:</strong> tactical-преміум з вузькоспеціальними функціями.</li></ul><h3>Спорт і lifestyle</h3><ul><li><strong>Forerunner:</strong> біг, триатлон, тренувальна аналітика.</li><li><strong>Vivoactive / Venu:</strong> здоров'я, місто, спорт без перевантаження outdoor-логікою.</li></ul><h3>Спеціалізація</h3><ul><li><strong>Approach:</strong> гольф.</li><li><strong>Descent:</strong> дайвінг.</li><li><strong>MARQ:</strong> преміум-ніші: авіація, яхтинг, автоспорт, гольф, альпінізм.</li></ul>`
  },
  {
    type: "image",
    title: "Основні напрямки діяльності Garmin",
    url: "/materials/garmin-smart-watches/garmin-ecosystem.png",
    caption: "Garmin працює не лише у спорті, а й у навігації, морі, авто, авіації та outdoor-сегментах"
  },
  {
    type: "facts",
    title: "Що важливо тримати в голові під час консультації Garmin",
    items: [
      "Garmin найкраще продається через сценарій використання, а не через абстрактні характеристики.",
      "Fenix, Epix, Enduro, Instinct і Tactix легко переплутати, тому важливо розкладати їх по пріоритетах: автономність, AMOLED, rugged, tactical.",
      "Forerunner — це не просто 'ще один смарт-годинник', а дуже сильний інструмент саме для бігунів і триатлетів.",
      "Vivoactive та Venu — найзручніша точка входу для клієнта, якому потрібні здоров'я, гарний екран і щоденна носибельність.",
      "Approach і Descent продаються тільки тоді, коли є чіткий профільний запит: гольф або дайвінг.",
      "MARQ — не для масового клієнта, а для тих, хто готовий платити за історію, матеріали, ексклюзивність і вузьку спеціалізацію.",
      "Оскільки Garmin часто їде під замовлення, впевнене пояснення серії тут важливіше за фізичну демонстрацію товару."
    ]
  }
];

export const garminSmartWatchesCatalogBlocks: ModuleContentBlock[] = [
  {
    type: "text",
    title: "Garmin серії годинників у 2025 році",
    html: `<p>У цьому модулі зібрані основні серії Garmin, які найчастіше доводиться підбирати клієнтам: від бігових Forerunner до outdoor-флагманів Fenix, tactical-моделей Tactix, гольф-лінійки Approach і дайверських Descent.</p><p>Каталог побудований не за принципом "яка модель дорожча", а за логікою швидкої консультації: кому що підходить і в чому ключова різниця між серіями.</p>`
  },
  {
    type: "productCatalog",
    title: "Garmin: серії, позиціонування та ключові відмінності",
    products: garminSmartWatchesCatalog
  },
  {
    type: "text",
    title: "Швидка логіка підбору Garmin",
    html: `<ul><li><strong>Потрібні карти, міцність і outdoor-флагман:</strong> Fenix.</li><li><strong>Потрібні ті самі outdoor-можливості, але з AMOLED:</strong> Epix.</li><li><strong>Потрібна максимальна автономність:</strong> Enduro.</li><li><strong>Потрібен біг/триатлон:</strong> Forerunner.</li><li><strong>Потрібен rugged-стиль і захист:</strong> Instinct.</li><li><strong>Потрібен tactical-преміум:</strong> Tactix.</li><li><strong>Потрібен Garmin для гольфу:</strong> Approach.</li><li><strong>Потрібен дайв-годинник:</strong> Descent.</li><li><strong>Потрібен люксовий Garmin зі спеціалізацією:</strong> MARQ.</li><li><strong>Потрібен щоденний Garmin для здоров'я і тренувань:</strong> Vivoactive / Venu.</li></ul>`
  },
  {
    type: "facts",
    title: "Ключові підказки для швидкого продажу Garmin",
    items: [
      "Forerunner 255 = мультиспорт без карт; 955 / 965 = мультиспорт з картами і сильнішою аналітикою.",
      "Fenix і Epix часто продаються як пара: один для тих, хто любить MIP і батарею, інший — для тих, хто хоче AMOLED.",
      "Instinct простіше і грубіше за Fenix, але саме тому подобається частині outdoor-клієнтів.",
      "Tactix — це не просто чорний Fenix: там є tactical-логіка і спеціальні режими.",
      "Approach, Descent і MARQ не варто нав'язувати клієнту без профільного запиту — вони найсильніші саме у своїх нішах.",
      "Venu / Vivoactive — хороша відповідь клієнту, якому Garmin подобається, але Fenix або Forerunner здаються надто 'спортивними' чи складними."
    ]
  }
];

const garminSmartWatchesContent = {
  garminSmartWatchesCatalog,
  garminSmartWatchesFoundationBlocks,
  garminSmartWatchesCatalogBlocks
};

export default garminSmartWatchesContent;
