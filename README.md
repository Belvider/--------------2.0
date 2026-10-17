# Портал Навчання Персоналу

Розгортання на Vercel, підключення GitHub і онлайн-бази для реєстрації та входу:
[інструкція Vercel](VERCEL.md).

Багатосторінковий веб-портал для навчання персоналу роздрібного магазину техніки та електроніки (українською мовою).

## Стек

- Frontend + Backend: Next.js 15 (App Router)
- UI: Tailwind CSS
- База даних: PostgreSQL + Prisma ORM
- Автентифікація: JWT (HttpOnly cookie) + bcrypt
- Ролі: `ADMIN`, `MANAGER`, `SELLER`

## Реалізовано

- Авторизація та реєстрація: `/login`, `/register`
- Відновлення пароля: `/forgot-password`, `/reset-password`
- Dashboard: `/dashboard`
- Каталог брендів: `/brands`, `/brands/[brand]`, `/brands/[brand]/[category]`
- Модуль навчання з контент-блоками та тестом: `/module/[id]`
- Сервісні сторінки: `/services`, `/accessories`, `/credits`
- Профіль користувача: `/profile`
- Адмін-панель: `/admin`
- API: авторизація, прогрес, тести, адміністрування, звіти, CSV-експорт

## Структура даних (Prisma)

Основні моделі:

- `users`
- `brands`
- `categories`
- `modules`
- `quiz_questions`
- `user_progress`
- `quiz_attempts`
- `certificates`
- `badges`, `user_badges`
- `app_settings`
- `password_reset_tokens`
- `login_attempts`

## Локальний запуск

1. Встановити залежності:

```bash
npm install
```

2. Створити `.env`:

```bash
cp .env.example .env
```

3. Налаштувати `DATABASE_URL` у `.env` на свій PostgreSQL.

4. Застосувати міграції:

```bash
npx prisma migrate dev --name init
```

5. Заповнити БД демо-даними:

```bash
npm run prisma:seed
```

6. Запустити dev-сервер:

```bash
npm run dev
```

7. Відкрити:

- http://localhost:3000

## Демо-акаунти (після seed)

- `admin@portal.ua` / `Password123!`
- `manager@portal.ua` / `Password123!`
- `seller@portal.ua` / `Password123!`

## Production перевірка

```bash
npx tsc --noEmit
npm run build
```

Обидві команди проходять успішно.

## Запуск на Netlify

1. Підключити репозиторій у Netlify.
2. Переконатися, що Netlify використовує Node.js `22`:
   - файл [.nvmrc](/Users/pineapple/Desktop/Сайт навчання 2.0/.nvmrc)
   - файл [netlify.toml](/Users/pineapple/Desktop/Сайт навчання 2.0/netlify.toml)
3. Додати в Netlify такі змінні середовища:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_NAME`
   - `NEXT_PUBLIC_APP_URL`
4. Переконатися, що PostgreSQL-доступ відкритий для середовища Netlify.

### Важливо

- Основний сайт, авторизація, дашборд, бренди, модулі, адмін-панель і Prisma-частина збираються успішно.
- Завантаження файлів у:
  - `/api/admin/media`
  - `/api/profile/avatar`
  працює у двох режимах:
  - локально: через файлову систему `public/uploads/...`
  - на Netlify: через `Netlify Blobs`
- Існуючі URL виду `/uploads/...` збережені, а доставка файлів іде через route handler, тому старі посилання не потрібно масово переписувати.

### Перший вхід на проді

Після першого деплою production БД потрібно ініціалізувати окремо.

1. Застосувати схему до production БД:

```bash
npm run prisma:push
```

2. Створити або оновити першого адміністратора без видалення даних:

```bash
ADMIN_EMAIL="admin@portal.ua" \
ADMIN_PASSWORD="Password123!" \
ADMIN_NAME="Адміністратор Порталу" \
npm run prisma:bootstrap-admin
```

За потреби можна додати:

- `ADMIN_POSITION`
- `ADMIN_DEPARTMENT`
- `ADMIN_STORE`

## Перевірка та виправлення від 2026-10-13

```bash
npm run test
npx tsc --noEmit --incremental false
npm run lint
npm run build
```

Відновлення пароля зараз проходить через адміністратора. На сторінці «Забули пароль» наведені відповідні інструкції; листи автоматично не надсилаються. Адміністратор може задати пароль або створити одноразове посилання в налаштуваннях доступу працівника. Зміна пароля відкликає попередні сесії. Після оновлення формату JWT потрібен один повторний вхід.

Активність зберігається у таблиці `learning_activity`: один запис на користувача, модуль і календарний день Europe/Kyiv. Для іншої бази спочатку застосуйте нову схему через `npm run prisma:push`, потім перенесіть відомі дати із прогресу й спроб через `npm run activity:backfill`. Скрипт не видаляє історію та пропускає повтори; давні відвідування, яких більше немає у вихідних даних, відновити неможливо.

Для адресного виправлення 14 навчальних заглушок, зображень та Smeg використовується `npm run content:repair`: без параметрів він лише показує план. Для застосування потрібні `--apply --backup <шлях до повної резервної копії>`; скрипт перевіряє план і зберігає ID питань та прогрес. Приклад: `npm run content:repair -- --apply --backup reports/site-fixes-2026-10-13/before-fixes.dump`. Повний `prisma:seed` для такого виправлення не потрібен.

Звіт первинного аудиту: `reports/site-audit-2026-10-13/audit.md`. Резервні копії й підтвердження виправлень зберігаються локально в `reports/site-fixes-2026-10-13/`.
