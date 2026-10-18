import type { ModuleCatalogProduct, ModuleContentBlock } from "../module-content";

export const playstationConsoleCatalog: ModuleCatalogProduct[] = [
  {
    slug: "sony-playstation-5",
    title: "Sony PlayStation 5",
    family: "Sony home console",
    summary:
      "Базова домашня консоль для клієнта, якому важливі ексклюзиви Sony, швидкий SSD, DualSense і комфортний сценарій гри вдома.",
    overview: ["Формат: домашня консоль", "SSD: 825 ГБ", "Фокус: Sony exclusives + DualSense"],
    highlights: [
      "Версії Blu-Ray Edition, Digital Edition і різні bundle-комплекти",
      "SSD до 5,5 ГБ/с для швидкого завантаження й плавного геймплею",
      "Адаптивні тригери DualSense, тактильна віддача та 3D-звук",
      "До 120 кадрів/с на 4K-дисплеях, підтримка HDMI 2.1",
      "Підтримує фізичні диски у версії з Blu-Ray-приводом",
      "Хороший вибір для клієнта, який хоче сильну домашню консоль без переходу в Pro-сегмент"
    ],
    colors: [
      {
        label: "PS5",
        imageUrl: "/materials/playstation-gaming-consoles/playstation-5.png",
        caption: "Sony PlayStation 5",
        default: true
      }
    ]
  },
  {
    slug: "sony-playstation-5-slim",
    title: "Sony PlayStation 5 Slim",
    family: "Sony home console",
    summary:
      "Компактніша версія PS5 для клієнта, який хоче сучасний домашній геймінг, але зручніші габарити й оновлений корпус.",
    overview: ["Формат: компактна домашня консоль", "Пам'ять: 1 ТБ SSD", "Фокус: менші габарити"],
    highlights: [
      "Менша і легша за класичну PS5, зручніше вписується в інтер'єр",
      "Від'ємний дисковод можна додати або замінити при потребі",
      "AMD Ryzen Zen 2, 16 ГБ GDDR6 і RDNA 2 залишаються на рівні повноцінної PS5",
      "Модернізовані USB-порти й актуальніший фізичний дизайн",
      "Підтримує 4K-геймплей та всі ключові фішки покоління PlayStation 5",
      "Добре заходить клієнту, якому важливі компактність, сучасний вигляд і екосистема Sony"
    ],
    colors: [
      {
        label: "PS5 Slim",
        imageUrl: "/materials/playstation-gaming-consoles/playstation-5-slim.png",
        caption: "Sony PlayStation 5 Slim",
        default: true
      }
    ]
  },
  {
    slug: "sony-playstation-5-pro",
    title: "Sony PlayStation 5 Pro",
    family: "Sony flagship console",
    summary:
      "Флагманський варіант PS5 для ентузіастів, яким потрібні максимум графіки, більший SSD і сильніший запас продуктивності.",
    overview: ["Формат: flagship home console", "SSD: 2 ТБ", "Фокус: PSSR + максимум графіки"],
    highlights: [
      "AMD Ryzen Zen 2 до 3.85 ГГц і графіка до 16.7 TFLOPS",
      "16 ГБ GDDR6 для графіки та додаткові 2 ГБ DDR5 під ОС",
      "PSSR для AI-апскейлінгу й кращої деталізації картинки",
      "Сильніший Ray Tracing, VRR і більш плавний геймплей у вимогливих іграх",
      "2 ТБ SSD і Game Boost для великої бібліотеки PS4/PS5-ігор",
      "Найкращий варіант, коли клієнт каже: 'хочу максимум із PlayStation без компромісів'"
    ],
    colors: [
      {
        label: "PS5 Pro",
        imageUrl: "/materials/playstation-gaming-consoles/playstation-5-pro.png",
        caption: "Sony PlayStation 5 Pro",
        default: true
      }
    ]
  },
  {
    slug: "sony-playstation-vr2",
    title: "Sony PlayStation VR2",
    family: "Sony VR ecosystem",
    summary:
      "VR-рішення для PlayStation 5, яке потрібне клієнтам, що хочуть максимальне занурення, eye-tracking і повноцінний віртуальний геймінг.",
    overview: ["Формат: VR-гарнітура для PS5", "Екран: OLED HDR", "Фокус: immersion + eye tracking"],
    highlights: [
      "OLED HDR із роздільною здатністю 2000×2040 на око та кутом огляду 110°",
      "Контролери Sense з точним відстеженням рухів і тактильними ефектами",
      "4 камери в гарнітурі, тому зовнішня камера для трекінгу не потрібна",
      "Eye-tracking і foveated rendering для максимальної якості там, куди дивиться користувач",
      "Працює з PlayStation 5 через USB-C кабель довжиною близько 4,5 м",
      "Сильний апсейл для клієнта, який уже бере PS5 і хоче вау-ефект нового досвіду"
    ],
    colors: [
      {
        label: "PS VR2",
        imageUrl: "/materials/playstation-gaming-consoles/playstation-vr2.png",
        caption: "Sony PlayStation VR2",
        default: true
      }
    ]
  }
];

export const xboxConsoleCatalog: ModuleCatalogProduct[] = [
  {
    slug: "microsoft-xbox-series-s",
    title: "Microsoft Xbox Series S",
    family: "Xbox console",
    summary:
      "Найкращий Xbox-вхід для бюджету, цифрової бібліотеки й Game Pass, коли клієнту не критичні 4K та дисковод.",
    overview: ["Формат: цифрова домашня консоль", "Роздільна здатність: до 1440p", "Фокус: доступний Game Pass"],
    highlights: [
      "Компактна й легка, зручна для невеликих просторів або перевезення",
      "До 1440p і до 120 fps у вибраних проєктах",
      "10 ГБ RAM і SSD 512 ГБ для швидкого завантаження",
      "Quick Resume, VRR та сучасний Xbox-сценарій без дисків",
      "Добре поєднується з Game Pass як аргументом доступу до великої бібліотеки",
      "Правильний вибір для клієнта, якому потрібна 'недорога консоль і багато ігор одразу'"
    ],
    colors: [
      {
        label: "Series S",
        imageUrl: "/materials/playstation-gaming-consoles/xbox-series-s.png",
        caption: "Microsoft Xbox Series S",
        default: true
      }
    ]
  },
  {
    slug: "microsoft-xbox-series-x",
    title: "Microsoft Xbox Series X",
    family: "Xbox console",
    summary:
      "Флагманський Xbox для 4K-геймінгу, дискових ігор і клієнтів, які хочуть максимум від екосистеми Microsoft.",
    overview: ["Формат: flagship home console", "SSD: 1 ТБ", "Фокус: 4K + Blu-Ray + Game Pass"],
    highlights: [
      "4K/60 fps і до 120 fps у частині ігор",
      "16 ГБ RAM, 1 ТБ SSD і офіційні карти розширення пам'яті",
      "Blu-Ray привід дає сценарій фізичних копій і меншу залежність від онлайн-магазину",
      "Ray Tracing, Quick Resume, Dolby Vision та Dolby Atmos",
      "Краще підходить для великого ТВ і клієнтів, які хочуть флагманську Xbox-продуктивність",
      "Сильний аргумент, коли людина вибирає між потужністю, зручністю Game Pass і дисковою бібліотекою"
    ],
    colors: [
      {
        label: "Series X",
        imageUrl: "/materials/playstation-gaming-consoles/xbox-series-x.png",
        caption: "Microsoft Xbox Series X",
        default: true
      }
    ]
  }
];

export const portableGamingCatalog: ModuleCatalogProduct[] = [
  {
    slug: "steam-deck",
    title: "Steam Deck",
    family: "Handheld PC",
    summary:
      "Портативний ПК для Steam-користувачів, який добре заходить клієнтам, що хочуть свою PC-бібліотеку в handheld-форматі.",
    overview: ["Формат: handheld PC", "ОС: SteamOS 3.0", "Фокус: Steam library on the go"],
    highlights: [
      "APU AMD Zen 2 + RDNA 2 і 16 ГБ LPDDR5",
      "LCD 7″ 60 Гц або OLED 7.4″ HDR до 90 Гц",
      "Proton запускає багато Windows-ігор без окремого портингу",
      "Cloud Saves, Remote Play, Desktop Mode та можливість dual-boot Windows",
      "microSD є у всіх версіях, док-станція дає сценарій настільного ПК",
      "Ідеальний варіант для клієнта, який каже: 'я PC-геймер і хочу грати в дорозі'"
    ],
    colors: [
      {
        label: "Steam Deck",
        imageUrl: "/materials/playstation-gaming-consoles/steam-deck.png",
        caption: "Steam Deck",
        default: true
      }
    ]
  },
  {
    slug: "nintendo-switch-family",
    title: "Nintendo Switch Family",
    family: "Hybrid console",
    summary:
      "Гібридна сімейна платформа для дому та подорожей із сильними ексклюзивами Nintendo і зручним мультиплеєром.",
    overview: ["Формат: hybrid / portable / TV", "Екран: 5.5–7″", "Фокус: family gaming + Nintendo exclusives"],
    highlights: [
      "Швидке перемикання між портативним, настільним і TV-режимами",
      "Standard, Lite та OLED покривають різні бюджети й сценарії використання",
      "Joy-Con з HD Rumble, сенсорами руху та локальним мультиплеєром",
      "Mario, Zelda, Animal Crossing, Pokemon і Metroid як головні ексклюзиви платформи",
      "Nintendo Switch Online додає мультиплеєр, хмарні сейви та класичні бібліотеки NES/SNES",
      "Найкращий варіант для сім'ї, казуального геймінгу та клієнта, який любить саме ігри Nintendo"
    ],
    colors: [
      {
        label: "Nintendo Switch",
        imageUrl: "/materials/playstation-gaming-consoles/nintendo-switch.png",
        caption: "Nintendo Switch",
        default: true
      }
    ]
  },
  {
    slug: "asus-rog-ally-family",
    title: "Asus ROG Ally / Ally X",
    family: "Handheld Windows PC",
    summary:
      "Windows-портатив для клієнта, якому потрібні Steam, Game Pass, Epic Games і максимально ПК-шний сценарій у handheld-форматі.",
    overview: ["Формат: handheld Windows PC", "Екран: 7″ FHD 120 Гц", "Фокус: Windows + Game Pass + Steam"],
    highlights: [
      "AMD Z1 Extreme або Z1, дисплей 7″ FHD 120 Гц із FreeSync і Dolby Vision",
      "Windows 11 Home дає звичний сценарій Steam, Game Pass, Epic Games та інших лаунчерів",
      "ROG Ally X додає 80 Wh батарею, 24 ГБ RAM і більше SSD",
      "Armoury Crate SE спрощує профілі продуктивності та оновлення",
      "2 × USB-C у Ally X, один із них Thunderbolt 4, плюс сценарій XG Mobile eGPU",
      "Потрібен тоді, коли клієнт хоче 'портативний Windows-ПК для будь-яких ігор, а не лише консольну екосистему'"
    ],
    colors: [
      {
        label: "ROG Ally",
        imageUrl: "/materials/playstation-gaming-consoles/rog-ally.png",
        caption: "Asus ROG Ally / Ally X",
        default: true
      }
    ]
  }
];

export const gamingConsolesFoundationBlocks: ModuleContentBlock[] = [
  {
    type: "text",
    title: "Ігрові консолі",
    html: `<p>Привіт, командо! Ласкаво просимо до навчального матеріалу з ігрових консолей! Тут ми розберемо сучасні платформи, їх відмінності та як це впливає на вибір клієнта. Охопимо стаціонарні (домашні), портативні та гібридні рішення, а також ключові критерії для геймерів: продуктивність, ексклюзиви, екосистеми сервісів, підключення та дизайн.</p><p>Категорія ігрових консолей давно вийшла за межі простої відповіді «PlayStation чи Xbox». У консультації ми працюємо від сценарію: <strong>домашній AAA-геймінг</strong>, <strong>бюджетна цифрова консоль</strong>, <strong>портативний PC-геймінг</strong>, <strong>сімейна гібридна платформа</strong> або <strong>VR-досвід</strong>.</p>`
  },
  {
    type: "facts",
    title: "Що уточнити перед рекомендацією консолі",
    items: [
      "Де клієнт буде грати: лише вдома, у поїздках чи в змішаному сценарії.",
      "Чи важливі ексклюзиви Sony, Nintendo або доступ до PC-бібліотеки.",
      "Чи потрібен дисковод або достатньо лише цифрової бібліотеки.",
      "Наскільки важливі підписки та сервіси на кшталт Game Pass або Nintendo Switch Online.",
      "Чи потрібні додаткові аксесуари: другий геймпад, гарнітура, зарядна станція, док або VR."
    ]
  },
  {
    type: "image",
    title: "Аксесуари PlayStation 5",
    url: "/materials/playstation-gaming-consoles/playstation-5-accessories.png",
    caption: "Другий DualSense, зарядна станція, гарнітура та інші аксесуари для PlayStation 5"
  },
  {
    type: "text",
    title: "Як швидко розвести платформи по сценаріях",
    html: `<h3>Sony PlayStation</h3><ul><li><strong>PS5 / PS5 Slim / PS5 Pro:</strong> сильний домашній AAA-геймінг, ексклюзиви Sony, DualSense, 4K і преміальний вау-ефект.</li><li><strong>PS VR2:</strong> окремий допродаж для клієнта, який хоче новий рівень занурення.</li></ul><h3>Microsoft Xbox</h3><ul><li><strong>Series S:</strong> бюджетний вхід у геймінг через цифрову бібліотеку й Game Pass.</li><li><strong>Series X:</strong> флагманський Xbox із дисководом і сильним 4K-сценарієм.</li></ul><h3>Steam Deck і ROG Ally</h3><ul><li><strong>Steam Deck:</strong> handheld для Steam-користувача й PC-бібліотеки.</li><li><strong>ROG Ally / Ally X:</strong> Windows-портатив, коли потрібна максимальна сумісність із різними лаунчерами.</li></ul><h3>Nintendo Switch</h3><ul><li><strong>Switch family:</strong> сімейний, портативний і гібридний геймінг, ексклюзиви Nintendo та мультиплеєр.</li></ul>`
  },
  {
    type: "image",
    title: "Карта вибору консолі",
    url: "/materials/playstation-gaming-consoles/gaming-console-guide.png",
    caption: "Швидка візуальна логіка вибору консолі під тип користувача"
  },
  {
    type: "facts",
    title: "Швидка логіка підбору консолі",
    items: [
      "PS5 Slim = домашня консоль для більшості клієнтів, яким важливі Sony-ігри та зручніший корпус.",
      "PS5 Pro = максимум графіки, 2 ТБ SSD і флагманський PlayStation-сценарій.",
      "Xbox Series S = найсильніший бюджетний digital-вхід у консольний геймінг.",
      "Xbox Series X = флагманський Xbox із дисководом, 4K і Game Pass.",
      "Steam Deck = PC-геймінг у дорозі для користувача Steam.",
      "Nintendo Switch = сімейна, гібридна й travel-friendly платформа з ексклюзивами Nintendo.",
      "ROG Ally / Ally X = handheld Windows-ПК для клієнта, який хоче максимум сумісності та ПК-функціональності."
    ]
  }
];

export const gamingConsolesCatalogBlocks: ModuleContentBlock[] = [
  {
    type: "text",
    title: "Каталог сучасних ігрових платформ",
    html: `<p>Порівняйте домашні та портативні ігрові платформи: <strong>PlayStation 5</strong>, <strong>Xbox Series S / X</strong>, <strong>Steam Deck</strong>, <strong>Nintendo Switch</strong> та <strong>Asus ROG Ally / Ally X</strong>. Окремо розгляньте <strong>PlayStation VR2</strong> як гарнітуру віртуальної реальності.</p><p>Почніть із потрібних ігор, місця гри та наявних пристроїв. Потім уточніть формат придбання ігор, підписки, кількість гравців і потрібні аксесуари.</p>`
  },
  {
    type: "productCatalog",
    title: "Sony PlayStation 5 та PlayStation VR2",
    products: playstationConsoleCatalog
  },
  {
    type: "facts",
    title: "Аксесуари й допродаж для PlayStation 5",
    items: [
      "Другий DualSense актуальний навіть одному геймеру, щоб не випадати з гри під час зарядки.",
      "Зарядна станція для двох геймпадів не займає USB-порти консолі.",
      "DualSense Edge продається як premium-контролер із глибшим налаштуванням.",
      "Pulse 3D і PULSE Elite / Elevate закривають сценарій 3D-звуку та повнішого занурення.",
      "HD Camera і Media Remote логічно допродаються під стрімінг і мультимедіа."
    ]
  },
  {
    type: "productCatalog",
    title: "Microsoft Xbox Series",
    products: xboxConsoleCatalog
  },
  {
    type: "image",
    title: "Аксесуари Xbox",
    url: "/materials/playstation-gaming-consoles/xbox-accessories.png",
    caption: "Геймпади, Elite Series 2, заряджання та розширення пам'яті для Xbox"
  },
  {
    type: "facts",
    title: "Що продавати разом з Xbox",
    items: [
      "Другий Xbox Wireless Controller або Elite Series 2 для активнішого сценарію гри.",
      "Rechargeable Battery Pack чи зарядна станція прибирають проблему батарейок.",
      "Xbox Wireless Headset добре закриває сценарій голосового чату й занурення.",
      "Seagate Expansion Card є ключовим аргументом, коли клієнту бракує внутрішньої пам'яті."
    ]
  },
  {
    type: "productCatalog",
    title: "Портативні та гібридні рішення",
    products: portableGamingCatalog
  },
  {
    type: "facts",
    title: "Кому що рекомендувати коротко",
    items: [
      "Для фаната ексклюзивів Sony і домашнього AAA-геймінгу: PS5 Slim або PS5 Pro.",
      "Для клієнта, якому важливі 4K, дисковод і Game Pass: Xbox Series X.",
      "Для бюджету та цифрової моделі з великою підпискою: Xbox Series S.",
      "Для PC-геймера зі Steam-бібліотекою: Steam Deck.",
      "Для handheld-сценарію з Windows, Steam, Game Pass і Epic: ROG Ally / Ally X.",
      "Для сім'ї, подорожей та ігор Nintendo: Switch family."
    ]
  },
  {
    type: "text",
    title: "Sony PlayStation 5 — повний затверджений матеріал",
    html: `<h3>Лінійка моделей</h3><ul><li><strong>PS5 Blu‑Ray Edition:</strong> версія з дисководом Blu‑Ray для фізичних копій.</li><li><strong>PS5 Digital Edition:</strong> повністю цифрова версія без дисководу, покупки через PlayStation Store.</li><li><strong>PlayStation Bundle:</strong> комплекти з додатковою грою, джойстиком тощо.</li></ul><h3>Консоль PS5 — базові можливості</h3><ul><li><strong>Швидкісний SSD:</strong> миттєве завантаження та плавний геймплей (до 5,5 ГБ/с).</li><li><strong>Занурення:</strong> тактильна віддача, адаптивні тригери DualSense, 3D‑звук.</li><li><strong>Відео:</strong> до 120 кадрів/с на 4K екранах з 120 Гц; підтримка 8K через HDMI 2.1.</li><li><strong>Сумісність:</strong> оновлення дискових ігор до цифрових версій для PS5.</li></ul><h3>Інтерфейси, пам’ять та комплект</h3><ul><li><strong>Порти:</strong> AUX, HDMI, USB; привід Blu‑Ray (крім Digital Edition).</li><li><strong>Пам’ять:</strong> SSD 825 ГБ.</li><li><strong>Комплект:</strong> PS5, DualSense, кабель живлення, HDMI (2.1), USB‑перехідник.</li></ul><h3>PlayStation 5 Slim</h3><ul><li><strong>Габарити:</strong> менша і легша, сучасніший дизайн, легкі матеріали з тією ж робочою температурою.</li><li><strong>Порти:</strong> модернізовані USB для швидших передач.</li><li><strong>Дисковод:</strong> від’ємний дисковод — легко замінюється при потребі.</li></ul><h3>Технічні характеристики</h3><ul><li><strong>CPU:</strong> AMD Ryzen Zen 2, 8 ядер/16 потоків, 3.5 ГГц.</li><li><strong>RAM:</strong> 16 ГБ GDDR6.</li><li><strong>GPU:</strong> AMD RDNA 2, 2.23 ГГц (10.3 TFLOPS).</li><li><strong>Інтерфейси:</strong> 2× USB‑C, 3× USB‑A, 1× HDMI.</li></ul><h3>PlayStation 5 Pro</h3><ul><li><strong>CPU:</strong> AMD Ryzen Zen 2, 8 ядер/16 потоків, до 3.85 ГГц.</li><li><strong>GPU:</strong> AMD RDNA 3, 16.7 TFLOPS (+45% швидший рендеринг vs PS5).</li><li><strong>Пам’ять:</strong> 16 ГБ GDDR6 (графіка) + 2 ГБ DDR5 (ОС).</li><li><strong>SSD:</strong> 2 ТБ.</li></ul><h3>Ключові особливості</h3><ul><li><strong>Графіка і FPS:</strong> більше CU (+67%), швидша пам’ять — плавніший геймплей і якість.</li><li><strong>Ray Tracing:</strong> передові алгоритми освітлення та відображень.</li><li><strong>AI‑апскейлінг PSSR:</strong> підвищення роздільної здатності та деталізації.</li><li><strong>Game Boost:</strong> покращення для понад 8500 ігор PS4.</li><li><strong>Мережі:</strong> підтримка Wi‑Fi 7, VRR, додаткові USB‑C порти.</li></ul><h3>Порівняння з PS5</h3><ul><li><strong>GPU:</strong> потужніший графічний процесор.</li><li><strong>Пам’ять:</strong> 2 ТБ SSD vs 825 ГБ у стандартній PS5.</li><li><strong>Охолодження:</strong> оптимізоване тепловідведення для стабільності.</li></ul><h3>Аксесуари для PS5</h3><ul><li><strong>Другий геймпад:</strong> актуально навіть для одного геймера — під час зарядки основного.</li><li><strong>Станція заряджання:</strong> для двох геймпадів без зайняття USB‑портів.</li><li><strong>DualSense Edge:</strong> преміальний контролер з розширеним налаштуванням і комфортом.</li><li><strong>Pulse 3D:</strong> бездротова гарнітура з шумозаглушенням (до 12 год), Tempest 3D AudioTech.</li><li><strong>PULSE Elevate:</strong> об’ємний 3D-звук з глибокими басами, чіткими деталями та миттєвим підключенням для повного занурення в гру.</li><li><strong>HD Camera:</strong> Full HD камера зі зняттям фону — для стрімерів.</li><li><strong>Media Remote:</strong> ПДУ для мультимедіа та керування TV.</li></ul>`
  },
  {
    type: "text",
    title: "Sony PlayStation VR2 — повний затверджений матеріал",
    html: `<h3>Особливості та дизайн</h3><ul><li><strong>Легкість:</strong> 560 г, відсутність дискомфорту.</li><li><strong>Контролери Sense:</strong> точне відтворення рухів і жестів, аналогові стики, кнопки дій, “захоплення”.</li><li><strong>Відстеження:</strong> 4 камери в гарнітурі — зовнішня камера не потрібна.</li><li><strong>Комфорт:</strong> лінзи Френеля, вентиляція, регульовані ремінці.</li></ul><h3>Комплектація</h3><ul><li><strong>Гарнітура VR, контролери VR2 Sense R/L з ремінцями.</strong></li><li><strong>Кабель для підключення та зарядки, навушники з амбушурами.</strong></li><li><strong>Документація:</strong> інструкції, гарантія.</li></ul><h3>Підключення та екран</h3><ul><li><strong>Підключення:</strong> кабельна гарнітура — потрібна PS5; USB‑C довжиною ~4,5 м.</li><li><strong>OLED HDR:</strong> 2000×2040 на око, кут огляду 110°, яскравість і контрастність.</li><li><strong>Звук:</strong> вкладиші в комплекті, ізольований звук.</li></ul><h3>Унікальні функції</h3><ul><li><strong>Вібрація гарнітури:</strong> тактильні ефекти на обличчі в деяких іграх.</li><li><strong>Eye‑tracking:</strong> відстеження погляду, foveated rendering — максимальна якість там, куди дивишся.</li><li><strong>Скан кімнати:</strong> визначення ігрової зони, відображення перешкод полігонами.</li></ul><h3>Контент та сумісність</h3><ul><li><strong>VR‑тільки:</strong> окремі ігри доступні лише у VR.</li><li><strong>PS5‑ігри з VR:</strong> безкоштовні оновлення для PSVR2 (No Man’s Sky, Gran Turismo 7, Resident Evil Village).</li><li><strong>Несумісність:</strong> старі PSVR‑ігри не працюють автоматично — потрібні оновлення.</li></ul>`
  },
  {
    type: "text",
    title: "Microsoft Xbox — Series S і Series X — повний затверджений матеріал",
    html: `<h3>Архітектура та пам’ять</h3><ul><li><strong>Zen 2 (AMD):</strong> спільна платформа для обох моделей.</li><li><strong>RAM:</strong> Series X — 16 ГБ, Series S — 10 ГБ.</li><li><strong>SSD:</strong> Series X — 1 ТБ (доступно ~800 ГБ), Series S — 512 ГБ (доступно ~364 ГБ).</li><li><strong>Розширення:</strong> офіційні карти розширення; зовнішні SSD/HDD для старих ігор.</li></ul><h3>Роздільна здатність та привід</h3><ul><li><strong>Series S:</strong> до 1440p, 120 fps для деяких проєктів; цифрові ігри тільки з Мережі.</li><li><strong>Series X:</strong> 4K, 120 fps, привід Blu‑Ray — менша залежність від онлайну, можливість перепродажу дисків.</li></ul><h3>Дизайн та практичність</h3><ul><li><strong>Розміри:</strong> Series S — вдвічі менша і легша ніж X; зручна для транспортування.</li><li><strong>Матеріал:</strong> матовий пластик; S практичніша (менше видно сліди), чорна X — більш марка.</li></ul><h3>Xbox Series S</h3><ul><li><strong>Позиціонування:</strong> компактна, доступна, цифрова.</li><li><strong>Геймплей:</strong> до 1440p, 60 fps (до 120 fps для окремих ігор).</li><li><strong>SSD:</strong> 512 ГБ, швидке завантаження; Ray Tracing, VRR, Quick Resume.</li></ul><h3>Xbox Series X</h3><ul><li><strong>Позиціонування:</strong> флагманська продуктивність, дисковод.</li><li><strong>Геймплей:</strong> 4K/60 fps, до 120 fps в окремих проєктах.</li><li><strong>Технології:</strong> Ray Tracing, Quick Resume, Dolby Vision/Atmos.</li><li><strong>SSD:</strong> 1 ТБ із підтримкою розширення.</li></ul><h3>Аксесуари для Xbox</h3><ul><li><strong>Геймпади:</strong> Xbox Wireless Controller різних кольорів; Elite Series 2 для про‑гри.</li><li><strong>Живлення:</strong> Rechargeable Battery Pack; зарядні станції; USB‑C кабелі.</li><li><strong>Гарнітури:</strong> Xbox Wireless Headset; сумісні гарнітури (Bluetooth, адаптер).</li><li><strong>Пам’ять:</strong> Seagate Expansion Card (офіційна); зовнішні SSD/HDD.</li></ul>`
  },
  {
    type: "text",
    title: "Steam Deck — повний затверджений матеріал",
    html: `<h3>Платформа та дисплеї</h3><ul><li><strong>APU:</strong> AMD (Zen 2 + RDNA 2), AAA‑ігри на 1280×800.</li><li><strong>RAM:</strong> 16 ГБ LPDDR5 (5500 MT/s).</li><li><strong>Дисплеї:</strong> LCD 7″ 60 Гц; OLED 7.4″ HDR до 90 Гц — яскравіше, контрастніше.</li><li><strong>Зв’язок:</strong> Wi‑Fi 5 (LCD) або 6E (OLED), Bluetooth 5.0.</li><li><strong>Акумулятор:</strong> 40 Wh (LCD) — 2–8 год; 50 Wh (OLED) — 3–12 год.</li></ul><h3>Конфігурації</h3><ul><li><strong>64 ГБ eMMC:</strong> бюджетно.</li><li><strong>256/512 ГБ NVMe SSD:</strong> швидко та містко.</li><li><strong>512 ГБ OLED / 1 ТБ OLED:</strong> OLED‑екран, швидкий SSD, більше пам’яті, антиблікове скло.</li><li><strong>microSD:</strong> слот у всіх моделях.</li></ul><h3>SteamOS та можливості</h3><ul><li><strong>SteamOS 3.0:</strong> оптимізований під портатив.</li><li><strong>Proton:</strong> Windows‑ігри без портингу.</li><li><strong>Deck Verified:</strong> мітки сумісності (Verified/Playable/Unsupported).</li><li><strong>Cloud Saves/Remote Play:</strong> продовження прогресу, стрім з ПК.</li><li><strong>Desktop Mode:</strong> Linux‑десктоп, емулі, софт, dual‑boot Windows.</li></ul><h3>Аксесуари</h3><ul><li><strong>Docking Station:</strong> HDMI, DP, Ethernet, USB, FreeSync — як настільний ПК.</li><li><strong>Чохли/сумки:</strong> захист і відсіки для аксесуарів.</li><li><strong>Зарядки 45 Вт, microSD UHS‑I/II, захисні плівки:</strong> для зручності й розширення.</li></ul>`
  },
  {
    type: "text",
    title: "Nintendo Switch — повний затверджений матеріал",
    html: `<h3>Особливості та сервіси</h3><ul><li><strong>Форм‑фактор:</strong> швидке перемикання між портативним, настільним і TV‑режимами.</li><li><strong>Joy‑Con:</strong> HD Rumble, сенсори руху, локальний/мережевий мультиплеєр.</li><li><strong>Ексклюзиви:</strong> Mario, Zelda, Animal Crossing, Pokémon, Metroid.</li><li><strong>Сервіси:</strong> eShop; Nintendo Switch Online (NES/SNES, хмарні сейви, мультиплеєр).</li></ul><h3>Платформа та моделі</h3><ul><li><strong>Процесор/графіка:</strong> NVIDIA Tegra (ARM), оптимізація під енергоефективність.</li><li><strong>RAM:</strong> 4 ГБ LPDDR4.</li><li><strong>Дисплеї:</strong> Standard — 6.2″ LCD; Lite — 5.5″ LCD; OLED — 7″ OLED.</li><li><strong>Сховище:</strong> 32 ГБ (Standard/OLED), 64 ГБ (Lite); microSDXC.</li><li><strong>Акумулятор:</strong> ~4.5–9 год залежно від моделі й навантаження.</li><li><strong>Порти:</strong> USB‑C, 3.5 мм аудіо, Bluetooth, Wi‑Fi 5.</li></ul><h3>Варіанти</h3><ul><li><strong>Switch Standard:</strong> портатив+TV, док‑станція.</li><li><strong>Switch Lite:</strong> тільки портатив, вбудовані Joy‑Con, компактний.</li><li><strong>Switch OLED:</strong> 7″ OLED, ширша підставка, LAN‑порт у доку, краща аудіо.</li></ul><h3>Активності та інтерфейс</h3><ul><li><strong>Сімейна гра:</strong> до 8 консолей локально, до 4 гравців на одному екрані.</li><li><strong>Онлайн:</strong> класика NES/SNES, голосовий чат (мобіл. додаток), хмарні сейви.</li><li><strong>UI:</strong> проста навігація по бібліотеці, швидкий доступ до контролерів і друзів.</li></ul><h3>Аксесуари</h3><ul><li><strong>Pro Controller:</strong> ергономіка і тривала робота.</li><li><strong>Joy‑Con Strap/Grip:</strong> комфорт і безпека.</li><li><strong>Док‑станція:</strong> запасний або замінний.</li><li><strong>microSDXC:</strong> розширення бібліотеки.</li><li><strong>Чохли/кейси:</strong> захист консолі й контролерів.</li><li><strong>Зарядна станція Joy‑Con:</strong> одночасна зарядка.</li></ul>`
  },
  {
    type: "text",
    title: "Asus ROG Ally та Ally X — повний затверджений матеріал",
    html: `<h3>Платформа та дисплей</h3><ul><li><strong>CPU/GPU:</strong> Z1 Extreme (8C/16T, до 5.10 ГГц, RDNA 3 12 CU ~8.6 TFLOPs) або Z1 (6C/12T, RDNA 3 4 CU ~2.56 TFLOPs).</li><li><strong>RAM:</strong> 16 ГБ LPDDR5‑6400.</li><li><strong>Дисплей:</strong> 7″ IPS‑LCD FHD (1920×1080), до 120 Гц, 500 ніт, FreeSync, Dolby Vision.</li><li><strong>Зв’язок:</strong> Wi‑Fi 6E, Bluetooth 5.2.</li><li><strong>Акумулятор:</strong> 40 Wh — ~2–3 год (Turbo), ~4–8 год (Performance).</li></ul><h3>Конфігурації та розширення</h3><ul><li><strong>SSD:</strong> 512 ГБ NVMe.</li><li><strong>Слоти:</strong> M.2 2230 Gen4x4; microSD UHS‑II.</li><li><strong>ROG Ally X:</strong> темний колір, збільшена автономність, більше пам’яті, модернізована ергономіка і порти.</li></ul><h3>Ally X — ключові покращення</h3><ul><li><strong>Акумулятор:</strong> 80 Wh (проти 40 Wh) — до 8–10 год (Performance), 15+ год (Power‑Saving).</li><li><strong>RAM/SSD:</strong> 24 ГБ LPDDR5 (7500 MT/s); 1/2 ТБ NVMe SSD.</li><li><strong>Охолодження:</strong> більші вентилятори, оптимізований потік повітря — мінус 5–10 °C.</li><li><strong>Ергономіка:</strong> виступи 4.5 мм на ручках, зміщена вага, 2× USB‑C (один Thunderbolt 4).</li><li><strong>Armoury Crate SE:</strong> швидші оновлення BIOS/драйверів, прості профілі продуктивності.</li></ul><h3>Windows 11 та екосистема</h3><ul><li><strong>Windows 11 Home:</strong> повноцінний десктоп, Steam, Game Pass, Epic Games.</li><li><strong>Armoury Crate SE:</strong> керування профілями і вентиляторами.</li><li><strong>ROG XG Mobile Dock:</strong> eGPU‑док (PCIe 4.0 ×8), HDMI/USB/Ethernet/FreeSync — використання як настільного ПК.</li></ul>`
  },
  {
    type: "text",
    title: "Яку консоль обрати клієнту — повний затверджений матеріал",
    html: `<h3>Сценарії та ключові відмінності</h3><ul><li><strong>Steam Deck:</strong> для PC‑геймерів, портативний ПК зі SteamOS/Proton, десктоп‑режим, microSD, 2–12 год автономності, док для монітора.</li><li><strong>PS5 Slim:</strong> фанати ексклюзивів Sony, сімейні геймери, компактність; 4K/120 fps, 1 ТБ SSD, трасування променів, USB‑C спереду, Wi‑Fi 5.</li><li><strong>PS5 Pro:</strong> ентузіасти, максимум графіки і 8K/VRR; ~16.7 TFLOPs, 2 ТБ SSD, Wi‑Fi 7, AI‑масштабування PSSR, Game Boost.</li><li><strong>Xbox Series S:</strong> бюджетно, Game Pass, без 4K і дисководу; 1440p/120 fps, SSD, повна сумісність.</li><li><strong>Xbox Series X:</strong> флагман 4K/120 fps, дисковод, Game Pass; ~12 TFLOPs, 1 ТБ SSD, Wi‑Fi 6, глибока сумісність.</li><li><strong>Nintendo Switch (Standard/Lite/OLED):</strong> сім’ї, казуальні геймери, фанати Nintendo; гібридний форм‑фактор, Joy‑Con, 4.5–9 год автономності, OLED — 7″+LAN.</li><li><strong>Asus ROG Ally / Ally X:</strong> повноцінний Windows‑ПК у портативі; Z1/Z1 Extreme, 7″ 120 Гц FHD, Wi‑Fi 6E, Armoury Crate, слоти M.2/microSD, XG Mobile eGPU.</li></ul><h3>Коротко по вибору</h3><ul><li><strong>ПК‑геймінг на ходу:</strong> Steam Deck.</li><li><strong>Домашня сімейна консоль з ексклюзивами Sony:</strong> PS5 Slim.</li><li><strong>Максимум графіки і продуктивності:</strong> PS5 Pro.</li><li><strong>Бюджет і цифровий доступ до сотень ігор:</strong> Xbox Series S.</li><li><strong>Флагман з 4K, дисководом і Game Pass:</strong> Xbox Series X.</li><li><strong>Універсальна платформа для дому і подорожей:</strong> Nintendo Switch.</li><li><strong>Портативний Windows‑ПК для будь‑яких ігор:</strong> Asus ROG Ally / Ally X.</li></ul>`
  }
];

const playstationGamingConsolesContent = {
  playstationConsoleCatalog,
  xboxConsoleCatalog,
  portableGamingCatalog,
  gamingConsolesFoundationBlocks,
  gamingConsolesCatalogBlocks
};

export default playstationGamingConsolesContent;
