import type { ModuleContentBlock } from "../module-content";

export const accessoryPowerBlocks: ModuleContentBlock[] = [
  {
    type: "text",
    title: "Адаптери живлення Apple",
    html: `
      <p>Потужність адаптера підбираємо під модель MacBook та сценарій: базова зарядка чи швидке заряджання (fast charge). Apple офіційно дозволяє використовувати адаптер більшої потужності — пристрій візьме рівно стільки, скільки потрібно. Навпаки, адаптер меншої потужності може заряджати повільніше або не встигати при високому навантаженні.</p>
      <p><strong>Ключове:</strong> нові Mac заряджаються через USB-C, а частина моделей — через MagSafe 3 + кабель USB-C ↔ MagSafe 3. Адаптер 140W підтримує USB-C PD 3.1 (EPR) для максимальної потужності 140 Вт.</p>
    `
  },
  {
    type: "text",
    title: "Адаптери живлення для MacBook — рекомендовані варіанти",
    html: `
      <p><strong>Правило добору:</strong> адаптер більшої потужності безпечний, бо пристрій "візьме своє". Для швидкого заряджання 14″ Pro використовуйте 96W, для 16″ Pro — 140W з MagSafe 3.</p>

      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Потужність адаптера</th>
              <th>Типове призначення / моделі</th>
              <th>Примітки</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>30W USB-C</td>
              <td>Ранні MacBook 12″ (2015–2019), частина MacBook Air попередніх поколінь.</td>
              <td>Базова зарядка для невибагливих сценаріїв.</td>
            </tr>
            <tr>
              <td>35W Dual USB-C (звичайний / Compact)</td>
              <td>Зручно для двох пристроїв, наприклад iPhone + AirPods або iPhone + iPad.</td>
              <td>Адаптер автоматично розподіляє потужність між портами залежно від навантаження. Є компактна версія з іншим форм-фактором.</td>
            </tr>
            <tr>
              <td>61W / 67W USB-C</td>
              <td>MacBook Pro 13″ (Intel, 2016–2020) — 61W; MacBook Air / Pro на Apple Silicon — часто 67W як універсальний варіант.</td>
              <td>67W підходить як комфортний мінімум для багатьох Air / Pro; деякі Air підтримують швидке заряджання з вищими адаптерами.</td>
            </tr>
            <tr>
              <td>70W USB-C</td>
              <td>Сучасні MacBook Air (лінійка на M3) — штатний або рекомендований варіант, підтримує fast charge.</td>
              <td>Баланс швидкості та габаритів; сумісний і з іншими ноутбуками Apple.</td>
            </tr>
            <tr>
              <td>96W USB-C</td>
              <td>MacBook Pro 14″ (fast charge), низка 13″ / 16″ попередніх поколінь.</td>
              <td>Дозволяє fast charge для 14″ Pro через MagSafe 3 або USB-C кабель.</td>
            </tr>
            <tr>
              <td>140W USB-C</td>
              <td>MacBook Pro 16″ (M-серії з 2021 року) — повноцінне fast charge через MagSafe 3.</td>
              <td>Перший адаптер Apple з підтримкою USB-C PD 3.1 (EPR).</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  },
  {
    type: "text",
    title: "Швидке заряджання (Fast Charge) для Mac",
    html: `
      <p><strong>Зверніть увагу:</strong> деякі конфігурації постачаються зі штатним адаптером меншої потужності, але fast charge доступне з більш потужним адаптером, сумісним із моделлю.</p>

      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Модель</th>
              <th>Що потрібно</th>
              <th>Коментар</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>MacBook Pro 14″</td>
              <td>Адаптер 96W + кабель USB-C ↔ MagSafe 3 <em>або</em> USB-C ↔ USB-C</td>
              <td>Швидке заряджання до приблизно 50% за 30 хв.</td>
            </tr>
            <tr>
              <td>MacBook Pro 16″</td>
              <td>Адаптер 140W + кабель USB-C ↔ MagSafe 3</td>
              <td>Fast charge реалізовано саме через MagSafe 3 на 140W.</td>
            </tr>
            <tr>
              <td>MacBook Air (лінійка M3)</td>
              <td>Адаптер 70W (USB-C), кабель USB-C ↔ USB-C або USB-C ↔ MagSafe 3, де підтримується</td>
              <td>Підтримує швидке заряджання з 70W.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  },
  {
    type: "text",
    title: "Інші адаптери та сценарії",
    html: `
      <ul>
        <li><strong>20W USB-C Power Adapter</strong> — базовий універсал для iPhone, iPad, AirPods; iPhone 8 і новіші заряджаються до приблизно 50% за 30–35 хвилин.</li>
        <li><strong>35W Dual USB-C</strong> — зручно для подорожей та робочого столу: два порти, автоматичний розподіл потужності; є компактна й звичайна версії з однаковою електронікою.</li>
        <li><strong>USB-C PD сумісність</strong> — дотримуємося стандарту USB Power Delivery для кращої швидкості й сумісності, у тому числі з iPhone 15 / 16.</li>
      </ul>
    `
  },
  {
    type: "text",
    title: "Кабелі Apple (живлення та дані)",
    html: `
      <h4>USB-C ↔ MagSafe 3</h4>
      <ul>
        <li>Потрібен для швидкого заряджання 16″ Pro з адаптером 140W; має світлодіодний індикатор (жовтий / зелений).</li>
        <li>Довжина 2 м; доступні кілька кольорів під колір ноутбука.</li>
      </ul>

      <h4>USB-C Charge Cable</h4>
      <ul>
        <li>Стандартний кабель для заряджання й синхронізації USB-C → USB-C; працює з усіма USB-C адаптерами Apple.</li>
        <li>Рекомендований для iPad Pro / Air та всіх Mac з USB-C портами.</li>
      </ul>

      <h4>Thunderbolt 4 Pro Cable</h4>
      <ul>
        <li>Підтримує Thunderbolt 4 / 3 та USB4 до 40 Гбіт/с, живлення до 100 Вт, роботу з кількома дисплеями до 8K і вище залежно від конфігурації.</li>
        <li>Довжина 1,8 м; оптимальний вибір для швидких зовнішніх дисків, док-станцій і моніторів.</li>
      </ul>

      <h4>Thunderbolt 3 (USB-C)</h4>
      <ul>
        <li>Швидкість до 40 Гбіт/с, сумісність із USB 3.1 Gen 2 до 10 Гбіт/с; живлення до 100 Вт (PD).</li>
        <li>Для зовнішніх графічних рішень (eGPU — на підтримуваних системах), дисків NVMe та док-станцій.</li>
      </ul>
    `
  },
  {
    type: "text",
    title: "Швидкі поради з підбору",
    html: `
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Сценарій</th>
              <th>Що радимо</th>
              <th>Чому</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Максимально швидко зарядити 14″ Pro</td>
              <td>Адаптер 96W + MagSafe 3 або USB-C</td>
              <td>Fast charge приблизно до 50% за 30 хв.</td>
            </tr>
            <tr>
              <td>16″ Pro для інтенсивної роботи</td>
              <td>140W + MagSafe 3</td>
              <td>Повне fast charge саме з 140W через MagSafe 3.</td>
            </tr>
            <tr>
              <td>Компактна подорож</td>
              <td>35W Dual USB-C (Compact)</td>
              <td>Два порти, автоматичний розподіл потужності, мінімум місця.</td>
            </tr>
            <tr>
              <td>Універсальний кабель "на всі випадки"</td>
              <td>Thunderbolt 4 Pro 1,8 м</td>
              <td>Максимальна швидкість, сумісність і PD до 100 Вт.</td>
            </tr>
            <tr>
              <td>iPhone з USB-C</td>
              <td>20W USB-C Power Adapter + USB-C кабель</td>
              <td>Швидке дротове заряджання для iPhone 15 / 16 лінійок згідно з USB-PD.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  },
  {
    type: "text",
    title: "FAQ",
    html: `
      <p><strong>Чи можу я використовувати адаптер більшої потужності?</strong><br />Так. Це безпечно: ноутбук контролює споживання, тому візьме лише необхідну потужність.</p>
      <p><strong>Чим 35W Dual USB-C відрізняється від 35W Dual USB-C Compact?</strong><br />Електроніка й можливості однакові, різниця лише у форм-факторі та геометрії штекера. Обидві версії автоматично розподіляють потужність між портами.</p>
      <p><strong>Коли потрібен саме MagSafe 3 кабель?</strong><br />Для максимально швидкого заряджання 16″ Pro з адаптером 140W; також він зручний як магнітний конектор з індикатором стану.</p>
    `
  }
];

const accessoryPowerContent = {
  accessoryPowerBlocks
};

export default accessoryPowerContent;
