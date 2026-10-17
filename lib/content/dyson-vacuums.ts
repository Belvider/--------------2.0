import type { ModuleCatalogProduct, ModuleContentBlock } from "../module-content";

export const dysonVacuumsCatalog: ModuleCatalogProduct[] = [
  {
    slug: "dyson-gen5detect-absolute-pro",
    title: "Dyson Gen5detect Absolute Pro",
    family: "Dyson Gen5detect",
    summary: "Найповніша комплектація Gen5detect для клієнта, якому потрібен максимум насадок, потужності та сценаріїв прибирання.",
    overview: ["Формат: cordless flagship", "Комплектація: Pro", "Фокус: універсальність + аксесуари"],
    highlights: [
      "Електрична турбощітка Digital Motorbar",
      "Насадка з м'яким валиком і лазерним підсвічуванням",
      "Міні-турбощітка",
      "Комбінована насадка і щілинна насадка",
      "Гнучка щілинна насадка для прибирання під низькими меблями",
      "Адаптер для зарядки в автомобілі",
      "Найкращий варіант для клієнта, який хоче максимальну комплектацію без компромісів"
    ],
    colors: [
      {
        label: "Основний рендер",
        imageUrl: "/materials/dyson-vacuums/gen5detect-absolute-pro.png",
        caption: "Dyson Gen5detect Absolute Pro",
        default: true
      }
    ]
  },
  {
    slug: "dyson-gen5detect-absolute",
    title: "Dyson Gen5detect Absolute",
    family: "Dyson Gen5detect",
    summary: "Флагманський бездротовий Dyson із сильною комплектацією для більшості домашніх сценаріїв без Pro-доповнень.",
    overview: ["Формат: cordless flagship", "Комплектація: Absolute", "Фокус: hard floor + carpet"],
    highlights: [
      "Digital Motorbar для універсального прибирання",
      "Насадка з м'яким валиком і лазерним підсвічуванням",
      "Міні-турбощітка",
      "Комбінована та щілинна насадки",
      "Сильна комплектація для твердих підлог, килимів, меблів і щілин",
      "Хороший вибір, коли потрібен преміальний Dyson без рідкісних Pro-аксесуарів"
    ],
    colors: [
      {
        label: "Основний рендер",
        imageUrl: "/materials/dyson-vacuums/gen5detect-absolute.png",
        caption: "Dyson Gen5detect Absolute",
        default: true
      }
    ]
  },
  {
    slug: "dyson-gen5detect",
    title: "Dyson Gen5detect",
    family: "Dyson Gen5detect",
    summary: "Більш базовий Gen5detect для клієнта, який хоче нове покоління Dyson, але з компактнішою комплектацією.",
    overview: ["Формат: cordless flagship", "Комплектація: standard", "Фокус: нове покоління"],
    highlights: [
      "Digital Motorbar і насадка з лазерним підсвічуванням",
      "Міні-турбощітка",
      "Комбінована насадка",
      "Дає ключові переваги лінійки Gen5detect у простішій комплектації",
      "Підходить клієнту, який хоче потужний Dyson без максимальної кількості аксесуарів"
    ],
    colors: [
      {
        label: "Основний рендер",
        imageUrl: "/materials/dyson-vacuums/gen5detect.png",
        caption: "Dyson Gen5detect",
        default: true
      }
    ]
  },
  {
    slug: "dyson-v15-detect-absolute",
    title: "Dyson V15 Detect Absolute",
    family: "Dyson V15",
    summary: "Одна з найсильніших моделей Dyson V15 з лазерним підсвічуванням і ширшою комплектацією для дому з різними поверхнями.",
    overview: ["Потужність: до 230 аВт", "Фокус: laser detect", "Комплектація: Absolute"],
    highlights: [
      "Потужність всмоктування до 230 аВт",
      "Лазерна насадка для виявлення дрібного пилу",
      "Моторизована насадка для килимів",
      "Насадка для твердих підлог з м'якими щетинками",
      "Щітка для шерсті тварин, щілинна та інтенсивна моторизована насадка",
      "Інтелектуально змінює потужність залежно від типу підлоги",
      "До 60 хвилин автономної роботи"
    ],
    colors: [
      {
        label: "Absolute",
        imageUrl: "/materials/dyson-vacuums/v15-detect-absolute.png",
        caption: "Dyson V15 Detect Absolute",
        default: true
      }
    ]
  },
  {
    slug: "dyson-v15-detect",
    title: "Dyson V15 Detect",
    family: "Dyson V15",
    summary: "Стандартний V15 Detect із лазерним сценарієм і сильною потужністю для глибокого щоденного прибирання.",
    overview: ["Потужність: до 230 аВт", "Лазерне підсвічування", "Стандартна комплектація"],
    highlights: [
      "Потужність всмоктування до 230 аВт",
      "Лазерний індикатор пилу допомагає бачити мікрочастинки на твердих підлогах",
      "Циклонна технологія Dyson і HEPA-фільтрація",
      "Автоматично змінює потужність на різних типах поверхні",
      "До 60 хвилин роботи на одному заряді",
      "У стандартній комплектації: насадка для килимів, для твердих підлог, щілинна насадка, лазерна насадка"
    ],
    colors: [
      {
        label: "Standard",
        imageUrl: "/materials/dyson-vacuums/v15-detect.png",
        caption: "Dyson V15 Detect",
        default: true
      }
    ]
  },
  {
    slug: "dyson-v15s-detect-submarine",
    title: "Dyson V15s Detect Submarine",
    family: "Dyson V15",
    summary: "Версія V15 для клієнта, якому потрібне не лише сухе, а й вологе прибирання твердих підлог.",
    overview: ["Формат: dry + wet", "Ключова насадка: Submarine", "Сценарій: тверді підлоги"],
    highlights: [
      "Додає функцію вологого прибирання до сценарію Dyson V15",
      "Насадка Submarine рівномірно зволожує підлогу чистою водою",
      "Пристосований для твердих підлог, а не для килимів у режимі вологого миття",
      "Дає клієнту один пристрій для сухого та вологого прибирання",
      "Найкращий варіант для квартири чи будинку з великим відсотком плитки, ламінату, паркету або вінілу"
    ],
    colors: [
      {
        label: "Submarine",
        imageUrl: "/materials/dyson-vacuums/v15s-detect-submarine.png",
        caption: "Dyson V15s Detect Submarine",
        default: true
      }
    ]
  },
  {
    slug: "dyson-v11-animal",
    title: "Dyson V11 Animal",
    family: "Dyson V11",
    summary: "Версія V11 для домівок із тваринами, де окремий акцент іде на шерсть і прибирання м'яких поверхонь.",
    overview: ["Потужність: до 185 аВт", "Фокус: pet owners", "Комплектація: Animal"],
    highlights: [
      "Щітка для шерсті тварин у комплекті",
      "Моторизована насадка для килимів",
      "Насадка для твердих підлог",
      "Підходить клієнтам, які регулярно прибирають шерсть із диванів, килимів і авто",
      "Сильна модель для будинку з домашніми улюбленцями"
    ],
    colors: [
      {
        label: "Animal",
        imageUrl: "/materials/dyson-vacuums/v11-animal.png",
        caption: "Dyson V11 Animal",
        default: true
      }
    ]
  },
  {
    slug: "dyson-v11",
    title: "Dyson V11",
    family: "Dyson V11",
    summary: "Преміальний бездротовий Dyson із інтелектуальним керуванням потужністю та сильним балансом між автономністю і продуктивністю.",
    overview: ["Потужність: до 185 аВт", "До 60 хв", "Auto mode + дисплей"],
    highlights: [
      "Потужність всмоктування до 185 аВт",
      "Автоматичний, максимальний і економічний режими",
      "LED-дисплей із зарядом, режимом і службовими підказками",
      "HEPA-фільтрація та мотор Dyson Hyperdymium",
      "До 60 хвилин автономності",
      "Універсальний набір насадок для килимів, твердих підлог, шерсті тварин, щілин і комбінованих задач"
    ],
    colors: [
      {
        label: "Standard",
        imageUrl: "/materials/dyson-vacuums/v11.png",
        caption: "Dyson V11",
        default: true
      }
    ]
  },
  {
    slug: "dyson-v10-absolute",
    title: "Dyson V10 Absolute",
    family: "Dyson V10",
    summary: "Збалансована модель Dyson для клієнта, який хоче потужний cordless-сценарій без переходу в найвищий ціновий сегмент.",
    overview: ["Потужність: до 150 аВт", "До 60 хв", "Комплектація: Absolute"],
    highlights: [
      "Потужність всмоктування до 150 аВт",
      "До 60 хвилин автономності",
      "Три режими роботи: Eco, Medium, Max",
      "HEPA-фільтрація і контейнер 0,76 л",
      "У комплекті: килимова насадка, насадка для твердих підлог, pet tool, щілинна та комбінована насадки",
      "Добрий баланс між ціною, можливостями і комплектацією"
    ],
    colors: [
      {
        label: "Absolute",
        imageUrl: "/materials/dyson-vacuums/v10-absolute.png",
        caption: "Dyson V10 Absolute",
        default: true
      }
    ]
  },
  {
    slug: "dyson-v8-absolute",
    title: "Dyson V8 Absolute",
    family: "Dyson V8",
    summary: "Популярний доступніший Dyson із повнішою Absolute-комплектацією для щоденного прибирання квартири або невеликого будинку.",
    overview: ["Потужність: до 115 аВт", "До 40 хв", "Комплектація: Absolute"],
    highlights: [
      "Потужність всмоктування до 115 аВт",
      "До 40 хвилин автономної роботи",
      "HEPA-фільтрація",
      "Комплектація Absolute додає насадку для твердих підлог, pet tool, щілинну та комбіновану насадки",
      "Хороший вхід у Dyson cordless для клієнта з меншим бюджетом"
    ],
    colors: [
      {
        label: "Absolute",
        imageUrl: "/materials/dyson-vacuums/v8-absolute.png",
        caption: "Dyson V8 Absolute",
        default: true
      }
    ]
  },
  {
    slug: "dyson-v8-standard",
    title: "Dyson V8",
    family: "Dyson V8",
    summary: "Базовіша комплектація V8 для клієнта, якому потрібен Dyson без переплати за розширений набір насадок.",
    overview: ["Потужність: до 115 аВт", "До 40 хв", "Стандартна комплектація"],
    highlights: [
      "Працює на моторі Dyson V8",
      "До 40 хвилин автономності",
      "Eco і Max режими потужності",
      "Контейнер 0,54 л і базовий набір насадок",
      "Підходить для щоденного прибирання, коли потрібен cordless Dyson у доступнішому сегменті"
    ],
    colors: [
      {
        label: "Standard",
        imageUrl: "/materials/dyson-vacuums/v8-standard.png",
        caption: "Dyson V8",
        default: true
      }
    ]
  },
  {
    slug: "dyson-wash-g1",
    title: "Dyson WashG1",
    family: "Dyson WashG1",
    summary: "Миючий Dyson для твердих підлог, який поєднує сухе та вологе прибирання в одному сценарії.",
    overview: ["Тип: dry + wet cleaner", "Фокус: тверді підлоги", "До 35 хв"],
    highlights: [
      "Два моторизовані валики з мікрофібри",
      "Сухе та вологе прибирання твердих підлог",
      "Три рівні зволоження",
      "Окремі резервуари для чистої та брудної води",
      "Автоматичне самоочищення валиків",
      "Підходить для площ до 290 м²",
      "Не є основним вибором для килимів — це модель під hard floor cleaning"
    ],
    colors: [
      {
        label: "WashG1",
        imageUrl: "/materials/dyson-vacuums/wash-g1.png",
        caption: "Dyson WashG1",
        default: true
      }
    ]
  },
  {
    slug: "dyson-360-heurist",
    title: "Dyson 360 Heurist",
    family: "Dyson 360",
    summary: "Інтелектуальний робот-пилосос Dyson з 360-градусною камерою, картографією та потужним всмоктуванням.",
    overview: ["Формат: robot vacuum", "Навігація: 360 camera", "До 75 хв"],
    highlights: [
      "360-градусна камера для розпізнавання простору і картографії",
      "Потужна всмоктувальна система для килимів і твердих поверхонь",
      "Багатоступенева фільтрація пилу й алергенів",
      "До 75 хвилин роботи на одному заряді",
      "Керування через додаток Dyson Link і голосових помічників",
      "Автоматичне повернення на зарядну станцію"
    ],
    colors: [
      {
        label: "Heurist",
        imageUrl: "/materials/dyson-vacuums/360-heurist.png",
        caption: "Dyson 360 Heurist",
        default: true
      }
    ]
  },
  {
    slug: "dyson-360-vis-nav",
    title: "Dyson 360 Vis Nav",
    family: "Dyson 360",
    summary: "Більш сучасний робот-пилосос Dyson із Vision System, інтелектуальною навігацією та сильним акцентом на автономне прибирання.",
    overview: ["Формат: robot vacuum", "Vision System", "До 60 хв"],
    highlights: [
      "360-градусна камера для картографії і навігації в реальному часі",
      "Vision System для розпізнавання та обходу перешкод",
      "Мультициклонна система і потужне всмоктування",
      "До 60 хвилин роботи залежно від режиму",
      "Підключення до мобільного додатка і голосове керування",
      "Орієнтований на клієнта, який хоче автоматизоване преміальне прибирання"
    ],
    colors: [
      {
        label: "Vis Nav",
        imageUrl: "/materials/dyson-vacuums/360-vis-nav.png",
        caption: "Dyson 360 Vis Nav",
        default: true
      }
    ]
  }
];

export const dysonVacuumsFoundationBlocks: ModuleContentBlock[] = [
  {
    type: "text",
    title: "Що продає Dyson у категорії пилососів",
    html: `<p>Пилососи Dyson продаються не лише як бездротові пристрої, а як комбінація сильної потужності всмоктування, компактного цифрового мотора, добре продуманої ергономіки й різних насадок під реальні сценарії прибирання.</p><h3>Ключові переваги категорії</h3><ul><li>Висока потужність всмоктування завдяки цифровим моторам і циклонній технології.</li><li>Легкість і маневреність, зручність прибирання меблів, авто та важкодоступних місць.</li><li>Бездротовий формат без прив'язки до розетки.</li><li>Насадки для килимів, твердих підлог, шерсті тварин, щілин і меблів.</li><li>Контроль заряду та зручне спорожнення контейнера без прямого контакту з пилом.</li><li>У старших моделях — інтелектуальне регулювання потужності під тип поверхні.</li></ul>`
  },
  {
    type: "text",
    title: "Як пояснювати різницю між комплектаціями",
    html: `<h3>Standard, Absolute, Animal, Pro</h3><ul><li><strong>Standard:</strong> базовіший набір насадок, нижчий поріг входу.</li><li><strong>Absolute:</strong> повніша комплектація, часто з насадкою для твердих підлог і додатковими інструментами.</li><li><strong>Animal:</strong> акцент на шерсть тварин, м'які меблі та килими.</li><li><strong>Pro:</strong> ще ширший набір аксесуарів для складних сценаріїв і максимуму універсальності.</li></ul><p>У Dyson пилососах різниця між моделями часто не лише в моторі, а й у тому, що саме клієнт отримає в коробці для свого типу дому.</p>`
  },
  {
    type: "image",
    title: "Dyson Gen5detect Absolute Pro",
    url: "/materials/dyson-vacuums/gen5detect-absolute-pro.png",
    caption: "Флагманський cordless-сценарій Dyson у категорії пилососів"
  },
  {
    type: "text",
    title: "Gen5detect і V15: флагмани ручного прибирання",
    html: `<h3>Gen5detect</h3><p>Лінійка Gen5detect — це верхній сегмент cordless Dyson: сильна потужність, лазерне підсвічування пилу, Digital Motorbar і різні варіанти комплектації від стандартної до Absolute Pro.</p><h3>V15 Detect</h3><p>V15 Detect залишається дуже сильним рішенням для клієнта, якому потрібне глибоке прибирання, лазерний контроль пилу й автоматичне підлаштування потужності. Версія <strong>Absolute</strong> дає повнішу комплектацію, а <strong>V15s Detect Submarine</strong> додає вологе прибирання твердих підлог.</p>`
  },
  {
    type: "text",
    title: "V11, V10, V8: логіка середнього та доступнішого сегмента",
    html: `<ul><li><strong>V11:</strong> преміальний баланс потужності, інтелектуальних режимів і дисплея. Версія Animal добре підходить для домівок із тваринами.</li><li><strong>V10 Absolute:</strong> сильний варіант для клієнта, який хоче преміальний Dyson без переходу в найновіший ціновий сегмент.</li><li><strong>V8 Absolute / V8:</strong> більш доступний вхід у Dyson cordless, особливо доречний для квартир, меншої площі та базового щоденного прибирання.</li></ul>`
  },
  {
    type: "text",
    title: "WashG1 і роботи-пилососи Dyson",
    html: `<h3>WashG1</h3><p>WashG1 продаємо окремо від класичних cordless-пилососів: це насамперед миючий Dyson для твердих підлог із dry + wet сценарієм, а не рішення для килимів.</p><h3>360 Heurist і 360 Vis Nav</h3><p>Роботи Dyson — це сценарій автоматизованого прибирання. Їх продаємо клієнту, якому важливі навігація, карта приміщення, віддалене керування через застосунок і мінімум ручної участі в щоденному прибиранні.</p>`
  },
  {
    type: "facts",
    title: "Ключові акценти для продажу Dyson Vacuums",
    items: [
      "Спочатку з'ясовуємо не модель, а тип прибирання: килими, тверді підлоги, шерсть тварин, авто, велика площа, потреба у вологому митті чи роботі-пилососі.",
      "Absolute майже завжди легше продавати клієнту, який хоче повніше рішення одразу з коробки.",
      "Animal особливо релевантний для домівок із тваринами, де болить шерсть на диванах, килимах і сидіннях авто.",
      "V15s Submarine і WashG1 потрібно продавати через hard floor cleaning, а не як повну заміну класичному килимовому сценарію.",
      "Роботи Dyson продаються не як дешевий комфорт, а як преміальна автоматизація з сильною навігацією і всмоктуванням.",
      "У Dyson важливо підкреслювати не тільки мотор, а й зручність спорожнення контейнера, фільтрацію, ергономіку і сценарій насадок."
    ]
  }
];

export const dysonVacuumsCatalogBlocks: ModuleContentBlock[] = [
  {
    type: "text",
    title: "Dyson Vacuums — моделі, комплектації та сценарії",
    html: `<p>У цьому модулі зібрані ключові пилососи Dyson: ручні cordless-моделі, миюче рішення WashG1 і роботи-пилососи 360. Каталог допомагає швидко пояснити різницю між Standard, Absolute, Animal, Pro і новішими функціональними сценаріями.</p>`
  },
  {
    type: "productCatalog",
    title: "Dyson пилососи — моделі та характеристики",
    products: dysonVacuumsCatalog
  },
  {
    type: "text",
    title: "Швидкий підбір під потребу клієнта",
    html: `<ul><li><strong>Потрібен максимум Dyson у ручному форматі:</strong> Gen5detect Absolute Pro або Absolute.</li><li><strong>Потрібен сильний флагман із лазером:</strong> V15 Detect або V15 Detect Absolute.</li><li><strong>Потрібне ще й вологе прибирання твердих підлог:</strong> V15s Detect Submarine або WashG1 залежно від сценарію.</li><li><strong>У домі є тварини:</strong> V11 Animal або Absolute-комплектації з pet tool.</li><li><strong>Потрібен більш доступний Dyson cordless:</strong> V10 Absolute або V8.</li><li><strong>Потрібна автоматизація прибирання:</strong> 360 Heurist або 360 Vis Nav.</li></ul>`
  },
  {
    type: "facts",
    title: "Швидкий орієнтир по Dyson Vacuums",
    items: [
      "Gen5detect = верхній cordless-сегмент Dyson.",
      "V15 Detect = флагман із лазерним контролем пилу та сильною автоматикою.",
      "V11 = баланс преміальності, дисплея та потужності.",
      "V10/V8 = доступніші входи в Dyson cordless.",
      "WashG1 = тверді підлоги і вологе прибирання.",
      "360 Heurist / 360 Vis Nav = роботизоване прибирання з картографією й застосунком."
    ]
  }
];

const dysonVacuumsContent = {
  dysonVacuumsCatalog,
  dysonVacuumsFoundationBlocks,
  dysonVacuumsCatalogBlocks
};

export default dysonVacuumsContent;
