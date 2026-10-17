import type { ModuleCatalogProduct, ModuleContentBlock } from "../module-content";

export const marshallSpeakersCatalog: ModuleCatalogProduct[] = [
  {
    slug: "marshall-woburn-ii",
    title: "Marshall Woburn II",
    family: "Home speaker",
    summary:
      "Найпотужніша домашня колонка Marshall другого покоління для великих кімнат, вечірок і клієнтів, яким потрібен масштабний звук у вінтажному корпусі.",
    overview: ["Формат: стаціонарна акустика", "Bluetooth: 5.0", "Фокус: великі приміщення"],
    highlights: [
      "2 × 50 Вт для НЧ-динаміків і 2 × 15 Вт для ВЧ-динаміків",
      "Діапазон частот: 30–20 000 Гц",
      "Підключення: Bluetooth 5.0, 3,5 мм, RCA",
      "Підтримка кодеків SBC та aptX",
      "Вага 8,55 кг і формат великої домашньої акустики",
      "Кольори: Black, White, Brown",
      "Працює від мережі та підтримує додаток Marshall Bluetooth"
    ],
    colors: [
      {
        label: "Woburn II",
        imageUrl: "/materials/marshall-bluetooth-speakers/woburn-ii.png",
        caption: "Marshall Woburn II",
        default: true
      }
    ]
  },
  {
    slug: "marshall-woburn-iii",
    title: "Marshall Woburn III Bluetooth",
    family: "Home speaker",
    summary:
      "Оновлена велика домашня колонка Marshall із HDMI, Bluetooth 5.2 і ще більш сучасним сценарієм використання біля телевізора або вітальні.",
    overview: ["Формат: стаціонарна акустика", "Bluetooth: 5.2", "Фокус: великий звук + HDMI"],
    highlights: [
      "6-дюймовий вуфер, 2 × 3/4-дюймові твітера і 2 × 2-дюймові середньочастотні драйвери",
      "Потужність 150 Вт",
      "Частотний діапазон: 30 Гц – 20 кГц",
      "Підключення: Bluetooth 5.2, RCA, 3,5 мм, HDMI",
      "Dynamic Loudness для корекції тонального балансу",
      "Преміальний вінтажний дизайн Marshall",
      "Хороший вибір для клієнта, який хоче найбільшу домашню колонку Marshall нового покоління"
    ],
    colors: [
      {
        label: "Black",
        imageUrl: "/materials/marshall-bluetooth-speakers/woburn-iii.png",
        caption: "Marshall Woburn III Bluetooth",
        default: true
      }
    ]
  },
  {
    slug: "marshall-stanmore-ii",
    title: "Marshall Stanmore II",
    family: "Home speaker",
    summary:
      "Найбільш збалансована домашня колонка Marshall для вітальні: менша за Woburn, але дуже універсальна за потужністю і габаритами.",
    overview: ["Формат: стаціонарна акустика", "Bluetooth: 5.0", "Фокус: баланс розміру і потужності"],
    highlights: [
      "1 × 50 Вт для НЧ-динаміка і 2 × 15 Вт для ВЧ-динаміків",
      "Частотний діапазон: 50–20 000 Гц",
      "Підключення: Bluetooth 5.0, 3,5 мм, RCA",
      "Підтримка SBC та aptX",
      "Вага 4,65 кг — відчутно зручніший формат для дому, ніж Woburn",
      "Кольори: Black, White, Brown",
      "Хороший вибір, коли клієнту треба домашній Marshall без переходу в найбільший клас"
    ],
    colors: [
      {
        label: "Stanmore II",
        imageUrl: "/materials/marshall-bluetooth-speakers/stanmore-ii.png",
        caption: "Marshall Stanmore II",
        default: true
      }
    ]
  },
  {
    slug: "marshall-stanmore-iii",
    title: "Marshall Stanmore III Bluetooth",
    family: "Home speaker",
    summary:
      "Актуальна універсальна домашня модель Marshall із сучаснішим Bluetooth та звичним фірмовим характером для вітальні або великої кімнати.",
    overview: ["Формат: стаціонарна акустика", "Bluetooth: 5.2", "Фокус: living room all-rounder"],
    highlights: [
      "1 × 6,5-дюймовий вуфер і 2 × 3/4-дюймові твітера",
      "Потужність 80 Вт: 50 Вт вуфер + 2 × 15 Вт твітера",
      "Частотний діапазон: 45 Гц – 20 кГц",
      "Вага 4,25 кг",
      "Класичний Marshall-дизайн із текстурованою обшивкою та сіткою з перцевим візерунком",
      "Працює з додатком Marshall Bluetooth",
      "Добре продається як золота середина між Woburn і Acton"
    ],
    colors: [
      {
        label: "Black",
        imageUrl: "/materials/marshall-bluetooth-speakers/stanmore-iii.png",
        caption: "Marshall Stanmore III Bluetooth",
        default: true
      }
    ]
  },
  {
    slug: "marshall-acton-ii",
    title: "Marshall Acton II",
    family: "Home speaker",
    summary:
      "Компактна домашня модель Marshall для невеликих приміщень, де важливі габарити, дизайн і гучне звучання без великого корпусу.",
    overview: ["Формат: компактна домашня акустика", "Bluetooth: 5.0", "Фокус: невеликі приміщення"],
    highlights: [
      "1 × 30 Вт для НЧ-динаміка і 2 × 15 Вт для ВЧ-динаміків",
      "Частотний діапазон: 50–20 000 Гц",
      "Підключення: Bluetooth 5.0, 3,5 мм",
      "Кодек SBC",
      "Вага 2,85 кг і справді компактний корпус",
      "Кольори: Black, White, Brown",
      "Позиціонується як маленька, але дуже гучна домашня колонка Marshall"
    ],
    colors: [
      {
        label: "Acton II",
        imageUrl: "/materials/marshall-bluetooth-speakers/acton-ii.png",
        caption: "Marshall Acton II",
        default: true
      }
    ]
  },
  {
    slug: "marshall-acton-iii",
    title: "Marshall Acton III Bluetooth",
    family: "Home speaker",
    summary:
      "Сучасніша версія компактного Acton із Bluetooth 5.2 для клієнта, якому потрібен маленький домашній Marshall із новішим бездротовим сценарієм.",
    overview: ["Формат: компактна домашня акустика", "Bluetooth: 5.2", "Фокус: компактність + актуальне покоління"],
    highlights: [
      "1 × 4-дюймовий вуфер і 2 × 3/4-дюймові твітера",
      "Потужність 80 Вт: 50 Вт вуфер + 2 × 15 Вт твітера",
      "Частотний діапазон: 45 Гц – 20 кГц",
      "Підключення: Bluetooth 5.2, 3,5 мм",
      "Вага 2,85 кг",
      "Преміальний Marshall-дизайн у невеликому форматі",
      "Найкращий варіант для клієнта, який хоче сучасний компактний Marshall додому"
    ],
    colors: [
      {
        label: "Black",
        imageUrl: "/materials/marshall-bluetooth-speakers/acton-iii.png",
        caption: "Marshall Acton III Bluetooth",
        default: true
      }
    ]
  },
  {
    slug: "marshall-tufton",
    title: "Marshall Tufton",
    family: "Portable speaker",
    summary:
      "Найпотужніша портативна акустика Marshall для виїздів, вечірок і сценаріїв, де потрібен мобільний, але дуже дорослий звук.",
    overview: ["Формат: portable", "Автономність: 20+ год", "Фокус: найпотужніший portable Marshall"],
    highlights: [
      "3-смугова акустика з НЧ-, ВЧ- і повнодіапазонними драйверами",
      "1 × 50 Вт для НЧ, 2 × 15 Вт для full-range і 1 × 10 Вт для ВЧ",
      "Blumlein Stereo Sound і просторове 360°-звучання",
      "Частотний діапазон: 40–20 000 Гц",
      "Bluetooth 5.0, 3,5 мм, кодек SBC",
      "Автономність 20+ год, заряджання 2,5 год, захист IPX2",
      "Добрий вибір для клієнта, якому потрібен великий portable без переходу в стаціонарну колонку"
    ],
    colors: [
      {
        label: "Tufton",
        imageUrl: "/materials/marshall-bluetooth-speakers/tufton.png",
        caption: "Marshall Tufton",
        default: true
      }
    ]
  },
  {
    slug: "marshall-kilburn-ii",
    title: "Marshall Kilburn II",
    family: "Portable speaker",
    summary:
      "Одна з найвдаліших портативних моделей Marshall: легша за Tufton, але все ще дуже гучна та зручна для поїздок і відпочинку.",
    overview: ["Формат: portable", "Автономність: 20+ год", "Фокус: потужний portable з ручкою"],
    highlights: [
      "1 × 20 Вт для НЧ-динаміка і 2 × 8 Вт для ВЧ-динаміків",
      "Частотний діапазон: 52–20 000 Гц",
      "Bluetooth 5.0, 3,5 мм, кодеки SBC та aptX",
      "Вага 2,5 кг і ремінь у стилі гітарного паска",
      "Кольори: Black, Grey, Burgundy, Indigo, Black and Brass",
      "IPX2, 20+ год автономності, 2,5 год заряджання",
      "Правильний варіант для клієнта, який хоче portable Marshall без гігантських габаритів"
    ],
    colors: [
      {
        label: "Kilburn II",
        imageUrl: "/materials/marshall-bluetooth-speakers/kilburn-ii.png",
        caption: "Marshall Kilburn II",
        default: true
      }
    ]
  },
  {
    slug: "marshall-middleton",
    title: "Marshall Middleton",
    family: "Portable speaker",
    summary:
      "Сильний сучасний portable Marshall із True Stereophonic, IP67 і дуже гучним звуком для своїх розмірів.",
    overview: ["Формат: portable", "Bluetooth: 5.1", "Фокус: компактний преміум portable"],
    highlights: [
      "2 НЧ-драйвери по 15 Вт, 2 ВЧ-твітера по 10 Вт і 2 пасивні радіатори",
      "True Stereophonic для панорамного звучання",
      "Режим Stack для об'єднання кількох колонок",
      "Частотний діапазон: 50–20 000 Гц",
      "Bluetooth 5.1, кодек SBC",
      "IP67, 20+ год автономності, близько 4,5 год заряджання",
      "Один із найкращих варіантів Marshall для сучасного активного способу життя"
    ],
    colors: [
      {
        label: "Middleton",
        imageUrl: "/materials/marshall-bluetooth-speakers/middleton.png",
        caption: "Marshall Middleton",
        default: true
      }
    ]
  },
  {
    slug: "marshall-stockwell-ii",
    title: "Marshall Stockwell II",
    family: "Portable speaker",
    summary:
      "Компактна дорожня колонка Marshall для клієнта, якому важливі мобільність, вага і справді портативний формат без втрати характеру бренду.",
    overview: ["Формат: portable", "Автономність: 20+ год", "Фокус: travel-friendly"],
    highlights: [
      "1 × 10 Вт для НЧ-динаміка і 2 × 5 Вт для ВЧ-динаміків",
      "True Stereophonic для різноспрямованого звуку",
      "Частотний діапазон: 40–20 000 Гц",
      "Bluetooth 5.0, 3,5 мм, кодек SBC",
      "Вага близько 1,38 кг",
      "IPX4, 20+ год автономності, 5 год заряджання",
      "Найкраще заходить як Marshall для подорожей і щоденних виїздів"
    ],
    colors: [
      {
        label: "Stockwell II",
        imageUrl: "/materials/marshall-bluetooth-speakers/stockwell-ii.png",
        caption: "Marshall Stockwell II",
        default: true
      }
    ]
  },
  {
    slug: "marshall-emberton",
    title: "Marshall Emberton",
    family: "Portable speaker",
    summary:
      "Невелика повсякденна колонка Marshall із 360°-подачею звуку для прогулянок, подорожей і щоденного використання.",
    overview: ["Формат: portable", "Автономність: 20+ год", "Фокус: everyday portable"],
    highlights: [
      "2 × 10 Вт для драйверів повного діапазону",
      "True Stereophonic і 360°-звук",
      "Частотний діапазон: 60–20 000 Гц",
      "Bluetooth 5.0, кодек SBC",
      "Вага близько 0,7 кг",
      "Кольори: Black, Black and Brass, Cream, Forest",
      "Сильний сценарій для клієнта, якому потрібен компактний Marshall на кожен день"
    ],
    colors: [
      {
        label: "Emberton",
        imageUrl: "/materials/marshall-bluetooth-speakers/emberton.png",
        caption: "Marshall Emberton",
        default: true
      }
    ]
  },
  {
    slug: "marshall-emberton-ii",
    title: "Marshall Emberton II",
    family: "Portable speaker",
    summary:
      "Оновлений Emberton із Bluetooth 5.1 для клієнта, який хоче найзручніший компактний portable Marshall у більш свіжому поколінні.",
    overview: ["Формат: portable", "Bluetooth: 5.1", "Фокус: компактний portable нового покоління"],
    highlights: [
      "2 × 10 Вт для драйверів повного діапазону",
      "Частотний діапазон: 60–20 000 Гц",
      "Bluetooth 5.1, кодек SBC",
      "Вага близько 0,7 кг",
      "Кольори: Cream, Black and Brass",
      "20+ год автономності та близько 3 год заряджання",
      "Проста рекомендація для клієнта, який хоче новіший Emberton замість першого покоління"
    ],
    colors: [
      {
        label: "Emberton II",
        imageUrl: "/materials/marshall-bluetooth-speakers/emberton-ii.png",
        caption: "Marshall Emberton II",
        default: true
      }
    ]
  },
  {
    slug: "marshall-willen",
    title: "Marshall Willen",
    family: "Portable speaker",
    summary:
      "Найменша й найлегша колонка Marshall для клієнта, який хоче максимально мобільний формат без прив'язки до дому чи сумки великого розміру.",
    overview: ["Формат: ultra-portable", "Bluetooth: 5.1", "Фокус: максимум мобільності"],
    highlights: [
      "1 × 10 Вт повнодіапазонний драйвер",
      "Частотний діапазон: 100–20 000 Гц",
      "Bluetooth 5.1, кодек SBC",
      "Вага лише близько 0,31 кг",
      "IP67 і 15+ год автономності",
      "Підтримує сесії з кількома Willen",
      "Найкраще продається як 'кишеньковий' Marshall для поїздок, прогулянок і повсякденного носіння"
    ],
    colors: [
      {
        label: "Willen",
        imageUrl: "/materials/marshall-bluetooth-speakers/willen.png",
        caption: "Marshall Willen",
        default: true
      }
    ]
  }
];

export const marshallSpeakersFoundationBlocks: ModuleContentBlock[] = [
  {
    type: "text",
    title: "Marshall: що продає бренд і чому його люблять",
    html: `<p>Marshall — англійський бренд, який почався з музичних підсилювачів і згодом переніс свій характер у домашню та портативну акустику. Сильна сторона Marshall — не просто звук, а поєднання впізнаваного вінтажного дизайну, рок-н-рольної історії та сучасного Bluetooth-сценарію.</p><p>У продажу Marshall дуже добре працює як емоційний бренд: клієнт часто купує не тільки колонку, а й стиль, впізнаваність і відчуття преміального lifestyle-продукту.</p>`
  },
  {
    type: "image",
    title: "Marshall Woburn II",
    url: "/materials/marshall-bluetooth-speakers/woburn-ii.png",
    caption: "Один із найбільш впізнаваних домашніх форматів Marshall"
  },
  {
    type: "text",
    title: "Як швидко розкласти лінійку Marshall",
    html: `<h3>Домашні моделі</h3><ul><li><strong>Woburn:</strong> найбільша й найпотужніша домашня колонка.</li><li><strong>Stanmore:</strong> найуніверсальніший домашній варіант.</li><li><strong>Acton:</strong> компактна домашня колонка для невеликих приміщень.</li></ul><h3>Портативні моделі</h3><ul><li><strong>Tufton:</strong> найбільший portable.</li><li><strong>Kilburn II:</strong> потужний portable з ременем і хорошим балансом ваги.</li><li><strong>Middleton:</strong> сучасний premium-portable з IP67.</li><li><strong>Stockwell II:</strong> travel-friendly формат.</li><li><strong>Emberton / Emberton II:</strong> щоденний компактний portable.</li><li><strong>Willen:</strong> ультрапортативний варіант.</li></ul>`
  },
  {
    type: "text",
    title: "Що потрібно з'ясувати перед рекомендацією",
    html: `<ul><li><strong>Для дому чи для вулиці:</strong> це перше й найважливіше питання.</li><li><strong>Розмір приміщення:</strong> маленька кімната, вітальня чи велика зона.</li><li><strong>Чи потрібен акумулятор:</strong> стаціонарні Marshall живляться від мережі, portable — від батареї.</li><li><strong>Чи потрібен захист:</strong> для поїздок і вулиці важливі IPX2, IPX4 або IP67.</li><li><strong>Чи важливі входи:</strong> 3,5 мм, RCA, HDMI у старших домашніх моделях.</li><li><strong>Що важливіше:</strong> максимальна потужність, універсальність, компактність чи ультрамобільність.</li></ul>`
  },
  {
    type: "facts",
    title: "Швидкі акценти для продажу Marshall",
    items: [
      "Woburn = великі кімнати, вечірки, максимум потужності серед домашніх Marshall.",
      "Stanmore = найкращий баланс між розміром і силою звуку для дому.",
      "Acton = компактний домашній Marshall для маленьких приміщень.",
      "Tufton і Kilburn II = portable для тих, кому треба голосно й серйозно.",
      "Middleton = сучасний преміальний portable з IP67 і дуже сильним звучанням для свого розміру.",
      "Stockwell II, Emberton, Emberton II і Willen = історія про мобільність, прогулянки, подорожі та щоденне використання.",
      "Marshall дуже добре продається через дизайн, емоцію бренду та характер, а не тільки через сухі вати і герци."
    ]
  }
];

export const marshallSpeakersCatalogBlocks: ModuleContentBlock[] = [
  {
    type: "text",
    title: "Marshall Bluetooth-колонки: домашні та портативні моделі",
    html: `<p>У цьому модулі зібрані головні Marshall-колонки, які найчастіше доводиться підбирати клієнтам: домашні Woburn / Stanmore / Acton та портативні Tufton, Kilburn II, Middleton, Stockwell II, Emberton, Emberton II і Willen.</p><p>Каталог побудований так, щоб продавцю було легко швидко підібрати правильну модель не по назві, а по сценарію: дім, подорожі, вечірки, компактність або максимальна мобільність.</p>`
  },
  {
    type: "productCatalog",
    title: "Marshall: моделі, позиціонування та ключові відмінності",
    products: marshallSpeakersCatalog
  },
  {
    type: "text",
    title: "Швидкий підбір Marshall під сценарій",
    html: `<ul><li><strong>Велика кімната, домашні вечірки, максимум потужності:</strong> Woburn II або Woburn III.</li><li><strong>Вітальня і універсальний домашній формат:</strong> Stanmore II або Stanmore III.</li><li><strong>Невелика кімната або робочий стіл:</strong> Acton II або Acton III.</li><li><strong>Найсерйозніший portable для відпочинку і виїздів:</strong> Tufton.</li><li><strong>Потужний portable з хорошим балансом ваги і гучності:</strong> Kilburn II.</li><li><strong>Сучасний premium portable з IP67:</strong> Middleton.</li><li><strong>Подорожі та компактний формат:</strong> Stockwell II.</li><li><strong>Щоденні прогулянки та маленький portable Marshall:</strong> Emberton / Emberton II.</li><li><strong>Максимальна мобільність і дуже маленький формат:</strong> Willen.</li></ul>`
  },
  {
    type: "facts",
    title: "Ключові орієнтири по Marshall",
    items: [
      "Woburn III виділяється HDMI і найсучаснішим домашнім сценарієм у великому форматі.",
      "Stanmore — найпростіша відповідь, коли клієнт хоче Marshall для дому, але без гігантського корпусу Woburn.",
      "Acton — це не portable, а саме маленька домашня колонка від мережі.",
      "Tufton і Kilburn II звучать по-дорослому, але Middleton сучасніший по захисту й lifestyle-подачі.",
      "Willen — це історія не про максимальну гучність, а про те, щоб Marshall завжди був із собою.",
      "Для Marshall дуже важливо продавати не тільки характеристики, а й візуальний стиль, історію бренду та емоцію володіння."
    ]
  }
];

const marshallBluetoothSpeakersContent = {
  marshallSpeakersCatalog,
  marshallSpeakersFoundationBlocks,
  marshallSpeakersCatalogBlocks
};

export default marshallBluetoothSpeakersContent;
