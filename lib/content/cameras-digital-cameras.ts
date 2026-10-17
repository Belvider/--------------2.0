import type { ModuleCatalogProduct, ModuleContentBlock } from "../module-content";

export const instaxCameraCatalog: ModuleCatalogProduct[] = [
  {
    slug: "fujifilm-instax-mini-12",
    title: "Fujifilm Instax Mini 12",
    family: "Instant camera",
    summary:
      "Базова Instax-камера для подарунка, вечірок і швидких емоційних фото без складних налаштувань.",
    overview: ["Формат: Instax Mini", "Живлення: 2×AA", "Фокус: простий старт"],
    highlights: [
      "Автоекспозиція й дуже просте керування без складного меню",
      "Селфі та макро активуються поворотом об'єктива",
      "Автоматичний спалах підлаштовує яскравість під сцену",
      "Працює з Instax Mini-плівкою ISO 800 і друкує відбиток приблизно за 90 секунд",
      "Добре заходить як перша камера миттєвого друку або подарунок"
    ],
    colors: [
      {
        label: "Mini 12",
        imageUrl: "/materials/cameras-digital-cameras/instax-mini-12.png",
        caption: "Fujifilm Instax Mini 12",
        default: true
      }
    ]
  },
  {
    slug: "fujifilm-instax-sq1",
    title: "Fujifilm Instax SQ1",
    family: "Instant camera",
    summary:
      "Instax для клієнта, якому важливий квадратний кадр, стильний результат і максимальна простота.",
    overview: ["Формат: Instax Square", "Живлення: 2×CR2", "Фокус: квадратний кадр"],
    highlights: [
      "Працює з Instax Square, де кадр помітно більший за Mini",
      "Поворот об'єктива активує камеру та режим селфі/крупного плану",
      "Дає більш 'інстаграмний' вигляд фото завдяки квадратному формату",
      "Підходить тим, хто хоче мінімум налаштувань і більше простору в кадрі",
      "Хороший варіант для творчих подарунків, декору та портретів"
    ],
    colors: [
      {
        label: "SQ1",
        imageUrl: "/materials/cameras-digital-cameras/instax-sq1.png",
        caption: "Fujifilm Instax SQ1",
        default: true
      }
    ]
  },
  {
    slug: "fujifilm-instax-mini-40",
    title: "Fujifilm Instax Mini 40",
    family: "Instant camera",
    summary:
      "Instax Mini у дорослішому вінтажному дизайні для клієнта, якому важливі не лише емоції, а й зовнішній вигляд камери.",
    overview: ["Формат: Instax Mini", "Живлення: 2×AA", "Фокус: стильний подарунок"],
    highlights: [
      "Дає той самий простий сценарій, що й базові Instax Mini-моделі",
      "Фактурне покриття й ретро-стиль виглядають дорожче за класичні 'fun'-версії",
      "Автоекспозиція та селфі-режим не вимагають досвіду від користувача",
      "Працює з найпопулярнішим форматом Instax Mini",
      "Добре продається як подарунок 'зі смаком' або камера для стильного контенту"
    ],
    colors: [
      {
        label: "Mini 40",
        imageUrl: "/materials/cameras-digital-cameras/instax-mini-40.png",
        caption: "Fujifilm Instax Mini 40",
        default: true
      }
    ]
  },
  {
    slug: "fujifilm-instax-mini-90",
    title: "Fujifilm Instax Mini 90",
    family: "Advanced instant camera",
    summary:
      "Просунута Instax для тих, хто хоче креатив, ручніші сценарії зйомки та акумулятор замість батарейок AA.",
    overview: ["Формат: Instax Mini", "Живлення: NP-45", "Фокус: творчі режими"],
    highlights: [
      "Підтримує довгу витримку, експокорекцію й подвійні експозиції",
      "Є макро, таймер і кілька сценічних пресетів для гнучкішої зйомки",
      "Програмований спалах дає більше контролю, ніж у базових Instax",
      "Різьба під штатив допомагає в нічних або постановочних кадрах",
      "Оптимальний апгрейд, коли клієнт каже: 'хочу Instax, але не найпростішу'"
    ],
    colors: [
      {
        label: "Mini 90",
        imageUrl: "/materials/cameras-digital-cameras/instax-mini-90.png",
        caption: "Fujifilm Instax Mini 90",
        default: true
      }
    ]
  },
  {
    slug: "fujifilm-instax-wide-300",
    title: "Fujifilm Instax Wide 300",
    family: "Wide instant camera",
    summary:
      "Модель для великих компаній, подій і групових кадрів, де Mini-формату вже замало.",
    overview: ["Формат: Instax Wide", "Живлення: 4×AA", "Фокус: групові фото"],
    highlights: [
      "Працює з Instax Wide - це найбільший формат у лінійці",
      "Краще підходить для компаній, пейзажів, весіль і подій",
      "Має прості підказки яскравості L/D та автоспалах",
      "Габаритніша за Mini-серію, але дає значно більше корисної площі знімка",
      "Сильний варіант для івентів, де важлива читабельність деталей на фото"
    ],
    colors: [
      {
        label: "Wide 300",
        imageUrl: "/materials/cameras-digital-cameras/instax-wide-300.png",
        caption: "Fujifilm Instax Wide 300",
        default: true
      }
    ]
  },
  {
    slug: "fujifilm-instax-mini-evo",
    title: "Fujifilm Instax Mini Evo",
    family: "Hybrid instant camera",
    summary:
      "Гібридна Instax для клієнта, який хоче не витрачати плівку даремно, друкувати вибрані кадри й працювати зі смартфоном.",
    overview: ["Формат: Instax Mini hybrid", "Живлення: USB recharge", "Фокус: digital + print"],
    highlights: [
      "Поєднує цифрову камеру, LCD-прев'ю та миттєвий друк",
      "10 ефектів об'єктива і 10 фільтрів дають до 100 комбінацій стилю",
      "Bluetooth дозволяє друкувати фото зі смартфона",
      "Є експокорекція, макро, подвійна експозиція та електронний затвор",
      "Ідеальна модель, якщо клієнту подобається Instax, але не хочеться псувати картриджі невдалими кадрами"
    ],
    colors: [
      {
        label: "Mini Evo",
        imageUrl: "/materials/cameras-digital-cameras/instax-mini-evo.png",
        caption: "Fujifilm Instax Mini Evo",
        default: true
      }
    ]
  },
  {
    slug: "fujifilm-instax-mini-liplay",
    title: "Fujifilm Instax Mini LiPlay",
    family: "Hybrid instant camera",
    summary:
      "Найкомпактніший гібридний Instax-сценарій: камера плюс принтер для смартфона в одному корпусі.",
    overview: ["Формат: Instax Mini hybrid", "Дисплей: 3″", "Фокус: printer + camera"],
    highlights: [
      "Працює як невелика камера і як кишеньковий принтер для смартфона",
      "Дає попередній перегляд перед друком і зберігає кадри в пам'яті",
      "Bluetooth і додаток LiPlay спрощують друк фото з телефону",
      "Підтримує звукові QR-повідомлення на фото як нестандартну фішку",
      "Сильний варіант для клієнта, якому важливі компактність, social-сценарій і економія картриджів"
    ],
    colors: [
      {
        label: "Mini LiPlay",
        imageUrl: "/materials/cameras-digital-cameras/instax-mini-liplay.png",
        caption: "Fujifilm Instax Mini LiPlay",
        default: true
      }
    ]
  }
];

export const canonDslrCatalog: ModuleCatalogProduct[] = [
  {
    slug: "canon-eos-5d-mark-ii",
    title: "Canon EOS 5D Mark II",
    family: "Full-frame DSLR",
    summary:
      "Культовий вхід у full frame для портрета, пейзажу та базового відео, коли клієнт хоче Canon-картинку за адекватний бюджет.",
    overview: ["Сенсор: 21.1 МП full frame", "AF: 9 точок", "Фокус: доступний full frame"],
    highlights: [
      "Повнокадровий CMOS-сенсор 21.1 МП і характерна кольоропередача Canon",
      "Full HD 1080p стало історичною сильною стороною цієї моделі",
      "Підходить для портрета, пейзажу, студії та спокійної предметної зйомки",
      "Працює з CompactFlash і потребує уважнішого підбору карт та оптики",
      "Найкраще заходить клієнту, який хоче недорогий старт у full frame і не женеться за сучасним автофокусом"
    ],
    colors: [
      {
        label: "5D Mark II",
        imageUrl: "/materials/cameras-digital-cameras/canon-eos-5d-mark-ii.png",
        caption: "Canon EOS 5D Mark II",
        default: true
      }
    ]
  },
  {
    slug: "canon-eos-5d-mark-iii",
    title: "Canon EOS 5D Mark III",
    family: "Full-frame DSLR",
    summary:
      "Більш універсальна робоча DSLR для репортажу, весіль і професійної зйомки, де важливі швидкість, AF і надійність.",
    overview: ["Сенсор: 22.3 МП full frame", "AF: 61 точка", "Фокус: speed + reliability"],
    highlights: [
      "61-точкова система автофокусу помітно краща за 5D Mark II",
      "Серійна зйомка до 6 кадрів/с краще підходить під динамічні сцени",
      "Вищі робочі ISO та сильніша поведінка в складному світлі",
      "Два слоти карт CF + SD додають надійності на комерційних зйомках",
      "Логічний вибір для клієнта, який шукає не просто full frame, а справді робочу камеру під замовлення"
    ],
    colors: [
      {
        label: "5D Mark III",
        imageUrl: "/materials/cameras-digital-cameras/canon-eos-5d-mark-iii.png",
        caption: "Canon EOS 5D Mark III",
        default: true
      }
    ]
  }
];

export const digitalCamerasFoundationBlocks: ModuleContentBlock[] = [
  {
    type: "text",
    title: "Портативні камери",
    html: `<p>Розбираємо дві групи: <strong>миттєвий друк Fujifilm Instax</strong> (емоції «тут і зараз») та <strong>професійні DSLR Canon</strong> (контроль, якість, змінна оптика). Дамо короткі скрипти для продавця, особливості кожної моделі, таблиці форматів плівки/паперу та практичні поради.</p><p>У цьому матеріалі ми навмисно поєднуємо <strong>Fujifilm Instax</strong> і <strong>Canon EOS 5D</strong>, бо в консультації це дві різні потреби. Instax продається через емоцію, моментальний друк, подарунок і простоту. Canon 5D продається через якість картинки, змінну оптику, ручний контроль і професійні сценарії зйомки.</p>`
  },
  {
    type: "facts",
    title: "Швидкий скрипт продажу: Instax vs DSLR",
    items: [
      "Навіщо камера: спогади, вечірки, подорожі й подарунок = Instax; комерція, портрет, студія, контент = Canon.",
      "Формат кадру: Mini, Square, Wide у Instax або повний кадр і змінна оптика в Canon.",
      "Простота чи контроль: Instax працює за сценарієм 'увімкнув і зняв', Canon - це налаштування, оптика та досвід.",
      "Бюджет на знімок: Instax має постійні витрати на картриджі, DSLR вимагає вкладення в об'єктиви та карти.",
      "Апсейл: для Instax це чохли, картриджі й альбоми, для Canon - карта пам'яті, акумулятор, оптика, ремінь і спалах."
    ]
  },
  {
    type: "image",
    title: "Fujifilm Instax Mini 12",
    url: "/materials/cameras-digital-cameras/instax-mini-12.png",
    caption: "Базова Instax-модель для швидких емоційних фото без складного входу"
  },
  {
    type: "facts",
    title: "Формати Instax-плівки коротко",
    items: [
      "Instax Mini: 54 × 86 мм папір, 46 × 62 мм зображення - наймасовіший формат для щоденників, нотаток, вечірок і подарунків.",
      "Instax Square: 86 × 72 мм папір, 62 × 62 мм зображення - квадратний кадр для стильних портретів і творчого контенту.",
      "Instax Wide: 108 × 86 мм папір, 99 × 62 мм зображення - найкраще для компаній, подій і пейзажів.",
      "Усі формати Instax працюють на ISO 800 і люблять нормальне світло та акуратне зберігання картриджів."
    ]
  },
  {
    type: "facts",
    title: "Що важливо пояснити клієнту по Instax",
    items: [
      "Відбиток не треба трясти - йому просто потрібен час на проявлення.",
      "У темних умовах камера майже завжди включає спалах, тому важливо тримати її стабільно.",
      "Гібридні моделі Mini Evo і LiPlay економлять картриджі, бо дають прев'ю перед друком.",
      "Mini-серія = компактність, Square = стиль кадру, Wide = більше корисної площі на фото."
    ]
  },
  {
    type: "image",
    title: "Canon EOS 5D Mark III",
    url: "/materials/cameras-digital-cameras/canon-eos-5d-mark-iii.png",
    caption: "Більш універсальна full-frame DSLR для серйознішої фото- і комерційної роботи"
  },
  {
    type: "text",
    title: "Canon 5D Mark II vs Mark III: різниця без зайвої теорії",
    html: `<p><strong>5D Mark II</strong> - це доступніший вхід у повний кадр, гарний варіант для портрета, предметки, пейзажу та базового відео. <strong>5D Mark III</strong> - це вже помітно надійніша і швидша робоча камера для репортажу, весілля, комерції та зйомки в складнішому світлі.</p><ul><li><strong>Mark II:</strong> 21.1 МП, 9 точок AF, CompactFlash, нижчий бюджет входу.</li><li><strong>Mark III:</strong> 22.3 МП, 61 точка AF, CF + SD, кращі ISO, швидша серія та краща надійність.</li></ul><p>Якщо клієнт питає 'що практичніше на роботу', відповідь майже завжди буде на боці <strong>5D Mark III</strong>.</p>`
  },
  {
    type: "facts",
    title: "Що допродавати до Canon DSLR",
    items: [
      "Об'єктив під сценарій: портрет, універсальний зум, репортаж або студія.",
      "Карти пам'яті, особливо якщо клієнт бере 5D Mark III з двома слотами.",
      "Запасний акумулятор і якісний ремінь для довших зйомок.",
      "Зовнішній спалах, штатив або сумка - залежно від сценарію роботи.",
      "Окремо уточнюйте, чи клієнту потрібне саме фото, відео або змішаний сценарій."
    ]
  },
  {
    type: "facts",
    title: "Коротка логіка рекомендації",
    items: [
      "Mini 12, SQ1, Mini 40 - якщо потрібні емоції, простота і подарунковий сценарій.",
      "Mini 90 - якщо клієнт хоче творчі режими та більше контролю.",
      "Wide 300 - якщо зніматимуть компанії, події або великі групові фото.",
      "Mini Evo / LiPlay - якщо важливі цифрові зручності, прев'ю і друк зі смартфона.",
      "Canon 5D Mark II - якщо потрібен доступніший full frame.",
      "Canon 5D Mark III - якщо потрібна робоча камера з сильнішим AF, ISO і стабільнішим професійним сценарієм."
    ]
  }
];

export const digitalCamerasCatalogBlocks: ModuleContentBlock[] = [
  {
    type: "text",
    title: "Каталог Instax і Canon",
    html: `<p>Цей модуль збирає основні моделі з вашого матеріалу в одну практичну карту. Тут є <strong>миттєві камери Fujifilm Instax</strong> для розваг, подій і швидких емоційних кадрів, а також <strong>Canon EOS 5D Mark II / Mark III</strong> для клієнтів, яким потрібен повний кадр, оптика та професійніший результат.</p>`
  },
  {
    type: "productCatalog",
    title: "Fujifilm Instax: моделі й позиціонування",
    products: instaxCameraCatalog
  },
  {
    type: "facts",
    title: "Формати й серії Instax: як не заплутатись",
    items: [
      "Mini 12 і Mini 40 - найпростіший Instax-сценарій, різниця переважно в дизайні.",
      "SQ1 - квадратний формат для тих, кому важливий стиль кадру.",
      "Mini 90 - 'просунутий Instax' із творчими режимами та акумулятором.",
      "Wide 300 - максимум площі кадру для подій і групових фото.",
      "Mini Evo та LiPlay - гібриди для друку вибраних кадрів і зв'язки зі смартфоном."
    ]
  },
  {
    type: "productCatalog",
    title: "Canon EOS 5D: професійний full frame",
    products: canonDslrCatalog
  },
  {
    type: "facts",
    title: "Кому що рекомендувати коротко",
    items: [
      "Подарунок, вечірка, подорож, простота = Instax Mini 12 / Mini 40 / SQ1.",
      "Більше творчості в миттєвому друці = Mini 90.",
      "Великі групові знімки = Wide 300.",
      "Друк зі смартфона та економія картриджів = Mini Evo або LiPlay.",
      "Бюджетний вхід у full frame = Canon 5D Mark II.",
      "Робочий інструмент для репортажу, весіль і серйозної фото-практики = Canon 5D Mark III."
    ]
  },
  {
    type: "text",
    title: "Fujifilm Instax — повний затверджений матеріал",
    html: `<h3>Fujifilm INSTAX Mini 12</h3><p>Нова базова «fun»-камера: просте керування, автоекспозиція і швидкий старт.</p><ul><li><strong>Об’єктив:</strong> пластиковий, екв. ~60 мм, f/12 (фіксована діафрагма).</li><li><strong>Фокус:</strong> безручний, режим селфі/макро ~30–50 см (поворот об’єктива).</li><li><strong>Спалах:</strong> автоматичний, підлаштовує потужність.</li><li><strong>Плівка:</strong> Instax Mini (ISO 800), прояв ~90 сек.</li><li><strong>Живлення:</strong> 2×AA — легко знайти будь-де.</li></ul><p><em>Кому підійде:</em> подарунок, перша Instax-камера, заходи, вечірки.</p><h3>Fujifilm Instax SQ1</h3><p>Дуже проста управлінням камера з <strong>квадратним кадром</strong> — більше місця для сюжету, сучасний «інстаграмний» вигляд.</p><ul><li><strong>Режими:</strong> ввімкнення поворотом; другий поворот — селфі/крупний план 30–50 см.</li><li><strong>Плівка:</strong> Instax Square (ISO 800).</li><li><strong>Живлення:</strong> 2×CR2 (компактно, вистачає надовго).</li></ul><p><em>Кому підійде:</em> тим, кому важливий квадрат і більша площа кадру, мінімум налаштувань.</p><h3>Fujifilm Instax Mini 40</h3><p>Ті самі можливості, що й Mini 11/12, але в <strong>вінтажному преміальному дизайні</strong> з фактурним покриттям під шкіру та металевими акцентами.</p><ul><li><strong>Плівка:</strong> Instax Mini.</li><li><strong>Живлення:</strong> 2×AA.</li><li><strong>Керування:</strong> поворот об’єктива, автоекспозиція, селфі-режим.</li></ul><p><em>Кому підійде:</em> подарунок «зі смаком», стриманий стиль замість «іграшкового» дизайну.</p><h3>Fujifilm Instax Mini 90</h3><p><strong>Продвинута Instax</strong> із творчими режимами та зручною ергономікою.</p><ul><li><strong>Експозиція:</strong> кнопка корекції, довга витримка до ~10 с.</li><li><strong>Спалах:</strong> програмований, у т.ч. приглушений.</li><li><strong>Режими:</strong> таймер, подвійна експозиція, макро, різні пресети сцени.</li><li><strong>Монтаж:</strong> різьба під штатив.</li><li><strong>Живлення:</strong> акумулятор NP-45 (знімний, що заряджається).</li></ul><p><em>Кому підійде:</em> хто хоче більше контролю/креативу, ніж у базових Mini.</p><h3>Fujifilm Instax Wide 300</h3><p>Міцний корпус, <strong>великий формат</strong> кадру — ідеально для компаній, пейзажів і подій.</p><ul><li><strong>Плівка:</strong> Instax Wide (найширше поле з трьох форматів).</li><li><strong>Експозиція:</strong> прості підказки (L/D), автоспалах.</li><li><strong>Живлення:</strong> 4×AA.</li></ul><p><em>Кому підійде:</em> ведучі/івент-менеджери, весілля, подорожі великими компаніями.</p><h3>Instax Mini — концепція та поради</h3><ul><li><strong>Плівка:</strong> ISO 800, прояв ~90 сек; краще знімати при достатньому світлі.</li><li><strong>Фокус:</strong> макро/селфі зазвичай 30–50 см (залежно від моделі).</li><li><strong>Спалах:</strong> завжди присутній; у темряві — тримати камеру стійко.</li><li><strong>Лайфхак:</strong> не струшувати відбиток, дайте проявитися на світлі/в тіні без крайнощів.</li></ul><h3>Fujifilm Instax Mini Evo</h3><p>Гібрид «цифрова камера + миттєвий друк» у ретро-корпусі з крутими фізичними елементами керування.</p><ul><li><strong>Креатив:</strong> 10 об’єктивних ефектів × 10 фільтрів (до 100 комбінацій).</li><li><strong>Екран:</strong> кольоровий LCD для прев’ю та вибору кадрів перед друком.</li><li><strong>Зв’язок:</strong> Bluetooth — друк фото зі смартфона.</li><li><strong>Фішки:</strong> електронний затвор, програмований спалах, експокорекція, макро, подвійна експозиція.</li><li><strong>Монтаж:</strong> різьба під штатив.</li><li><strong>Живлення:</strong> вбудований акумулятор, зарядка через USB.</li></ul><h3>Fujifilm INSTAX Mini LiPlay</h3><p>Найкомпактніший гібрид: камера + принтер. Друк зі смартфона, фільтри та «звукова» листівка (QR на фото).</p><ul><li><strong>Дисплей:</strong> 3″ для попереднього перегляду.</li><li><strong>Зв’язок:</strong> Bluetooth, додаток LiPlay.</li><li><strong>Пам’ять:</strong> збереження кадрів перед друком.</li><li><strong>Живлення:</strong> вбудований акумулятор, USB-заряджання.</li><li><strong>Кольори:</strong> Deep Bronze, Matcha Green, Stone White.</li></ul>`
  },
  {
    type: "text",
    title: "Аксесуари Instax (апсел)",
    html: `<ul><li>Чохли/сумки під модель і формат.</li><li>Запасні картриджі (Mini/Square/Wide), тематичні рамки.</li><li>Альбоми для зберігання, рамки для декору.</li><li>Елементи живлення (AA/CR2) або зарядні кабелі/блоки.</li><li>Міні-принтери Instax (для друку зі смартфона без камери).</li></ul>`
  },
  {
    type: "text",
    title: "Canon EOS 5D Mark II / Mark III — повний затверджений матеріал",
    html: `<h3>Canon EOS 5D Mark II</h3><p>Культова повнокадрова DSLR, що свого часу зробила революцію у відео: «кінематографічна» картинка за доступний бюджет.</p><ul><li><strong>Сенсор:</strong> 21,1 МП, повний кадр CMOS.</li><li><strong>ISO:</strong> 100–6400 (розширення до 25600).</li><li><strong>Відео:</strong> Full HD 1080p, до 30 к/с (для свого часу — прорив).</li><li><strong>Серія:</strong> ~3,9 к/с; <strong>AF:</strong> 9 точок, центр перехресний.</li><li><strong>Процесор:</strong> DIGIC 4; <strong>екран:</strong> 3″ високої чіткості.</li><li><strong>Формати:</strong> RAW/JPEG; <strong>носії:</strong> CompactFlash.</li><li><strong>Корпус:</strong> магнієвий сплав.</li></ul><p><em>Сильні сторони:</em> повнокадрова картинка, колір Canon, доступна ціна на вторинці. <em>Слабкі:</em> автофокус і ISO поступаються новішим моделям.</p><h3>Canon EOS 5D Mark III</h3><p>Великий апгрейд щодо швидкості, автофокусу та робочих ISO — все ще актуальна як «робоча конячка» для фото.</p><ul><li><strong>Сенсор:</strong> 22,3 МП, повний кадр CMOS.</li><li><strong>ISO:</strong> 100–25600 (розширення до 102400).</li><li><strong>Відео:</strong> Full HD 1080p з розширеними налаштуваннями/кодеками.</li><li><strong>Серія:</strong> до 6 к/с; <strong>AF:</strong> 61 точка (значно краще трекінг).</li><li><strong>Процесор:</strong> DIGIC 5+; <strong>екран:</strong> 3,2″.</li><li><strong>Слоти:</strong> CF + SD; <strong>корпус:</strong> магнієвий сплав із ущільненням.</li></ul><p><em>Сильні сторони:</em> швидкість, надійність, дві карти, кращий AF/ISO. <em>Слабкі:</em> відео вже не «фішка» проти сучасних бездзеркалок.</p>`
  },
  {
    type: "text",
    title: "Canon 5D Mark II vs 5D Mark III — коротко",
    html: `<p><strong>Бери 5D Mark II, якщо</strong> потрібен недорогий «вхід у повний кадр» для портрета/пейзажу і базового відео.</p><p><strong>Бери 5D Mark III, якщо</strong> важливі швидкість, надійний AF, робочі ISO, дві карти — репортаж/весілля/спорт.</p><div class="table-scroll"><table><thead><tr><th>Параметр</th><th>5D Mark II</th><th>5D Mark III</th></tr></thead><tbody><tr><td>Роздільна здатність</td><td>21,1 МП</td><td>22,3 МП</td></tr><tr><td>ISO (базове)</td><td>100–6400</td><td>100–25600</td></tr><tr><td>Серійна зйомка</td><td>~3,9 к/с</td><td>~6 к/с</td></tr><tr><td>Автофокус</td><td>9 точок</td><td>61 точка (кращий трекінг)</td></tr><tr><td>Носії</td><td>CF</td><td>CF + SD</td></tr><tr><td>Відео</td><td>FHD 1080p (30 к/с)</td><td>FHD 1080p (ширші налаштування)</td></tr><tr><td>Корпус/ущільнення</td><td>Mg-сплав</td><td>Mg-сплав + краще ущільнення</td></tr></tbody></table></div>`
  },
  {
    type: "text",
    title: "Практичні поради клієнту",
    html: `<ul><li><strong>Instax:</strong> знімайте при достатньому світлі або з підсвічуванням; не перетримуйте плівку на спеці; для вечірок — запасні картриджі та батарейки.</li><li><strong>Instax гібриди:</strong> друкуйте «відбрані» кадри — економія плівки, менше браку.</li><li><strong>Canon 5D:</strong> відразу уточнити про <strong>оптику</strong>, карту пам’яті, додатковий акумулятор, зовнішній спалах/синхронізацію.</li><li><strong>Зберігання фото:</strong> альбоми/рамки Instax, оцифровка важливих кадрів.</li></ul>`
  },
  {
    type: "text",
    title: "Висновок і рекомендації",
    html: `<ul><li><strong>Instax Mini 12, SQ1, Mini 40:</strong> найпростіші й стильні — максимум емоцій без налаштувань.</li><li><strong>Instax Mini 90, Wide 300:</strong> більше творчості або великі знімки для компаній.</li><li><strong>Instax Mini Evo / LiPlay:</strong> гібриди зі смартфон-друком і попереднім переглядом.</li><li><strong>Canon 5D Mark II / III:</strong> професійні задачі, де важливі якість, оптика й контроль; Mark III — універсальніший і надійніший у 2025 році.</li></ul>`
  }
];

const camerasDigitalCamerasContent = {
  instaxCameraCatalog,
  canonDslrCatalog,
  digitalCamerasFoundationBlocks,
  digitalCamerasCatalogBlocks
};

export default camerasDigitalCamerasContent;
