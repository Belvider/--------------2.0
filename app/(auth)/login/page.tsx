import { LoginForm } from "@/components/auth/LoginForm";
import { BrandMark } from "@/components/BrandMark";
import { prisma } from "@/lib/prisma";
import {
  BookOpenCheck,
  LineChart,
  ShieldCheck,
  Users
} from "lucide-react";

const FEATURES = [
  {
    icon: BookOpenCheck,
    title: "Структуровані матеріали",
    text: "Матеріали від iPhone до Dyson: моделі, сценарії продажу й сервісні кейси в одному каталозі."
  },
  {
    icon: ShieldCheck,
    title: "Тести та сертифікація",
    text: "Фінальна перевірка після кожного модуля. Реальні запитання — не просто галочка, а підтвердження знань."
  },
  {
    icon: LineChart,
    title: "Персональний трек",
    text: "Ваш прогрес, дедлайни, аналітика темпу і позиція в рейтингу команди — все в одному місці."
  }
] as const;

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const counts = await Promise.all([
    prisma.brand.count({ where: { slug: { not: "pineapple-academy" } } }),
    prisma.module.count({ where: { isPublished: true } })
  ]).catch(() => null);
  const stats = [
    { value: counts?.[0] ?? "—", label: "брендів" },
    { value: counts?.[1] ?? "—", label: "модулів" },
    { value: "4", label: "типи тестів" },
    { value: "Свій", label: "темп навчання" }
  ];
  return (
    <main className="flex min-h-screen items-stretch">

      {/* ── Ліва панель — вітрина ── */}
      <section
        className="relative hidden flex-1 flex-col justify-between overflow-hidden p-8 lg:flex xl:p-12"
        style={{
          background: "linear-gradient(160deg, rgba(15,11,23,0.98) 0%, rgba(11,8,18,0.99) 100%)"
        }}
      >
        {/* Фоновий glow — дуже тихий */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-1/4 size-[420px] rounded-full bg-[rgba(40,178,158,0.07)] blur-[120px]" />
          <div className="absolute -right-16 bottom-1/4 size-[300px] rounded-full bg-[rgba(40,178,158,0.04)] blur-[100px]" />
        </div>

        {/* Верх — логотип */}
        <div className="relative">
          <BrandMark size="lg" href="/login" className="!rounded-none !border-0 !bg-transparent !p-0" />
        </div>

        {/* Центр — основний контент */}
        <div className="relative flex-1 flex flex-col justify-center py-12 max-w-lg">
          <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(40,178,158,0.2)] bg-[rgba(40,178,158,0.08)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-strong)]">
            Навчальний портал команди
          </span>

          <h1 className="mt-6 font-[var(--font-heading)] text-[clamp(2.2rem,3.8vw,3.2rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-white">
            Знання, які<br />продають краще
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-7 text-slate-500">
            Всі продуктові матеріали, сценарії продажу та сервісні гайди — в одному порталі. Навчайтесь у своєму темпі і підтверджуйте результат сертифікатом.
          </p>

          {/* Переваги */}
          <div className="mt-10 space-y-4">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="mt-0.5 flex size-9 flex-none items-center justify-center rounded-[10px] border border-[rgba(40,178,158,0.18)] bg-[rgba(40,178,158,0.09)]">
                    <Icon className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{feature.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{feature.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Низ — статистика */}
        <div className="relative">
          <div className="grid grid-cols-4 gap-4 rounded-[16px] border border-white/[0.06] bg-white/[0.025] p-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-[var(--font-heading)] text-2xl font-semibold text-white">{stat.value}</p>
                <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-slate-600">
            PineApple Learning Portal · Внутрішній ресурс для команди
          </p>
        </div>
      </section>

      {/* ── Права панель — форма ── */}
      <section className="flex w-full flex-col items-center justify-center bg-[rgba(11,8,18,0.98)] px-6 py-12 lg:w-[440px] lg:flex-none xl:w-[480px]">

        {/* Мобільний логотип */}
        <div className="mb-8 lg:hidden">
          <BrandMark size="md" href="/login" className="!rounded-none !border-0 !bg-transparent !p-0" />
        </div>

        <div className="w-full max-w-[380px]">
          <div className="mb-8">
            <h2 className="font-[var(--font-heading)] text-[1.9rem] font-semibold tracking-[-0.035em] text-white">
              Вхід у портал
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Введіть свій корпоративний email і пароль
            </p>
          </div>

          {/* Сама форма */}
          <LoginForm />
        </div>

        {/* Виноска знизу */}
        <div className="mt-12 flex items-center gap-1.5 text-[11px] text-slate-600">
          <Users className="size-3.5" aria-hidden="true" />
          <span>Тільки для співробітників PineApple</span>
        </div>
      </section>

    </main>
  );
}
