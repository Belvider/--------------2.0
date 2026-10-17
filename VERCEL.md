# Підключення GitHub, Vercel і бази акаунтів

У проєкті вже реалізовані реєстрація, вхід і ролі користувачів.
GitHub зберігає код, Vercel запускає сайт, а PostgreSQL зберігає акаунти,
паролі у вигляді хешів, навчальні матеріали та прогрес.

## 1. Підключити репозиторій

Якщо репозиторій ще не створений, створіть порожній приватний репозиторій
на GitHub без початкових README, .gitignore та ліцензії.
Якщо він уже містить файли, спочатку зіставте їх із локальними змінами.

У цій папці Git уже ініціалізований, гілка — `main`. Репозиторій проєкту:
[Belvider/--------------2.0](https://github.com/Belvider/--------------2.0).
Для підключення адреса `origin` має бути такою:

```powershell
git remote set-url origin https://github.com/Belvider/--------------2.0.git
```

У початковому індексі вже є локальні звіти та резервна копія бази.
Новий `.gitignore` не прибирає файли, які вже підготовлені до коміту.
Приберіть ці файли лише з індексу; локальні копії залишаться:

```powershell
git rm -r --cached --ignore-unmatch -- reports .claude public/uploads scripts/TVRN
git rm --cached --ignore-unmatch -- .DS_Store tsconfig.tsbuildinfo
git ls-files --cached --ignored --exclude-standard
```

Остання команда показує інші підготовлені файли, які вже ігноруються.
Якщо список не порожній, приберіть кожен із них з індексу через
`git rm --cached -- "шлях до файлу"`. Перевірте вміст першого коміту:

```powershell
git add --all
git diff --cached --stat
git diff --cached --name-only -- .env .env.local .env.production reports
git commit -m "Prepare learning portal for Vercel"
git push -u origin main
```

Якщо PowerShell блокує `npm.ps1`, використовуйте `npm.cmd` замість `npm`
і `npx.cmd` замість `npx` у командах цієї інструкції.

Команда перевірки `.env` і `reports` має повернути порожній список.
Вхід у GitHub виконуйте через Git Credential Manager або GitHub Desktop.

У вже створеному проєкті Vercel відкрийте **Settings → Git → Connect Git
Repository** та виберіть `Belvider/--------------2.0`. Для цього проєкту панель:
[Vercel 2pine](https://vercel.com/12312-ec7f/2pine). Production Branch — `main`.
Після підключення кожен push у `main` запускає оновлення основного сайту.

## 2. Підключити онлайн PostgreSQL

Можна використати Neon через Vercel Marketplace або інший сервіс PostgreSQL.
Створіть базу поряд із регіоном функцій Vercel та підключіть її до проєкту.
У **Settings → Environment Variables** встановіть:

| Змінна | Значення для Production |
| --- | --- |
| `DATABASE_URL` | Pooled URL онлайн PostgreSQL для запитів сайту |
| `DIRECT_URL` | Direct URL тієї ж бази; збірка також приймає `DATABASE_URL_UNPOOLED` або `POSTGRES_URL_NON_POOLING` |
| `JWT_SECRET` | Власний випадковий секрет мінімум 32 символи, однаковий для всіх production deployments |
| `PORTAL_RUN_MIGRATIONS` | `true` лише у Production проєкту `2pine` для застосування міграцій під час збірки |
| `NEXT_PUBLIC_APP_URL` | Повна HTTPS-адреса основного сайту без кінцевого `/` |
| `NEXT_PUBLIC_APP_NAME` | Назва навчального порталу |

Назви змінних, які додає інтеграція бази, можуть відрізнятися: перевірте,
що заданий `DATABASE_URL` і один із direct URL: `DIRECT_URL`,
`DATABASE_URL_UNPOOLED` або `POSTGRES_URL_NON_POOLING`. Для Neon беріть URL
з панелі Connect і зберігайте параметри SSL, які надає сервіс.
`localhost` на Vercel не посилається на ваш комп'ютер.

Згенерувати секрет локально:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Значення секретів вводьте у Vercel; не додавайте їх у GitHub або чат.
Для Preview використовуйте окрему базу чи гілку бази та окремий секрет.
Після зміни змінних потрібен новий deployment.

## 3. Створити таблиці

У `prisma/migrations/0_init/migration.sql` підготовлена початкова схема.
Для нової порожньої Neon-бази створення таблиць виконується у Vercel:

1. У `2pine → Settings → Environment Variables` перевірте `DATABASE_URL`
   та `DATABASE_URL_UNPOOLED` (або задайте `DIRECT_URL`).
2. Додайте власний `JWT_SECRET` і `PORTAL_RUN_MIGRATIONS=true` у **Production**.
3. Запустіть Redeploy останнього коміту. `vercel.json` задає команду
   `npm run vercel-build`: вона генерує Prisma Client, застосовує лише ще не
   виконані міграції через `prisma migrate deploy` і збирає Next.js.

Міграції запускаються тільки коли одночасно задані
`VERCEL_ENV=production` і `PORTAL_RUN_MIGRATIONS=true`. На Preview та в інших
Vercel-проєктах без цієї змінної збірка базу не змінює. До першої зміни бази
перевіряються наявність URL і секрет сесій; неправильні налаштування або
помилка міграції зупиняють збірку. Seed і reset не запускаються.

Для наявної бази з таблицями спочатку перевірте історію міграцій або виконайте
описаний нижче baseline; лише потім вмикайте автоматичні міграції.

Альтернатива — застосувати міграції вручну, наприклад для іншого хостингу:

Для **нової порожньої онлайн-бази** відкрийте окремий PowerShell у цій папці.
Введіть URL інтерактивно, щоб не записувати їх у текст команд:

```powershell
$env:DATABASE_URL = Read-Host "Pooled DATABASE_URL"
$env:DIRECT_URL = Read-Host "Direct DIRECT_URL"
npm run prisma:deploy
```

Ця команда створить таблиці в базі, на яку вказують введені URL.
Після виконання закрийте цей PowerShell, щоб наступні локальні команди
знову використовували локальну `.env`.

Якщо в онлайн-базі **вже є таблиці або користувачі**, спочатку зробіть backup
і порівняйте її схему з `prisma/schema.prisma`. Якщо схеми повністю збігаються
і база ще не має історії Prisma Migrate, замість повторного створення таблиць
позначте початкову міграцію як уже застосовану:

```powershell
npx prisma migrate resolve --applied 0_init
npm run prisma:deploy
```

Цей крок виконується лише після перевірки збігу схем і з URL потрібної бази
в поточному PowerShell. Для бази з відмінностями спочатку підготуйте окрему
міграцію; не використовуйте reset.

Подальші зміни схеми готуйте через `npm run prisma:migrate` на локальній
розробницькій базі, перевіряйте SQL і додавайте міграції до Git.
Production-збірка `2pine` застосує їх перед випуском коду; для інших
хостингів використовуйте `npm run prisma:deploy`.
Чинна локальна база також могла створюватися без історії міграцій: перед
першим `prisma:migrate` зробіть її backup, перевірте збіг схеми та виконайте
описаний baseline з локальними URL. Або створіть окрему порожню базу для
розробки й застосуйте до неї `prisma:deploy`. Не погоджуйтеся на reset бази,
дані якої потрібно зберегти.

**Не запускайте `npm run prisma:seed` на базі з робочими даними:** наявний
демо-seed видаляє користувачів, прогрес і контент та створює демо-акаунти.
Початкова міграція створює таблиці без перенесення локальних акаунтів і курсів.
Для збереження чинних даних потрібен окремий backup/restore PostgreSQL.

## 4. Збірка та перший вхід

У Vercel залиште Framework Preset **Next.js**, стандартний Output Directory
і Node.js **22.x**. `vercel.json` задає Build Command **`npm run vercel-build`**.
Локальна команда `npm run build` генерує Prisma Client і збирає Next.js;
локальну базу вона не змінює.
Запустіть Redeploy після налаштування змінних.

Перевірте `/register`: створіть власний акаунт, вийдіть через меню та знову
увійдіть через `/login`. Новий користувач отримує роль `SELLER`.

Першого адміністратора можна створити через наявний
`scripts/bootstrap-admin.ts`. У тому ж окремому PowerShell із URL потрібної
онлайн-бази задайте `ADMIN_EMAIL`, `ADMIN_PASSWORD`, за потреби `ADMIN_NAME`
та запустіть `npm run prisma:bootstrap-admin`. Використовуйте власний пароль.
Скрипт створює адміністратора або оновлює пароль і роль акаунта з цим email.

## 5. Наступні правки

```powershell
git add --all
git diff --cached --stat
git commit -m "Describe the change"
git push
```

Після push Vercel публікує нову версію коду; акаунти й прогрес залишаються
в PostgreSQL. Для перегляду змін перед основним випуском використовуйте
окрему гілку та Preview deployment.

## Окрема доробка: завантаження файлів

Поточний адаптер файлів підтримує локальний диск і Netlify Blobs.
Для завантаження аватарів і медіа на Vercel потрібен адаптер Vercel Blob
або іншого постійного сховища. Саме додавання `BLOB_READ_WRITE_TOKEN`
зараз помилково вмикає Netlify-адаптер і не підключає Vercel Blob.
Це окремо від реєстрації та входу.

## Офіційні інструкції

- [GitHub і автоматичні деплої Vercel](https://vercel.com/docs/git/vercel-for-github)
- [Змінні середовища Vercel](https://vercel.com/docs/environment-variables)
- [Neon для Prisma 6](https://www.prisma.io/docs/orm/v6/overview/databases/neon)
- [Початкова історія міграцій для наявної бази](https://www.prisma.io/docs/orm/prisma-migrate/workflows/baselining)
