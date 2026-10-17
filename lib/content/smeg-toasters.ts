import type { ModuleCatalogProduct, ModuleContentBlock } from "../module-content";

export const smegToasterCatalog: ModuleCatalogProduct[] = [
  {
    slug: "smeg-tsf02",
    title: "Smeg TSF02",
    family: "Toaster",
    summary:
      "Тостер для клієнта, якому потрібен більший формат і комфортний щоденний сценарій під кілька скибок одразу в фірмовому ретро-дизайні Smeg.",
    overview: ["Формат: 4 скибки / 2 довгі щілини", "6 рівнів підсмажування", "Фокус: family toaster"],
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
      "Компактніший тостер Smeg для клієнта, якому важливий стильний щоденний toaster-сценарій на 1-2 порції без зайвого об'єму.",
    overview: ["Формат: 2 скибки", "6 рівнів підсмажування", "Фокус: compact daily toaster"],
    highlights: [
      "Підходить для базового щоденного сценарію на одну-дві порції",
      "Дає 6 рівнів підсмажування і знайомі режими підігріву, розморожування та bagel",
      "Знімний піддон для крихт спрощує догляд",
      "Менший формат краще заходить у компактну кухню або для користування однією людиною",
      "Логічний вибір, якщо клієнту не потрібен більший корпус і кілька скибок одночасно"
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
    title: "TSF02 vs TSF03: коротка логіка",
    html: `<h3>TSF02</h3><ul><li><strong>Більший формат:</strong> чотири скибки, дві довгі щілини, зручніше для сім'ї або активного сніданкового сценарію.</li><li>Підійде, якщо клієнт часто готує більше тостів за один раз.</li></ul><h3>TSF03</h3><ul><li><strong>Компактніший сценарій:</strong> дві скибки, той самий стиль і базові функції.</li><li>Підійде для невеликої кухні або щоденного користування на одну-дві людини.</li></ul>`
  },
  {
    type: "facts",
    title: "Що спільного для обох моделей",
    items: [
      "6 рівнів підсмажування для різних уподобань по скоринці.",
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
    caption: "Компактніший тостер Smeg для щоденного сценарію"
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
    html: `<p>У цьому модулі зібрані дві основні моделі з вашого матеріалу: <strong>TSF02</strong> для більшого сніданкового сценарію та <strong>TSF03</strong> для компактнішого щоденного використання. Обидві моделі тримають фірмову ретро-естетику Smeg, але закривають різні потреби за об'ємом і форматом використання.</p>`
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
      "TSF03 - якщо потрібен компактніший щоденний варіант на одну-дві людини.",
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
    title: "Оригінальний конспект: TSF02 та TSF03",
    html: `<h3>Основні моделі</h3><h4>SMEG TSF02</h4><ul><li>Тип: чотирискибковий тостер (2 довгі щілини)</li><li>6 рівнів підсмажування</li><li>Функції: підігрів, розморожування, «багель»</li><li>Знімний піддон для крихт, центровані напрямні</li></ul><p><strong>Доступні кольори:</strong> White, Red, Cream, Pastel Blue, Pastel Green, Pink, Black, Steel.</p><h4>SMEG TSF03</h4><ul><li>Тип: двоскибковий тостер</li><li>6 рівнів підсмажування</li><li>Функції: підігрів, розморожування, «багель»</li><li>Знімний піддон для крихт</li></ul><p><strong>Доступні кольори:</strong> White, Red, Cream, Pastel Blue, Pastel Green, Pink, Black, Steel.</p><p>Тостери SMEG — стильний ретро-акцент і стабільний результат щодня.</p>`
  }
];

const smegToastersContent = {
  smegToasterCatalog,
  smegToastersFoundationBlocks,
  smegToastersCatalogBlocks
};

export default smegToastersContent;
