import type { ModuleCatalogProduct, ModuleContentBlock } from "../module-content";

export const smegKettleCatalog: ModuleCatalogProduct[] = [
  {
    slug: "smeg-klf03",
    title: "Smeg KLF03",
    family: "Electric kettle",
    summary:
      "Класичний електрочайник Smeg для клієнта, якому важливі дизайн, об'єм 1,7 л і простий щоденний сценарій кип'ятіння води без температурних налаштувань.",
    overview: ["Об'єм: 1,7 л", "Потужність: 2400 Вт", "Фокус: classic retro kettle"],
    highlights: [
      "Корпус із нержавіючої сталі з емалевим покриттям добре поєднує довговічність і преміальний вигляд",
      "Поворотна база 360° та прихований кабель зручні в повсякденному користуванні",
      "Має автоматичне вимкнення, захист від 'сухого' ходу та фільтр від накипу",
      "Об'єм 1,7 л добре підходить для сім'ї або кількох чашок поспіль",
      "Сильний вибір для клієнта, який хоче стильний чайник без переплати за терморегуляцію"
    ],
    colors: [
      {
        label: "Pastel Blue",
        imageUrl: "/materials/smeg-kettles/smeg-klf03-pastel-blue.png",
        caption: "KLF03 - пастельно-блакитний",
        default: true
      },
      {
        label: "Pastel Green",
        imageUrl: "/materials/smeg-kettles/smeg-klf03-pastel-green.png",
        caption: "KLF03 - пастельно-зелений"
      },
      {
        label: "Cream",
        imageUrl: "/materials/smeg-kettles/smeg-klf03-cream.png",
        caption: "KLF03 - кремовий"
      },
      {
        label: "Red",
        imageUrl: "/materials/smeg-kettles/smeg-klf03-red.png",
        caption: "KLF03 - червоний"
      },
      {
        label: "Black",
        imageUrl: "/materials/smeg-kettles/smeg-klf03-black.png",
        caption: "KLF03 - чорний"
      },
      {
        label: "Steel",
        imageUrl: "/materials/smeg-kettles/smeg-klf03-steel.png",
        caption: "KLF03 - сталь"
      },
      {
        label: "Grey",
        imageUrl: "/materials/smeg-kettles/smeg-klf03-grey.png",
        caption: "KLF03 - сірий"
      },
      {
        label: "Pink",
        imageUrl: "/materials/smeg-kettles/smeg-klf03-pink.png",
        caption: "KLF03 - рожевий"
      },
      {
        label: "Matte Black",
        imageUrl: "/materials/smeg-kettles/smeg-klf03-black.png",
        caption: "KLF03 - матовий чорний"
      },
      {
        label: "White",
        imageUrl: "/materials/smeg-kettles/smeg-klf03-white.png",
        caption: "KLF03 - білий"
      },
      {
        label: "Gold",
        imageUrl: "/materials/smeg-kettles/smeg-klf03-gold.png",
        caption: "KLF03 - золотий"
      },
      {
        label: "Rose Gold",
        imageUrl: "/materials/smeg-kettles/smeg-klf03-rose-gold.png",
        caption: "KLF03 - рожеве золото"
      },
      {
        label: "Dolce Gabbana",
        imageUrl: "/materials/smeg-kettles/smeg-klf03-dolce-gabbana.png",
        caption: "KLF03 - Dolce Gabbana"
      }
    ]
  },
  {
    slug: "smeg-klf04",
    title: "Smeg KLF04",
    family: "Temperature control kettle",
    summary:
      "Преміальний чайник Smeg з терморегуляцією для клієнта, якому важливі різні температури води, підтримка тепла й більш гнучкий tea/coffee-сценарій.",
    overview: ["Об'єм: 1,7 л", "Температура: 50-100°C", "Фокус: temperature control"],
    highlights: [
      "Дозволяє вибирати температуру 50, 60, 70, 80, 90, 95 або 100 °C",
      "Підтримує тепло до 20 хвилин після нагріву",
      "Підходить для різних напоїв, де кип'яток не завжди є оптимальним",
      "Зберігає фірмовий ретро-дизайн Smeg і зручну базу 360°",
      "Найкраще продається клієнту, який хоче не просто чайник, а більш контрольований щоденний сценарій"
    ],
    colors: [
      {
        label: "White",
        imageUrl: "/materials/smeg-kettles/smeg-klf04-white.png",
        caption: "KLF04 - білий",
        default: true
      },
      {
        label: "Red",
        imageUrl: "/materials/smeg-kettles/smeg-klf04-red.png",
        caption: "KLF04 - червоний"
      },
      {
        label: "Cream",
        imageUrl: "/materials/smeg-kettles/smeg-klf04-cream.png",
        caption: "KLF04 - кремовий"
      },
      {
        label: "Pastel Blue",
        imageUrl: "/materials/smeg-kettles/smeg-klf04-pastel-blue.png",
        caption: "KLF04 - пастельно-блакитний"
      },
      {
        label: "Pastel Green",
        imageUrl: "/materials/smeg-kettles/smeg-klf04-pastel-green.png",
        caption: "KLF04 - пастельно-зелений"
      },
      {
        label: "Pink",
        imageUrl: "/materials/smeg-kettles/smeg-klf04-pink.png",
        caption: "KLF04 - рожевий"
      },
      {
        label: "Black",
        imageUrl: "/materials/smeg-kettles/smeg-klf04-black.png",
        caption: "KLF04 - чорний"
      },
      {
        label: "Steel",
        imageUrl: "/materials/smeg-kettles/smeg-klf04-steel.png",
        caption: "KLF04 - сталь"
      }
    ]
  }
];

export const smegKettlesFoundationBlocks: ModuleContentBlock[] = [
  {
    type: "text",
    title: "Чайники SMEG",
    html: `<p>Електрочайники SMEG — поєднання ретро-стилю 50-х, сучасних технологій та елегантного дизайну. Ідеально доповнюють інтер’єр кухні і дарують комфорт щодня.</p>`
  },
  {
    type: "text",
    title: "Особливості техніки Smeg (Чайник)",
    html: `<ul><li><strong>Дизайн:</strong> обтічний корпус, пастельні тони, хромовані елементи, мінімалістичний логотип.</li><li><strong>Корпус з нержавіючої сталі:</strong> підпружинена кришка з плавним відкриттям, ущільнення з термостійкої гуми, база з намотуванням кабелю та поворотом 360°.</li><li><strong>Віконце рівня води:</strong> 0,5 / 1,0 / 1,5 / 1,7 л (з підказкою кількості чашок).</li><li><strong>Опції нагріву (KLF04):</strong> 50–100°C, підтримання температури, автоматичне вимкнення, скасування при знятті з бази, «сон» після 60 с.</li></ul>`
  },
  {
    type: "text",
    title: "Smeg-чайники: як продавати категорію",
    html: `<p><strong>Smeg KLF03 і KLF04</strong> продаються не лише як електрочайники, а як поєднання <strong>дизайну</strong>, <strong>щоденного комфорту</strong> і в деяких випадках <strong>контролю температури</strong>. Для частини клієнтів чайник Smeg - це акцент кухні, який має вписатись у стиль простору. Для інших - важливо, чи є сенс переплачувати за модифікацію з терморегуляцією.</p><p>Тому на консультації ми швидко розводимо запит: потрібен <strong>класичний чайник</strong> для щоденного кип'ятіння чи <strong>модель із температурними режимами</strong> під чай, альтернативну каву й точніший контроль води.</p>`
  },
  {
    type: "facts",
    title: "Що уточнити перед рекомендацією",
    items: [
      "Чи потрібне клієнту просто кип'ятіння води, чи важливі різні температурні режими.",
      "Чи буде чайник використовуватись щодня всією сім'єю або епізодично для однієї людини.",
      "Наскільки критичний зовнішній вигляд і підбір конкретного кольору під кухню.",
      "Чи готує клієнт напої, де важлива не кипляча вода: зелений чай, дитячі суміші, альтернативна кава.",
      "Чи потрібне підтримання температури після нагріву."
    ]
  },
  {
    type: "text",
    title: "KLF03 vs KLF04: коротка логіка",
    html: `<h3>KLF03</h3><ul><li><strong>Класичний сценарій:</strong> 1,7 л, 2400 Вт, автоматичне вимкнення, захист від 'сухого' ходу, фільтр від накипу.</li><li>Підходить клієнту, якому важливі бренд, дизайн і простота без зайвих налаштувань.</li></ul><h3>KLF04</h3><ul><li><strong>Просунутіший сценарій:</strong> температурні режими 50-100°C, підтримка тепла, більше контролю над приготуванням напоїв.</li><li>Підходить клієнту, який реально користуватиметься різними температурами, а не лише оцінює дизайн.</li></ul>`
  },
  {
    type: "facts",
    title: "Ключові переваги лінійки",
    items: [
      "Корпус з нержавіючої сталі та впізнаваний ретро-дизайн 50-х років.",
      "Підпружинена кришка з плавним відкриттям і база 360° для зручності.",
      "Віконце рівня води допомагає швидко орієнтуватися в об'ємі.",
      "Smeg часто купують як техніку, що має не лише працювати, а й виглядати як частина інтер'єру."
    ]
  },
  {
    type: "image",
    title: "Smeg KLF03",
    url: "/materials/smeg-kettles/smeg-klf03-pastel-blue.png",
    caption: "Класичний чайник Smeg KLF03"
  },
  {
    type: "image",
    title: "Smeg KLF04",
    url: "/materials/smeg-kettles/smeg-klf04-white.png",
    caption: "Smeg KLF04 з терморегуляцією"
  },
  {
    type: "facts",
    title: "Апсел і супутні продажі",
    items: [
      "Чайні набори, чашки та інші кухонні аксесуари Smeg у тому ж стилі.",
      "Техніка з тієї ж кольорової лінійки: тостери, кавоварки, інша мала побутова техніка бренду.",
      "Засоби для догляду від накипу та регулярного очищення.",
      "Продаж кольором: якщо модель підходить функціонально, колір часто стає головним тригером покупки."
    ]
  }
];

export const smegKettlesCatalogBlocks: ModuleContentBlock[] = [
  {
    type: "text",
    title: "Каталог чайників Smeg",
    html: `<p><strong>Smeg KLF03</strong> підходить для звичайного кип’ятіння води, а <strong>KLF04</strong> дає змогу вибирати температуру. Уточніть, які напої готує клієнт і чи потрібен йому контроль нагрівання.</p>`
  },
  {
    type: "productCatalog",
    title: "Smeg KLF03 та KLF04",
    products: smegKettleCatalog
  },
  {
    type: "facts",
    title: "Кому що рекомендувати",
    items: [
      "KLF03 - якщо клієнту потрібен стильний надійний чайник без складних сценаріїв.",
      "KLF04 - якщо клієнт буде реально використовувати різні температури й режим підтримки тепла.",
      "Якщо між моделями складно визначитись, повертаємось до питання: чайник просто для окропу чи для керованого tea/coffee-сценарію.",
      "Коли обидві моделі функціонально підходять, колір і сумісність з інтер'єром часто вирішують усе."
    ]
  },
  {
    type: "facts",
    title: "Швидкі аргументи для продавця",
    items: [
      "KLF03 - це найпростіший вхід у Smeg-естетику без переплати за температурні режими.",
      "KLF04 добре продається тим, хто п'є не лише чорний чай і хоче більше контролю.",
      "База 360°, зручна кришка й віконце рівня води - це не дрібниці, а реальний щоденний комфорт.",
      "Широка палітра кольорів у Smeg - сильний інструмент консультації, а не просто декоративний бонус."
    ]
  },
  {
    type: "text",
    title: "KLF03 та KLF04: основні характеристики",
    html: `<h3>Основні моделі</h3><h4>Smeg KLF03</h4><ul><li>Об’єм: 1,7 л (≈7 чашок)</li><li>Корпус: нержавіюча сталь з емалевим покриттям</li><li>Потужність: 2400 Вт</li><li>Авто-вимкнення, захист від «сухого» ходу, фільтр від накипу</li><li>Поворотна база 360°, прихований кабель</li></ul><p><strong>Доступні кольори:</strong> Pastel Blue, Pastel Green, Cream, Red, Black, Steel, Grey, Pink, Matte Black, White, Gold, Rose Gold, Dolce Gabbana.</p><h4>Smeg KLF04 з терморегуляцією</h4><ul><li>Об’єм: 1,7 л</li><li>Температурні режими: 50, 60, 70, 80, 90, 95 або 100 °C</li><li>Підтримання тепла: до 20 хв</li><li>Авто-вимкнення; база 360°</li></ul><p><strong>Доступні кольори:</strong> White, Red, Cream, Pastel Blue, Pastel Green, Pink, Black, Steel.</p><p>Ці чайники SMEG — не просто побутова техніка, а стильний акцент вашої кухні.</p>`
  }
];

const smegKettlesContent = {
  smegKettleCatalog,
  smegKettlesFoundationBlocks,
  smegKettlesCatalogBlocks
};

export default smegKettlesContent;
