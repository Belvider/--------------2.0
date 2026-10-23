import type { ModuleCatalogProduct, ModuleContentBlock } from "../module-content";

export const playstationConsoleCatalog: ModuleCatalogProduct[] = [
  {
    "slug": "sony-playstation-5",
    "title": "Sony PlayStation 5",
    "colors": [
      {
        "label": "PS5",
        "caption": "Sony PlayStation 5",
        "default": true,
        "imageUrl": "/materials/playstation-gaming-consoles/playstation-5.png"
      }
    ],
    "family": "Sony home console",
    "summary": "Базова домашня консоль для клієнта, якому важливі ексклюзиви Sony, швидкий SSD, DualSense і комфортний сценарій гри вдома.",
    "overview": [
      "Формат: домашня консоль",
      "SSD початкової PS5: 825 ГБ",
      "Бібліотека: PlayStation"
    ],
    "highlights": [
      "Початкова PS5 має дискову та Digital-версію; комплектації з іграми відрізняються.",
      "Швидкісний SSD скорочує завантаження; він не гарантує однаковий FPS у всіх іграх.",
      "Адаптивні тригери й тактильні ефекти DualSense працюють у підтримуваних іграх.",
      "4K та до 120 кадрів/с залежать від гри, режиму й сумісного дисплея.",
      "Для дискових ігор потрібен дисковод; частина ігор потребує завантаження даних та оновлень.",
      "Обсяг накопичувача й порти не слід переносити з початкової PS5 на всі Slim-ревізії."
    ]
  },
  {
    "slug": "sony-playstation-5-slim",
    "title": "Sony PlayStation 5 Slim",
    "colors": [
      {
        "label": "PS5 Slim",
        "caption": "Sony PlayStation 5 Slim",
        "default": true,
        "imageUrl": "/materials/playstation-gaming-consoles/playstation-5-slim.png"
      }
    ],
    "family": "Sony home console",
    "summary": "Компактніша версія PS5 для клієнта, який хоче сучасний домашній геймінг, але зручніші габарити й оновлений корпус.",
    "overview": [
      "Формат: компактна домашня консоль",
      "SSD: 825 ГБ або 1 ТБ за версією",
      "Продуктивність: клас PS5"
    ],
    "highlights": [
      "Компактніший корпус порівняно з початковою PS5.",
      "Дискова та Digital-версія відрізняються приводом і можуть мати різний SSD.",
      "Сумісний знімний дисковод для Digital купують окремо; перше сполучення потребує інтернету.",
      "Два USB-C спереду та два USB-A ззаду; це не п’ять USB-портів.",
      "Графічні можливості класу PS5; компактність не означає продуктивність рівня Pro.",
      "Перевіряйте артикул, комплект контролерів, гру та підставку перед продажем."
    ]
  },
  {
    "slug": "sony-playstation-5-pro",
    "title": "Sony PlayStation 5 Pro",
    "colors": [
      {
        "label": "PS5 Pro",
        "caption": "Sony PlayStation 5 Pro",
        "default": true,
        "imageUrl": "/materials/playstation-gaming-consoles/playstation-5-pro.png"
      }
    ],
    "family": "Sony flagship console",
    "summary": "Флагманський варіант PS5 для ентузіастів, яким потрібні максимум графіки, більший SSD і сильніший запас продуктивності.",
    "overview": [
      "Формат: flagship home console",
      "SSD: 2 ТБ",
      "Фокус: PSSR + максимум графіки"
    ],
    "highlights": [
      "Графічна система 16,7 TFLOPS, 16 ГБ GDDR6 і додаткові 2 ГБ DDR5.",
      "PSSR масштабує зображення у підтримуваних іграх; результат залежить від проєкту.",
      "Покращене трасування променів і режими графіки у PS5 Pro Enhanced.",
      "2 ТБ SSD; доступний користувачу обсяг менший за номінальний.",
      "Дисковод і вертикальна підставка продаються окремо.",
      "Роздільна здатність та FPS залежать від гри й дисплея; не обіцяйте 4K/120 або 8K у кожній грі."
    ]
  },
  {
    "slug": "sony-playstation-vr2",
    "title": "Sony PlayStation VR2",
    "colors": [
      {
        "label": "PS VR2",
        "caption": "Sony PlayStation VR2",
        "default": true,
        "imageUrl": "/materials/playstation-gaming-consoles/playstation-vr2.png"
      }
    ],
    "family": "Sony VR ecosystem",
    "summary": "VR-рішення для PlayStation 5, яке потрібне клієнтам, що хочуть максимальне занурення, eye-tracking і повноцінний віртуальний геймінг.",
    "overview": [
      "Формат: кабельна VR-гарнітура",
      "Для PS5; ПК — з адаптером",
      "Дисплеї: OLED"
    ],
    "highlights": [
      "2000 × 2040 пікселів на око, до 120 Гц і кут огляду приблизно 110°.",
      "Контролери Sense та камери гарнітури відстежують рух у підготовленій ігровій зоні.",
      "На PS5 доступні підтримувані грою HDR, відстеження погляду та тактильні ефекти.",
      "На ПК потрібні адаптер, відповідні порти та сумісне обладнання; частина функцій PS5 не працює.",
      "Ігри першої PS VR не стають автоматично сумісними з PS VR2.",
      "Перед продажем перевіряйте бібліотеку VR-ігор, місце для гри та комфорт посадки."
    ]
  },
  {
    "slug": "playstation-portal",
    "title": "PlayStation Portal",
    "family": "Пристрій потокового відтворення",
    "summary": "Екран із контролером для Remote Play та підтримуваного хмарного стримінгу; ігри локально не встановлює.",
    "overview": [
      "Формат: потокова гра",
      "Remote Play: від сумісної PS5",
      "Мережа: стабільний Wi-Fi"
    ],
    "highlights": [
      "Remote Play передає гру з налаштованої PS5 через мережу.",
      "Хмарний стримінг потребує PS Plus Premium, дорослого акаунта та підтримуваного регіону.",
      "України немає в офіційному списку регіонів хмарного стримінгу: не обіцяйте цю функцію без перевірки.",
      "Це не автономна консоль для офлайн-гри; якість залежить від затримки та стабільності мережі."
    ],
    "colors": [
      {
        "label": "White",
        "caption": "White",
        "default": true,
        "imageUrl": "/materials/playstation-gaming-consoles/2026/portal-white.webp"
      },
      {
        "label": "Midnight Black",
        "caption": "Midnight Black",
        "imageUrl": "/materials/playstation-gaming-consoles/2026/portal-midnight-black.webp"
      }
    ]
  }
];

export const xboxConsoleCatalog: ModuleCatalogProduct[] = [
  {
    "slug": "microsoft-xbox-series-s",
    "title": "Microsoft Xbox Series S",
    "colors": [
      {
        "label": "Series S",
        "caption": "Microsoft Xbox Series S",
        "default": true,
        "imageUrl": "/materials/playstation-gaming-consoles/xbox-series-s.png"
      }
    ],
    "family": "Xbox console",
    "summary": "Найкращий Xbox-вхід для бюджету, цифрової бібліотеки й Game Pass, коли клієнту не критичні 4K та дисковод.",
    "overview": [
      "Формат: цифрова домашня консоль",
      "SSD: 512 ГБ або 1 ТБ",
      "Ігри: цифрова бібліотека"
    ],
    "highlights": [
      "Дисковода немає: ігри купують і завантажують у цифровому форматі.",
      "Цільова роздільна здатність — до 1440p; до 120 кадрів/с у підтримуваних іграх і режимах.",
      "10 ГБ GDDR6; накопичувач 512 ГБ або 1 ТБ залежно від версії.",
      "Quick Resume і VRR працюють із відповідними іграми та обладнанням.",
      "Game Pass купують окремо; перевіряйте план, каталог і регіональну доступність.",
      "Підходить, якщо пріоритет — компактність і цифрові покупки, а не максимальна графіка Series X."
    ]
  },
  {
    "slug": "microsoft-xbox-series-x",
    "title": "Microsoft Xbox Series X",
    "colors": [
      {
        "label": "Series X",
        "caption": "Microsoft Xbox Series X",
        "default": true,
        "imageUrl": "/materials/playstation-gaming-consoles/xbox-series-x.png"
      }
    ],
    "family": "Xbox console",
    "summary": "Продуктивніша домашня Xbox для сумісних 4K-ігор. Важливо окремо вибрати дискову або Digital-версію.",
    "overview": [
      "Формат: домашня консоль",
      "SSD: 1 ТБ або 2 ТБ за версією",
      "Привід: є не в усіх версіях"
    ],
    "highlights": [
      "4K і до 120 кадрів/с залежать від конкретної гри та графічного режиму.",
      "16 ГБ GDDR6, SSD і сумісні карти розширення пам’яті.",
      "Carbon Black та окремі Galaxy Black мають UHD Blu-ray; Robot White Digital не читає диски.",
      "Quick Resume, трасування променів і VRR — у підтримуваних сценаріях.",
      "Зовнішній USB-накопичувач не замінює карту розширення для запуску більшості оптимізованих Series X|S ігор.",
      "Game Pass, мережеві функції й окремі аудіоформати перевіряйте за планом та обладнанням."
    ]
  }
];

export const portableGamingCatalog: ModuleCatalogProduct[] = [
  {
    "slug": "steam-deck",
    "title": "Steam Deck",
    "colors": [
      {
        "label": "Steam Deck",
        "caption": "Steam Deck",
        "default": true,
        "imageUrl": "/materials/playstation-gaming-consoles/steam-deck.png"
      }
    ],
    "family": "Handheld PC",
    "summary": "Портативний ПК для Steam-користувачів, який добре заходить клієнтам, що хочуть свою PC-бібліотеку в handheld-форматі.",
    "overview": [
      "Формат: портативний ПК",
      "ОС: SteamOS",
      "Екран: LCD 7″ або OLED 7,4″"
    ],
    "highlights": [
      "LCD і OLED мають різні дисплеї, батареї та бездротові модулі.",
      "OLED: 1280 × 800, HDR, до 90 Гц, 50 Вт·год; автономність залежить від гри.",
      "Proton запускає багато Windows-ігор; античит і окремі лаунчери можуть обмежувати сумісність.",
      "Перевіряйте Deck Verified / Playable та актуальні вимоги потрібної гри.",
      "microSD розширює бібліотеку; для док-станції перевіряйте потрібні порти й живлення.",
      "Desktop Mode — середовище Linux; встановлення Windows є окремим налаштуванням із перевіркою драйверів."
    ]
  },
  {
    "slug": "nintendo-switch-family",
    "title": "Nintendo Switch / Lite / OLED",
    "colors": [
      {
        "label": "Nintendo Switch",
        "caption": "Nintendo Switch",
        "default": true,
        "imageUrl": "/materials/playstation-gaming-consoles/nintendo-switch.png"
      }
    ],
    "family": "Hybrid console",
    "summary": "Гібридна сімейна платформа для дому та подорожей із сильними ексклюзивами Nintendo і зручним мультиплеєром.",
    "overview": [
      "Формат: залежить від моделі",
      "Екран: 5,5–7″",
      "Пам’ять: 32 ГБ або 64 ГБ"
    ],
    "highlights": [
      "Switch і OLED підтримують телевізійний, настільний і портативний режими.",
      "Switch Lite — лише портативний формат без виведення на телевізор і без знімних Joy-Con.",
      "Switch / Lite мають 32 ГБ, OLED — 64 ГБ; доступне розширення сумісною microSD.",
      "OLED відрізняється 7-дюймовим OLED-екраном, підставкою й LAN-портом дока.",
      "Сумісність гри та кількість гравців перевіряйте окремо; не кожна гра підходить для Lite без додаткових контролерів.",
      "Nintendo Switch Online й підтримка хмарних збережень залежать від гри та плану."
    ]
  },
  {
    "slug": "asus-rog-ally-family",
    "title": "Asus ROG Ally / Ally X",
    "colors": [
      {
        "label": "ROG Ally",
        "caption": "Asus ROG Ally / Ally X",
        "default": true,
        "imageUrl": "/materials/playstation-gaming-consoles/rog-ally.png"
      }
    ],
    "family": "Handheld Windows PC",
    "summary": "Windows-портатив для клієнта, якому потрібні Steam, Game Pass, Epic Games і максимально ПК-шний сценарій у handheld-форматі.",
    "overview": [
      "Формат: портативний Windows-ПК",
      "Екран: 7″ FHD, до 120 Гц",
      "Покоління: Ally 2023 / X 2024"
    ],
    "highlights": [
      "ROG Ally має AMD Z1 або Z1 Extreme; Ally X 2024 — Z1 Extreme.",
      "IPS-екран FHD до 120 Гц і FreeSync; Dolby Atmos стосується звуку, а не HDR Dolby Vision.",
      "Ally X 2024 має батарею 80 Вт·год і 24 ГБ пам’яті проти 40 Вт·год та 16 ГБ у початкового Ally.",
      "Steam, Xbox app / PC Game Pass та інші лаунчери працюють у Windows за вимогами конкретних ігор.",
      "Ally X має USB4 із сумісністю Thunderbolt 4 та USB-C 3.2; старого фірмового порту XG Mobile в ньому немає.",
      "FPS і час роботи залежать від гри, профілю потужності й роздільної здатності; не обіцяйте фіксованих годин у Turbo."
    ]
  },
  {
    "slug": "nintendo-switch-2",
    "title": "Nintendo Switch 2",
    "family": "Гібридна консоль",
    "summary": "Нове покоління Nintendo для гри вдома й у дорозі з більшим екраном та Joy-Con 2.",
    "overview": [
      "Екран: 7,9″ LCD, 1080p",
      "Пам’ять: 256 ГБ",
      "Розширення: microSD Express"
    ],
    "highlights": [
      "Екран підтримує HDR10 і VRR до 120 Гц у сумісних режимах.",
      "На телевізорі: до 4K/60 або до 120 кадрів/с у 1080p / 1440p; залежить від гри.",
      "Joy-Con 2 кріпляться магнітно; старі аксесуари перевіряйте за сумісністю.",
      "Підтримується багато ігор першої Switch, але є винятки й окремі платні оновлення.",
      "Для ігор потрібна microSD Express; звичайна microSD не є рівнозначною заміною."
    ],
    "colors": [
      {
        "label": "Nintendo Switch 2",
        "caption": "Консоль і док-станція",
        "default": true,
        "imageUrl": "/materials/playstation-gaming-consoles/2026/switch-2.webp"
      }
    ]
  },
  {
    "slug": "asus-rog-xbox-ally-family",
    "title": "ASUS ROG Xbox Ally / Ally X",
    "variantType": "model",
    "family": "Портативний Windows-ПК",
    "summary": "Окреме покоління ASUS із повноекранним інтерфейсом Xbox і доступом до сумісних ПК-бібліотек.",
    "overview": [
      "ОС: Windows",
      "Ally: Ryzen Z2 A",
      "Ally X: Ryzen AI Z2 Extreme"
    ],
    "highlights": [
      "Це портативні ПК, а не зменшена Xbox Series X: перевіряйте саме ПК-версію гри.",
      "Ally та Ally X відрізняються процесором, пам’яттю, SSD і батареєю.",
      "ROG Xbox Ally має 60 Вт·год, Xbox Ally X — 80 Вт·год.",
      "PC Game Pass, Steam та інші бібліотеки залежать від ліцензії, вимог гри й підписки.",
      "Не плутайте Xbox Ally X із попереднім ROG Ally X 2024."
    ],
    "colors": [
      {
        "label": "Xbox Ally",
        "caption": "Xbox Ally · White",
        "default": true,
        "imageUrl": "/materials/playstation-gaming-consoles/2026/rog-xbox-ally-white.webp"
      },
      {
        "label": "Xbox Ally X",
        "caption": "Xbox Ally X · Black",
        "imageUrl": "/materials/playstation-gaming-consoles/2026/rog-xbox-ally-x-black.webp"
      }
    ]
  },
  {
    "slug": "lenovo-legion-go-family",
    "title": "Lenovo Legion Go / Go S / Go 2",
    "variantType": "model",
    "family": "Портативний ПК",
    "summary": "Сімейство портативних ПК, у якому важливо перевірити точний індекс моделі, ОС, екран та контролери.",
    "overview": [
      "Формат: портативний ПК",
      "ОС: залежить від комплектації",
      "Конфігурація: за артикулом"
    ],
    "highlights": [
      "У Pineapple є Go S і Go 2 у різних конфігураціях; назви не означають однакового обладнання.",
      "Legion Go 2 має 8,8-дюймовий OLED 1920 × 1200 до 144 Гц.",
      "Windows і SteamOS мають різну сумісність лаунчерів та античитів.",
      "Процесор, оперативну пам’ять і SSD звіряйте за повним кодом моделі.",
      "Габарити, контролери та час роботи порівнюйте під потрібні ігри й сценарій перенесення."
    ],
    "colors": [
      {
        "label": "Go 2",
        "caption": "Go 2 · Black",
        "default": true,
        "imageUrl": "/materials/playstation-gaming-consoles/2026/legion-go-2-black.webp"
      },
      {
        "label": "Go S",
        "caption": "Go S · Black, SteamOS",
        "imageUrl": "/materials/playstation-gaming-consoles/2026/legion-go-s-black.webp"
      }
    ]
  }
];

export const gamingConsolesFoundationBlocks: ModuleContentBlock[] = [
  {
    "html": "<p>Ігрову платформу обирають за потрібними іграми, місцем гри та вже придбаною бібліотекою. Порівняйте домашні консолі, портативні ПК, гібридні Nintendo Switch і VR-гарнітуру.</p><p>Потім уточніть диски чи цифрові покупки, бюджет на ігри й підписки, кількість гравців і потрібні аксесуари. Сумісність конкретної гри, регіон акаунта та спосіб оплати перевіряйте до продажу.</p>",
    "type": "text",
    "title": "Ігрові консолі"
  },
  {
    "type": "facts",
    "items": [
      "Де клієнт буде грати: лише вдома, у поїздках чи в змішаному сценарії.",
      "Чи важливі ексклюзиви Sony, Nintendo або доступ до PC-бібліотеки.",
      "Чи потрібен дисковод або достатньо лише цифрової бібліотеки.",
      "Наскільки важливі підписки та сервіси на кшталт Game Pass або Nintendo Switch Online.",
      "Чи потрібні додаткові аксесуари: другий геймпад, гарнітура, зарядна станція, док або VR."
    ],
    "title": "Що уточнити перед рекомендацією консолі"
  },
  {
    "url": "/materials/playstation-gaming-consoles/playstation-5-accessories.png",
    "type": "image",
    "title": "Аксесуари PlayStation 5",
    "caption": "Другий DualSense, зарядна станція, гарнітура та інші аксесуари для PlayStation 5"
  },
  {
    "html": "<h3>Домашні консолі</h3><ul><li><strong>PS5 / Slim / Pro:</strong> бібліотека PlayStation і DualSense. Pro покращує графіку підтримуваних ігор.</li><li><strong>Xbox Series S:</strong> цифрова консоль; <strong>Series X:</strong> вища продуктивність, є дискові й цифрові версії.</li></ul><h3>Портативні платформи</h3><ul><li><strong>Steam Deck:</strong> SteamOS; перевіряйте позначки сумісності ігор.</li><li><strong>ROG Ally / Xbox Ally та Legion Go:</strong> портативні ПК; ОС і конфігурацію звіряйте за моделлю.</li><li><strong>Nintendo Switch / Switch 2:</strong> ігри Nintendo й гібридний формат; Switch Lite працює лише в портативному режимі.</li></ul><h3>Додаткові формати</h3><ul><li><strong>PS VR2:</strong> VR для PS5; на сумісному ПК потрібен окремий адаптер і є функціональні обмеження.</li><li><strong>PlayStation Portal:</strong> потокове відтворення, а не автономний запуск ігор як на портативному ПК.</li></ul>",
    "type": "text",
    "title": "Як розрізняти платформи за сценаріями"
  },
  {
    "url": "/materials/playstation-gaming-consoles/gaming-console-guide.png",
    "type": "image",
    "title": "Карта вибору консолі",
    "caption": "Швидка візуальна логіка вибору консолі під тип користувача"
  },
  {
    "type": "facts",
    "items": [
      "PS5 Slim — домашня консоль; SSD, дисковод і кількість контролерів уточнюйте за артикулом.",
      "PS5 Pro — 2 ТБ SSD і покращення графіки в сумісних іграх; дисковод продається окремо.",
      "Xbox Series S — цифрові ігри; Series X буває з дисководом і без нього.",
      "Steam Deck — зручний доступ до сумісних ігор Steam у дорозі.",
      "ROG Ally / Xbox Ally й Legion Go — портативні ПК; сумісність гри залежить також від ОС і античита.",
      "Switch 2 та Switch OLED — для ігор Nintendo, дому й подорожей; Lite не виводить гру на телевізор.",
      "Підписка не означає доступу до всіх ігор: каталог і регіональні умови змінюються."
    ],
    "title": "Швидка логіка підбору консолі"
  }
];

export const gamingConsolesCatalogBlocks: ModuleContentBlock[] = [
  {
    "html": "<p>Порівняйте домашні та портативні ігрові платформи: <strong>PlayStation 5</strong>, <strong>Xbox Series S / X</strong>, <strong>Steam Deck</strong>, <strong>Nintendo Switch</strong> та <strong>Asus ROG Ally / Ally X</strong>. Окремо розгляньте <strong>PlayStation VR2</strong> як гарнітуру віртуальної реальності.</p><p>Почніть із потрібних ігор, місця гри та наявних пристроїв. Потім уточніть формат придбання ігор, підписки, кількість гравців і потрібні аксесуари.</p>",
    "type": "text",
    "title": "Каталог сучасних ігрових платформ"
  },
  {
    "type": "productCatalog",
    "title": "PlayStation 5, PS VR2 і Portal",
    "products": playstationConsoleCatalog
  },
  {
    "type": "facts",
    "items": [
      "Другий DualSense потрібен для сумісних локальних багатокористувацьких ігор або як запасний.",
      "Зарядна станція має відповідати моделі контролера; перевіряйте живлення в комплекті.",
      "DualSense Edge додає налаштування й змінні елементи; його функції залежать від гри та платформи.",
      "PULSE Elite — повнорозмірна гарнітура, PULSE Explore — навушники, PULSE Elevate — колонки.",
      "Для аудіо перевіряйте PlayStation Link, USB-адаптер або дротове підключення; Bluetooth не є універсальним способом підключення до PS5."
    ],
    "title": "Аксесуари й допродаж для PlayStation 5"
  },
  {
    "type": "productCatalog",
    "title": "Microsoft Xbox Series",
    "products": xboxConsoleCatalog
  },
  {
    "url": "/materials/playstation-gaming-consoles/xbox-accessories.png",
    "type": "image",
    "title": "Аксесуари Xbox",
    "caption": "Геймпади, Elite Series 2, заряджання та розширення пам'яті для Xbox"
  },
  {
    "type": "facts",
    "items": [
      "Другий Xbox Wireless Controller — для підтримуваних ігор удвох; Elite Series 2 — для розширених налаштувань.",
      "Сумісний акумуляторний комплект або зарядна станція — альтернатива змінним батарейкам.",
      "Для гарнітури перевіряйте Xbox Wireless, сумісний USB або 3,5 мм; звичайний Bluetooth не підключає будь-які навушники до консолі.",
      "Карти розширення для Series X|S і зовнішні USB SSD/HDD мають різні можливості запуску ігор."
    ],
    "title": "Що продавати разом з Xbox"
  },
  {
    "type": "productCatalog",
    "title": "Портативні та гібридні рішення",
    "products": portableGamingCatalog
  },
  {
    "type": "facts",
    "items": [
      "Домашня бібліотека PlayStation і DualSense — PS5 Slim; покращення графіки підтримуваних ігор — Pro.",
      "Цифрові Xbox-ігри й компактність — Series S; продуктивніші режими — Series X потрібної версії.",
      "Сумісна Steam-бібліотека в дорозі — Steam Deck.",
      "Портативний Windows-ПК — ROG Ally / Xbox Ally або відповідний Legion Go.",
      "Ігри Nintendo, гібридний формат і нове покоління — Switch 2; OLED — попередня платформа з OLED-екраном.",
      "Потоковий доступ до PS5 — Portal, а не заміна автономного портативного ПК."
    ],
    "title": "Кому що рекомендувати коротко"
  },
  {
    "html": "<h3>Модель і комплект</h3><ul><li>Початкова PS5 має SSD 825 ГБ; Slim Digital може мати 825 ГБ або 1 ТБ залежно від ревізії. Перевіряйте артикул.</li><li>Дискова версія читає сумісні Blu-ray-ігри; Digital потребує цифрових покупок. Pro постачається без дисковода.</li><li>Slim і Pro мають два USB-C спереду та два USB-A ззаду; у початкової PS5 порти інші.</li></ul><h3>Графіка та ігри</h3><ul><li>4K і до 120 кадрів/с — можливі режими окремих ігор за наявності сумісного дисплея.</li><li>PS5 Pro додає PSSR, покращене трасування променів і 2 ТБ SSD; ефект залежить від гри.</li><li>Не обіцяйте 8K для звичайної PS5 або автоматичного безкоштовного оновлення будь-якої PS4-гри.</li><li>Для дискового оновлення гри може бути потрібен диск у приводі; умови визначає видавець.</li></ul><h3>Підбір аксесуарів</h3><p>Уточніть локальну гру вдвох, потрібне аудіопідключення та комплектність. Дисковод, вертикальна підставка, друга гра чи другий DualSense можуть продаватися окремо.</p>",
    "type": "text",
    "title": "PlayStation 5: версії, графіка та комплектність"
  },
  {
    "html": "<p>PS VR2 — кабельна VR-гарнітура з OLED-дисплеями 2000 × 2040 на око та контролерами Sense. Чотири камери відстежують ігрову зону без окремої зовнішньої камери.</p><ul><li>На PS5 підтримуються передбачені грою HDR, відстеження погляду й тактильні ефекти.</li><li>На сумісному ПК потрібен окремий адаптер; HDR, відстеження погляду та частина тактильних можливостей недоступні.</li><li>Ігри першої PS VR не запускаються автоматично; перевіряйте окрему PS VR2-версію.</li><li>Перевірте місце для гри, посадку гарнітури, вікові рекомендації й підтримку потрібного проєкту. Комфорт не можна гарантувати за вагою пристрою.</li></ul>",
    "type": "text",
    "title": "PlayStation VR2: підключення та сумісність"
  },
  {
    "html": "<h3>Series S</h3><p>Компактна цифрова Xbox із 10 ГБ GDDR6 та SSD 512 ГБ або 1 ТБ. Приводу немає. Цільові режими — до 1440p і до 120 кадрів/с у підтримуваних іграх.</p><h3>Series X</h3><p>16 ГБ GDDR6 і продуктивніші графічні режими. Є дискові та Digital-версії, SSD 1 ТБ або 2 ТБ залежно від виконання. Наявність дисковода перевіряйте за повною назвою.</p><h3>Що перевірити</h3><ul><li>Роздільна здатність і FPS залежать від гри та режиму; Series S також може виводити масштабоване 4K-зображення.</li><li>Game Pass — окрема підписка зі змінним каталогом; усі ігри автоматично не включені.</li><li>У Series X використовується Wi-Fi 802.11ac, а не Wi-Fi 6.</li><li>Сумісні карти розширення й зовнішні USB-накопичувачі мають різні сценарії запуску та зберігання ігор.</li><li>Bluetooth у навушниках не гарантує підключення до Xbox: перевіряйте Xbox Wireless, USB або 3,5 мм.</li></ul>",
    "type": "text",
    "title": "Xbox Series S / X: версії та бібліотека"
  },
  {
    "html": "<h3>LCD і OLED</h3><ul><li>LCD: екран 7″ 1280 × 800 до 60 Гц, батарея 40 Вт·год.</li><li>OLED: 7,4″ HDR до 90 Гц, батарея 50 Вт·год, Wi-Fi 6E, Bluetooth 5.3 і пам’ять 6400 MT/s.</li><li>Травлене антиблікове скло має OLED 1 ТБ; не всі OLED-комплектації.</li></ul><h3>Ігри й аксесуари</h3><ul><li>SteamOS працює на Linux; Proton підтримує багато Windows-ігор, але не гарантує роботу кожного античита чи лаунчера.</li><li>Перевірте потрібні ігри за актуальними позначками Deck Verified / Playable.</li><li>Cloud Saves та Remote Play залежать від підтримки гри й мережі.</li><li>Для розширення використовуйте сумісну microSD; для заряджання — належне USB-C PD живлення до 45 Вт.</li><li>Час роботи залежить від навантаження. Заявлені діапазони не є гарантією автономності у вимогливій AAA-грі.</li></ul>",
    "type": "text",
    "title": "Steam Deck: дисплеї та сумісність ігор"
  },
  {
    "html": "<h3>Попереднє покоління</h3><ul><li>Switch: 6,2″ LCD і 32 ГБ; гібридний формат із доком.</li><li>Switch Lite: 5,5″ LCD і 32 ГБ; лише портативна гра без виведення на телевізор.</li><li>Switch OLED: 7″ OLED і 64 ГБ; док із LAN та ширша підставка.</li><li>Для окремих ігор на Lite можуть знадобитися додаткові контролери.</li></ul><h3>Switch 2</h3><ul><li>7,9″ LCD 1920 × 1080 із HDR10 та VRR до 120 Гц; 256 ГБ внутрішнього сховища.</li><li>Магнітні Joy-Con 2; аксесуари та ігри першої Switch перевіряйте за списком сумісності.</li><li>Для розширення сховища ігор потрібна microSD Express.</li><li>Телевізійний режим підтримує до 4K/60 або 1080p / 1440p до 120 кадрів/с у відповідних іграх.</li></ul><p>Nintendo Switch Online, хмарні збереження та мережеві режими залежать від гри й плану. Кількість гравців перевіряють для конкретного проєкту.</p>",
    "type": "text",
    "title": "Nintendo Switch: покоління, режими та пам’ять"
  },
  {
    "html": "<h3>Ally та Ally X</h3><ul><li>ROG Ally 2023: AMD Z1 або Z1 Extreme, 16 ГБ оперативної пам’яті й батарея 40 Вт·год.</li><li>ROG Ally X 2024: Z1 Extreme, 24 ГБ і батарея 80 Вт·год.</li><li>Обидва мають 7″ FHD IPS до 120 Гц із FreeSync. Dolby Atmos — аудіофункція; HDR Dolby Vision не заявляйте.</li><li>У початкового Ally є фірмовий XG Mobile; Ally X 2024 має USB4 із сумісністю Thunderbolt 4 замість цього роз’єму.</li></ul><h3>ROG Xbox Ally / Xbox Ally X</h3><p>Це окреме покоління портативних Windows-ПК: Xbox Ally має Ryzen Z2 A, Xbox Ally X — Ryzen AI Z2 Extreme. Лаунчер Xbox не перетворює їх на Xbox Series: перевіряйте ПК-версії ігор та право доступу до них.</p><p>Перед рекомендацією зіставте конкретну гру, профіль потужності, обсяг пам’яті та час роботи. Фіксовану автономність або роботу будь-якої гри не обіцяйте.</p>",
    "type": "text",
    "title": "ASUS ROG Ally: покоління, порти й Windows"
  },
  {
    "html": "<ol><li><strong>Ігри:</strong> назвіть потрібні проєкти та перевірте платформу й бібліотеку клієнта.</li><li><strong>Місце гри:</strong> домашня PS5 / Xbox, гібридна Switch або портативний ПК.</li><li><strong>Диски й підписки:</strong> з’ясуйте право доступу, потрібний план та регіональні обмеження.</li><li><strong>Екран:</strong> перевірте можливості телевізора або власного дисплея пристрою; FPS залежить від гри.</li><li><strong>Комплект:</strong> контролери, заряджання, карта пам’яті, чохол або гарнітура — лише під підтверджену потребу.</li></ol>",
    "type": "text",
    "title": "Як підсумувати вибір платформи"
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
