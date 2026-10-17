import type { ModuleCatalogProduct, ModuleContentBlock } from "../module-content";

export const whoopFitnessTrackersCatalog: ModuleCatalogProduct[] = [
  {
    slug: "whoop-strap-3-0",
    title: "WHOOP Strap 3.0",
    family: "Fitness tracker",
    summary:
      "Покоління WHOOP, яке зробило бренд популярним у спорті: стабільний 24/7-трекінг, фокус на відновленні та базовий вхід у систему Recovery / Strain / Sleep.",
    overview: ["Покоління: 2020–2021", "Автономність: до ~5 днів", "Фокус: базовий вхід у WHOOP"],
    highlights: [
      "Recovery / Strain / Sleep як основа екосистеми WHOOP",
      "Автоматичне визначення тренувань",
      "Журнали звичок: алкоголь, кава, стрес, їжа, сон",
      "Без екрана - усі інсайти в застосунку",
      "Добрий варіант для користувача, який хоче базовий контроль сну й навантаження"
    ],
    colors: [
      {
        label: "Black",
        imageUrl: "/materials/whoop-fitness-trackers/whoop-strap-3-0.png",
        caption: "WHOOP Strap 3.0",
        default: true
      }
    ]
  },
  {
    slug: "whoop-4-0",
    title: "WHOOP 4.0",
    family: "Fitness tracker",
    summary:
      "Золота середина поколінь WHOOP: компактніший корпус, нові сенсори, SpO2, температура шкіри, Health Monitor і Any-Wear носіння.",
    overview: ["Покоління: з 2021", "Автономність: ~5 днів", "Фокус: спорт + health data"],
    highlights: [
      "На 33% компактніший корпус порівняно з попереднім поколінням",
      "PPG-сенсор 5 LED + 4 фотодіоди для точніших HR/HRV",
      "SpO2, температура шкіри, дихальна частота, RHR, тренди Health Monitor",
      "PowerPack заряджає без зняття браслета",
      "Any-Wear: носіння на біцепсі або в одязі"
    ],
    colors: [
      {
        label: "Black",
        imageUrl: "/materials/whoop-fitness-trackers/whoop-4-0.png",
        caption: "WHOOP 4.0",
        default: true
      }
    ]
  },
  {
    slug: "whoop-5-0",
    title: "WHOOP 5.0",
    family: "Fitness tracker",
    summary:
      "Нове покоління WHOOP з акцентом на здоров'я, стрес і довголіття: 14+ днів батареї, новий процесор і ширший wellness-функціонал.",
    overview: ["Покоління: 2025", "Автономність: 14+ днів", "Фокус: максимум аналітики + режим 24/7"],
    highlights: [
      "14+ днів автономності проти приблизно 5 днів у WHOOP 4.0",
      "Швидший процесор і стабільніша робота застосунку",
      "Stress Monitor у старших планах",
      "Healthspan / WHOOP Age / Pace of Aging у Peak/Life",
      "Найкращий варіант для регулярних тренувань і дисципліни режиму"
    ],
    colors: [
      {
        label: "Black",
        imageUrl: "/materials/whoop-fitness-trackers/whoop-5-0.png",
        caption: "WHOOP 5.0",
        default: true
      }
    ]
  },
  {
    slug: "whoop-mg",
    title: "WHOOP MG",
    family: "Medical-grade wellness tracker",
    summary:
      "Флагманська версія WHOOP 5.0 з ECG і Blood Pressure Insights (beta) для клієнта, якому потрібен максимум кардіо-інсайтів у межах wellness-сценарію.",
    overview: ["Покоління: 2025", "Автономність: 14+ днів", "Фокус: ECG + advanced health insights"],
    highlights: [
      "ECG-ready сенсор і Heart Screener у застосунку",
      "Irregular Rhythm Notifications",
      "Blood Pressure Insights у beta-форматі після калібрування",
      "Доступність частини фіч залежить від країни та регуляцій",
      "Найдорожчий і найбільш health-oriented варіант у лінійці"
    ],
    colors: [
      {
        label: "Black",
        imageUrl: "/materials/whoop-fitness-trackers/whoop-mg.png",
        caption: "WHOOP MG",
        default: true
      }
    ]
  }
];

export const whoopFitnessTrackersFoundationBlocks: ModuleContentBlock[] = [
  {
    type: "text",
    title: "WHOOP",
    html: `<p><strong>WHOOP</strong> — преміальний фітнес-браслет <strong>без екрана</strong>, який носиться 24/7 і знімає біометрію, щоб у застосунку показувати твій стан тіла: <strong>Recovery (відновлення), Strain (навантаження), Sleep (сон), Stress (стрес)</strong> та довгострокові інсайти здоров'я.</p><p>Концепція WHOOP — не “гаджет на руку”, а <strong>система керування режимом</strong>: як ти спиш, тренуєшся, відновлюєшся, і що реально впливає на твоє тіло. Пристрій входить у підписку — платиш за аналітику та сервіс.</p><p><em>WHOOP не є медичним діагностичним приладом. Метрики — для wellness і самоспостереження, а не для постановки діагнозу.</em></p>`
  },
  {
    type: "text",
    title: "Ключові метрики WHOOP",
    html: `<ul><li><strong>Recovery</strong> — готовність організму до навантаження. Рахується з HRV, RHR, дихання, сну тощо.</li><li><strong>Strain</strong> — наскільки “втомилася система” за день/тренування (кардіо-навантаження).</li><li><strong>Sleep</strong> — фази, якість, “скільки треба саме тобі”, плюс Sleep Planner.</li><li><strong>Health Monitor</strong> — щоденні тренди: пульс, HRV, дихання, SpO2, температура шкіри.</li><li><strong>Stress Monitor</strong> (у 5.0/Peak+) — рівень стресу в реальному часі протягом дня.</li><li><strong>Healthspan / WHOOP Age / Pace of Aging</strong> (Peak+) — довгострокова оцінка “віку здоров'я” і темпу старіння.</li></ul><p>WHOOP найкраще працює, коли ти справді носиш його постійно. Чим більше даних — тим точніші рекомендації.</p>`
  },
  {
    type: "text",
    title: "Покоління WHOOP у 2020–2025",
    html: `<p>У цей період актуальними були Strap 3.0, 4.0, а з 2025 року — нове покоління 5.0 та медична версія MG.</p><ul><li><strong>WHOOP 3.0</strong> — базова платформа для Recovery/Strain/Sleep (актуальна в 2020–2021).</li><li><strong>WHOOP 4.0 (2021)</strong> — компактніший корпус + SpO2 + шкірна температура + Any-Wear.</li><li><strong>WHOOP 5.0 (2025)</strong> — 14+ днів батареї, новий процесор, Stress/Healthspan.</li><li><strong>WHOOP MG (2025)</strong> — версія 5.0 з ECG і Blood Pressure Insights (beta).</li></ul>`
  },
  {
    type: "text",
    title: "Плани підписки WHOOP (ціни на 4 листопада 2025)",
    html: `<p>WHOOP продає “членство”, яке включає пристрій. Ціни можуть трохи відрізнятися по країнах, але базова структура така:</p><h3>WHOOP One — $199/рік</h3><ul><li>Пристрій: WHOOP 5.0</li><li>Метрики: Recovery / Sleep / Strain + тренування, VO2 Max, жіночі гормональні інсайти</li><li>Для кого: спорт/режим без довгострокових “healthspan” фіч</li></ul><h3>WHOOP Peak — $239/рік</h3><ul><li>Пристрій: WHOOP 5.0 + Wireless PowerPack</li><li>Додає: Stress Monitor, Health Monitor, Healthspan / WHOOP Age / Pace of Aging</li><li>Для кого: максимум аналітики для здоров'я і спорту</li></ul><h3>WHOOP Life — $359/рік</h3><ul><li>Пристрій: WHOOP MG + Wireless PowerPack + Luxe ремінець</li><li>Додає: ECG / Heart Screener / Blood Pressure Insights (beta)</li><li>Для кого: тим, кому потрібні медичні інсайти по серцю/тиску</li></ul><p>Важливий нюанс 2025: WHOOP змінював правила апґрейду 4.0 → 5.0/MG після критики, зараз безкоштовний апґрейд доступний при довгій підписці.</p>`
  },
  {
    type: "text",
    title: "Сильні сторони WHOOP",
    html: `<ul><li><strong>Найкращий на ринку фокус на відновленні</strong> (Recovery/HRV-логіка).</li><li><strong>Без екрана</strong> — немає “залипання”, тільки дані й висновки.</li><li><strong>Акуратний дизайн + кастомні ремінці</strong> під стиль.</li><li><strong>Дуже інформативний додаток</strong> + коучинг і зв'язок зі звичками.</li><li><strong>14+ днів батареї у 5.0/MG</strong> — топ для 24/7 носіння.</li></ul>`
  },
  {
    type: "text",
    title: "Обмеження, які варто знати",
    html: `<ul><li>Немає GPS (для бігу/велосипеда потрібен телефон/інший девайс).</li><li>Багато фіч — тільки у старших планах (Peak/Life).</li><li>Blood Pressure Insights — beta і потребує калібрування; це не тонометр.</li></ul>`
  },
  {
    type: "text",
    title: "Ремінці та носіння Any-Wear™",
    html: `<p>WHOOP має багато ремінців: тканинні, водні, преміальні, шкіряні. А Any-Wear™ дозволяє носити не лише на зап’ясті (біцепс, талія, спортивний одяг).</p><ul><li><strong>CoreKnit / SuperKnit</strong> — щоденне носіння.</li><li><strong>HydroKnit</strong> — швидко сохне, ідеально для води.</li><li><strong>Luxe / LeatherLuxe</strong> — стиль, коли браслет як аксесуар.</li></ul>`
  },
  {
    type: "text",
    title: "Що вибрати",
    html: `<ul><li><strong>Потрібен спорт + сон + відновлення →</strong> WHOOP One + 5.0.</li><li><strong>Хочеш ще стрес і довголіття →</strong> WHOOP Peak + 5.0.</li><li><strong>Хочеш ECG і тиск-інсайти →</strong> WHOOP Life + MG.</li></ul>`
  }
];

export const whoopFitnessTrackersCatalogBlocks: ModuleContentBlock[] = [
  {
    type: "text",
    title: "Покоління WHOOP: як пояснювати різницю",
    html: `<p>У лінійці WHOOP важливо продавати не просто покоління, а <strong>рівень занурення у власні дані</strong>. Старші версії не тільки довше живуть від батареї, а й відкривають ширший wellness-сценарій: від сну і Recovery до стресу, Healthspan і додаткових кардіо-інсайтів.</p><p>Для користувача WHOOP критично важливо, що це <strong>браслет без екрана</strong> і продукт у форматі <strong>membership + app experience</strong>. Саме це треба пояснювати на консультації, щоб не було хибного очікування від \"ще одного смарт-годинника\".</p>`
  },
  {
    type: "productCatalog",
    title: "WHOOP Strap 3.0, 4.0, 5.0 та MG",
    products: whoopFitnessTrackersCatalog
  },
  {
    type: "text",
    title: "WHOOP Strap 3.0 (2020–2021)",
    html: `<p>Strap 3.0 — покоління, яке зробило WHOOP популярним у спорті: стабільний 24/7 трекінг і фокус на відновленні.</p><h3>Що вміє:</h3><ul><li>Recovery / Strain / Sleep — основа екосистеми</li><li>Автоматичне визначення тренувань</li><li>Журнали звичок (алкоголь/кава/стрес/їжа/сон)</li></ul><h3>Характеристики (коротко):</h3><ul><li>Автономність: до ~5 днів</li><li>Підключення: Bluetooth</li><li>Екран: немає (все в застосунку)</li></ul><h3>Для кого підходить:</h3><p>Для тих, хто хоче “вхід у WHOOP” і базову систему контролю сну/навантаження. Якщо ти тренуєшся нерегулярно або просто хочеш відстежувати режим — цього рівня достатньо.</p>`
  },
  {
    type: "text",
    title: "WHOOP 4.0 (2021)",
    html: `<p>WHOOP 4.0 став на 33% компактнішим та отримав серйозно оновлені сенсори, включно з <strong>SpO2 і температурою шкіри</strong>. З'явився Health Monitor і Any-Wear носіння.</p><h3>Сенсори та метрики:</h3><ul><li>PPG-сенсор: 5 LED + 4 фотодіоди, точніший HR/HRV</li><li>SpO2 (кисень у крові)</li><li>Температура шкіри</li><li>Дихальна частота, RHR, тренди Health Monitor</li></ul><h3>Характеристики:</h3><ul><li>Автономність: ~5 днів</li><li>Зарядка: водостійкий PowerPack, заряджає без зняття</li><li>Захист: IP68</li><li>Any-Wear: можна носити на біцепсі/в одязі</li></ul><h3>Для кого підходить:</h3><p>Ідеальна “золота середина” для більшості користувачів: спорт + контроль здоров'я по SpO2/температурі. Якщо ти любиш дані, але не хочеш годинник з екраном — 4.0 супер.</p>`
  },
  {
    type: "text",
    title: "WHOOP 5.0 (2025)",
    html: `<p>WHOOP 5.0 — нове покоління з фокусом на <strong>здоров'я, стрес і довголіття</strong>, плюс рекордна батарея і новий процесор.</p><h3>Що нового проти 4.0:</h3><ul><li>Автономність <strong>14+ днів</strong> (проти ~5 днів у 4.0)</li><li>Швидший процесор і стабільніша робота застосунку</li><li>Stress Monitor (у планах Peak/Life)</li><li>Healthspan / WHOOP Age (Peak/Life)</li></ul><h3>Характеристики:</h3><ul><li>Автономність: 14+ днів, є Wireless PowerPack у старших планах</li><li>Габарити: 34.7 × 24 × 10.6 мм</li><li>Вага: ~26.5 г</li><li>Захист: IP68</li><li>Екран: немає</li></ul><h3>Для кого підходить:</h3><p>Для тих, хто хоче максимум з WHOOP: автономність “поставила і забула”, контроль стресу і довгострокові цілі (здоровий темп старіння). Найкращий варіант для регулярних тренувань і дисципліни режиму.</p>`
  },
  {
    type: "text",
    title: "WHOOP MG (Medical Grade) (2025)",
    html: `<p>WHOOP MG — “medical-grade” технологія у корпусі 5.0. Головна різниця: <strong>ECG</strong> і <strong>Blood Pressure Insights (beta)</strong>.</p><h3>Медичні інсайти:</h3><ul><li>ECG-ready сенсор: зняття ЕКГ в додатку (Heart Screener)</li><li>Irregular Rhythm Notifications (наприклад AFib-підозри)</li><li>Blood Pressure Insights (beta): оцінка трендів тиску після калібрування</li></ul><h3>Характеристики:</h3><ul><li>Автономність: 14+ днів</li><li>Захист: IP68</li><li>Доступність фіч: залежить від країни та регуляцій</li></ul><p><em>Blood Pressure Insights — wellness-функція і зараз має статус beta; FDA у США публічно ставила питання щодо формату подачі цієї можливості.</em></p><h3>Для кого підходить:</h3><p>Для тих, хто хоче <strong>максимум контролю серця</strong> і додаткові медичні інсайти: спортсмени витривалості, біохакери, люди з підвищеною увагою до кардіо-стану. Але це найдорожчий варіант (план Life).</p>`
  },
  {
    type: "text",
    title: "Швидка логіка рекомендації",
    html: `<ul><li><strong>WHOOP 4.0</strong> — золота середина для більшості, хто хоче спорт + SpO2 + температуру + Health Monitor.</li><li><strong>WHOOP 5.0</strong> — для тих, хто хоче максимум автономності і нові wellness-функції без переходу в medical-сценарій.</li><li><strong>WHOOP MG</strong> — для користувача, який свідомо шукає ECG та ширші кардіо-інсайти і готовий платити за Life.</li><li>Якщо людина хоче годинник, GPS і екран на руці — WHOOP треба продавати дуже обережно або не нав'язувати.</li></ul>`
  }
];

const whoopFitnessTrackersContent = {
  whoopFitnessTrackersCatalog,
  whoopFitnessTrackersFoundationBlocks,
  whoopFitnessTrackersCatalogBlocks
};

export default whoopFitnessTrackersContent;
