import type { ModuleCatalogProduct, ModuleContentBlock } from "../module-content";

export const smegToasterCatalog: ModuleCatalogProduct[] = [
  {
    slug: "smeg-tsf02",
    title: "Smeg TSF02",
    family: "Toaster",
    summary:
      "Тостер для клієнта, якому потрібен більший формат і комфортний щоденний сценарій під кілька скибок одразу в фірмовому ретро-дизайні Smeg.",
    overview: ["Формат: 4 скибки / 2 довгі щілини", "6 рівнів підсмажування", "Для кількох порцій одночасно"],
    highlights: [
      "Працює з чотирма скибками завдяки двом довгим щілинам",
      "Має 6 рівнів підсмажування для гнучкішого результату",
      "Підтримує підігрів, розморожування та режим bagel",
      "Знімний піддон для крихт і центровані напрямні спрощують щоденне користування",
      "Хороший вибір для сім'ї або клієнта, який часто готує сніданок на кількох людей"
    ],
    colors: [
      {
        label: "White",
        imageUrl: "/materials/smeg-toasters/smeg-tsf02-white.png",
        caption: "TSF02 - білий",
        default: true
      },
      {
        label: "Red",
        imageUrl: "/materials/smeg-toasters/smeg-tsf02-red.png",
        caption: "TSF02 - червоний"
      },
      {
        label: "Cream",
        imageUrl: "/materials/smeg-toasters/smeg-tsf02-cream.png",
        caption: "TSF02 - кремовий"
      },
      {
        label: "Pastel Blue",
        imageUrl: "/materials/smeg-toasters/smeg-tsf02-pastel-blue.png",
        caption: "TSF02 - пастельно-блакитний"
      },
      {
        label: "Pastel Green",
        imageUrl: "/materials/smeg-toasters/smeg-tsf02-pastel-green.png",
        caption: "TSF02 - пастельно-зелений"
      },
      {
        label: "Pink",
        imageUrl: "/materials/smeg-toasters/smeg-tsf02-pink.png",
        caption: "TSF02 - рожевий"
      },
      {
        label: "Black",
        imageUrl: "/materials/smeg-toasters/smeg-tsf02-black.png",
        caption: "TSF02 - чорний"
      },
      {
        label: "Steel",
        imageUrl: "/materials/smeg-toasters/smeg-tsf02-steel.png",
        caption: "TSF02 - сталь"
      }
    ]
  },
  {
    slug: "smeg-tsf03",
    title: "Smeg TSF03",
    family: "Toaster",
    summary:
      "Тостер із чотирма окремими слотами та двома незалежними зонами керування: можна одночасно готувати тости з різним ступенем підсмажування.",
    overview: ["Формат: 4 скибки / 4 слоти", "6 рівнів підсмажування", "Дві незалежні зони керування"],
    highlights: [
      "Чотири окремі слоти вміщують до чотирьох скибок",
      "Дає 6 рівнів підсмажування і знайомі режими підігріву, розморожування та bagel",
      "Два знімні піддони для крихт спрощують догляд",
      "Дві незалежні панелі дають змогу окремо налаштовувати пари слотів",
      "Підходить, коли члени сім’ї полюбляють різний ступінь підсмажування"
    ],
    colors: [
      {
        label: "White",
        imageUrl: "/materials/smeg-toasters/smeg-tsf03-white.png",
        caption: "TSF03 - білий",
        default: true
      },
      {
        label: "Red",
        imageUrl: "/materials/smeg-toasters/smeg-tsf03-red.png",
        caption: "TSF03 - червоний"
      },
      {
        label: "Cream",
        imageUrl: "/materials/smeg-toasters/smeg-tsf03-cream.png",
        caption: "TSF03 - кремовий"
      },
      {
        label: "Pastel Blue",
        imageUrl: "/materials/smeg-toasters/smeg-tsf03-pastel-blue.png",
        caption: "TSF03 - пастельно-блакитний"
      },
      {
        label: "Pastel Green",
        imageUrl: "/materials/smeg-toasters/smeg-tsf03-pastel-green.png",
        caption: "TSF03 - пастельно-зелений"
      },
      {
        label: "Pink",
        imageUrl: "/materials/smeg-toasters/smeg-tsf03-pink.png",
        caption: "TSF03 - рожевий"
      },
      {
        label: "Black",
        imageUrl: "/materials/smeg-toasters/smeg-tsf03-black.png",
        caption: "TSF03 - чорний"
      },
      {
        label: "Steel",
        imageUrl: "/materials/smeg-toasters/smeg-tsf03-steel.png",
        caption: "TSF03 - сталь"
      }
    ]
  }
];

export const smegToastersFoundationBlocks: ModuleContentBlock[] = [
  {
    type: "text",
    title: "Тостери SMEG",
    html: `<p>Тостери SMEG поєднують ретро-стиль 50-х із сучасними функціями та надійністю.</p>`
  },
  {
    type: "text",
    title: "Smeg-тостери: як продавати категорію",
    html: `<p><strong>Тостери Smeg</strong> - це категорія, де дизайн і побутовий сценарій однаково важливі. Клієнт рідко купує такий тостер лише заради сухих характеристик: він купує <strong>щоденний комфорт</strong>, <strong>ретро-естетику</strong> і відчуття, що техніка красиво виглядає на кухні щодня.</p><p>На консультації важливо швидко зрозуміти, чи потрібен <strong>більший формат для сім'ї</strong>, чи достатньо <strong>компактнішого тостера на 1-2 людини</strong>. Уже після цього має сенс переходити до кольору й деталей режимів.</p>`
  },
  {
    type: "facts",
    title: "Що уточнити перед рекомендацією",
    items: [
      "Скільки скибок зазвичай готують одночасно: одна-дві чи більше.",
      "Чи користуватиметься тостером одна людина, пара або сім'я.",
      "Чи важливі режими розморожування, підігріву та bagel-сценарій.",
      "Наскільки критичний колір під інтер'єр кухні.",
      "Чи є в клієнта вже інша техніка Smeg, під яку треба підібрати колір і стиль."
    ]
  },
  {
    type: "text",
    title: "TSF02 і TSF03: у чому різниця",
    html: `<h3>TSF02</h3><ul><li>Два довгі слоти для довгих скибок або до чотирьох стандартних тостів.</li><li>Спільне керування ступенем підсмажування.</li></ul><h3>TSF03</h3><ul><li>Чотири окремі слоти для стандартних скибок.</li><li>Дві незалежні зони керування для різних налаштувань одночасно.</li></ul><p>Обидві моделі вміщують до чотирьох скибок. Вибір залежить від формату хліба, потрібного керування та місця на стільниці.</p>`
  },
  {
    type: "facts",
    title: "Що спільного для обох моделей",
    items: [
      "6 рівнів підсмажування для різного ступеня рум’яності.",
      "Режими підігріву, розморожування та bagel.",
      "Знімний піддон для крихт для простішого догляду.",
      "Фірмовий ретро-дизайн Smeg як сильний аргумент продажу."
    ]
  },
  {
    type: "image",
    title: "Smeg TSF02",
    url: "/materials/smeg-toasters/smeg-tsf02-white.png",
    caption: "Більший тостер Smeg для кількох скибок одразу"
  },
  {
    type: "image",
    title: "Smeg TSF03",
    url: "/materials/smeg-toasters/smeg-tsf03-white.png",
    caption: "Тостер Smeg із чотирма слотами та двома зонами керування"
  },
  {
    type: "facts",
    title: "Апсел і супутні продажі",
    items: [
      "Чайники, кавоварки та інша техніка Smeg у тому ж кольорі або стилі.",
      "Сервірувальні аксесуари або кухонні дрібниці під сніданковий сценарій.",
      "Продаж кольором: коли функціонально все підходить, саме колір часто закриває угоду.",
      "Наголос на щоденному комфорті й естетиці кухні працює краще, ніж суха технічна мова."
    ]
  }
];

export const smegToastersCatalogBlocks: ModuleContentBlock[] = [
  {
    type: "text",
    title: "Каталог тостерів Smeg",
    html: `<p>Порівняйте тостери <strong>Smeg TSF02</strong> і <strong>TSF03</strong> за кількістю та форматом слотів, режимами й габаритами. Уточніть розмір хліба, кількість тостів за один раз і місце на кухні.</p>`
  },
  {
    type: "productCatalog",
    title: "Smeg TSF02 та TSF03",
    products: smegToasterCatalog
  },
  {
    type: "facts",
    title: "Кому що рекомендувати",
    items: [
      "TSF02 - якщо тостер потрібен для кількох людей або частого приготування одразу кількох тостів.",
      "TSF03 — якщо потрібно незалежно налаштовувати дві пари слотів.",
      "Якщо клієнт вагається, повертаємось до питання: скільки тостів він реально робить за один раз.",
      "Якщо функціонально підходять обидві моделі, фінальний вибір часто вирішується кольором і розміром корпусу."
    ]
  },
  {
    type: "facts",
    title: "Швидкі аргументи для продавця",
    items: [
      "Smeg-тостер продається як частина красивої кухонної екосистеми, а не просто як пристрій для хліба.",
      "6 рівнів підсмажування й базові режими дають потрібну практичність без перевантаження інтерфейсу.",
      "Знімний піддон для крихт - проста, але важлива побутова деталь, яку варто проговорювати.",
      "У кольорових лінійках Smeg покупець часто вибирає очима, тому блок кольорів треба показувати активно."
    ]
  },
  {
    type: "text",
    title: "TSF02 та TSF03: основні характеристики",
    html: `<h3>Основні моделі</h3><h4>SMEG TSF02</h4><ul><li>Тип: чотирискибковий тостер (2 довгі щілини)</li><li>6 рівнів підсмажування</li><li>Функції: підігрів, розморожування, «багель»</li><li>Знімний піддон для крихт, центровані напрямні</li></ul><p><strong>Доступні кольори:</strong> White, Red, Cream, Pastel Blue, Pastel Green, Pink, Black, Steel.</p><h4>SMEG TSF03</h4><ul><li>Тип: чотирискибковий тостер із чотирма слотами та двома незалежними зонами керування</li><li>6 рівнів підсмажування</li><li>Функції: підігрів, розморожування, «багель»</li><li>Знімний піддон для крихт</li></ul><p><strong>Доступні кольори:</strong> White, Red, Cream, Pastel Blue, Pastel Green, Pink, Black, Steel.</p><p>Точні характеристики й розміри: <a href="https://www.smeg.com/ie/products/TSF02SSUK" target="_blank" rel="noopener noreferrer">Smeg TSF02</a>, <a href="https://www.smeg.com/ie/products/TSF03SSUK" target="_blank" rel="noopener noreferrer">Smeg TSF03</a>.</p>`
  }
];

const smegToastersContent = {
  smegToasterCatalog,
  smegToastersFoundationBlocks,
  smegToastersCatalogBlocks
};

export default smegToastersContent;
