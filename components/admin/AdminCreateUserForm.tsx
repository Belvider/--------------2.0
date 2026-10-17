"use client";

import { getRequestError } from "@/lib/http-client";

import type { FormEvent } from "react";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@prisma/client";
import { Copy, KeyRound, Loader2, Sparkles, UserRoundPlus } from "lucide-react";

type CreateUserFormState = {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  password: string;
  phone: string;
  birthday: string;
  city: string;
  position: string;
  department: string;
  store: string;
  hireDate: string;
  notes: string;
  role: Role;
  isActive: boolean;
};

const initialState: CreateUserFormState = {
  firstName: "",
  lastName: "",
  middleName: "",
  email: "",
  password: "",
  phone: "",
  birthday: "",
  city: "",
  position: "",
  department: "",
  store: "",
  hireDate: "",
  notes: "",
  role: "SELLER",
  isActive: true
};

function createStrongPassword(length = 12) {
  const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lowercase = "abcdefghijkmnopqrstuvwxyz";
  const digits = "23456789";
  const symbols = "!@#$%";
  const alphabet = uppercase + lowercase + digits + symbols;
  const randomIndex = (maximum: number) => crypto.getRandomValues(new Uint32Array(1))[0] % maximum;

  const required = [
    uppercase[randomIndex(uppercase.length)] ?? "A",
    lowercase[randomIndex(lowercase.length)] ?? "a",
    digits[randomIndex(digits.length)] ?? "2",
    symbols[randomIndex(symbols.length)] ?? "!"
  ];

  while (required.length < length) {
    required.push(alphabet[randomIndex(alphabet.length)] ?? "x");
  }

  for (let index = required.length - 1; index > 0; index--) {
    const other = randomIndex(index + 1);
    [required[index], required[other]] = [required[other], required[index]];
  }
  return required.join("");
}

export function AdminCreateUserForm() {
  const router = useRouter();
  const [form, setForm] = useState<CreateUserFormState>(initialState);
  const [issuedPassword, setIssuedPassword] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isReady = useMemo(() => {
    return Boolean(
      form.firstName.trim() &&
        form.email.trim() &&
        form.password.trim() &&
        form.position.trim() &&
        form.department.trim()
    );
  }, [form]);

  function updateField<K extends keyof CreateUserFormState>(key: K, value: CreateUserFormState[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value
    }));
  }

  function applyGeneratedPassword() {
    const nextPassword = createStrongPassword();
    updateField("password", nextPassword);
    setIssuedPassword(null);
    setMessage("Згенеровано новий тимчасовий пароль. Його можна одразу видати співробітнику.");
    setError(null);
  }

  async function copyIssuedPassword() {
    if (!issuedPassword || typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(issuedPassword);
      setMessage("Тимчасовий пароль скопійовано в буфер обміну.");
      setError(null);
    } catch {
      setError("Не вдалося скопіювати пароль");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      try {
        setError(null);
        setMessage(null);
  
        const response = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(form)
        });
  
        const data = (await response.json()) as { error?: string; user?: { name?: string } };
  
        if (!response.ok) {
          setError(data.error ?? "Не вдалося створити користувача");
          return;
        }
  
        setMessage(`Користувача «${data.user?.name ?? form.email}» створено. Далі його вже можна допрацьовувати в профілі.`);
        setIssuedPassword(form.password);
        setForm(initialState);
        router.refresh();
      } catch (requestError) {
        setError(getRequestError(requestError));
      }
    });
  }

  return (
    <section className="rounded-[28px] border border-[rgba(40,178,158,0.22)] bg-[linear-gradient(135deg,rgba(40,178,158,0.12),rgba(255,255,255,0.03))] p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <div className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
              <UserRoundPlus className="size-5 text-[color:var(--brand-strong)]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Admin Self-Service</p>
              <h3 className="mt-1 font-[var(--font-heading)] text-2xl font-semibold text-ink">Новий співробітник</h3>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Адміністратор може одразу створити повний акаунт: ПІБ, контакти, робочу роль, відділ, магазин, дату найму
            й тимчасовий пароль без окремого онбордингу через реєстрацію.
          </p>
        </div>

        <button
          type="button"
          onClick={applyGeneratedPassword}
          className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-ink sm:w-auto"
        >
          <Sparkles className="size-4" aria-hidden="true" />
          Згенерувати пароль
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid gap-4 xl:grid-cols-2">
          <label className="grid gap-2 text-sm text-slate-300">
            <span>Ім&apos;я</span>
            <input
              value={form.firstName}
              onChange={(event) => updateField("firstName", event.target.value)}
              disabled={isPending}
              className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500"
              placeholder="Олег"
            />
          </label>

          <label className="grid gap-2 text-sm text-slate-300">
            <span>Прізвище</span>
            <input
              value={form.lastName}
              onChange={(event) => updateField("lastName", event.target.value)}
              disabled={isPending}
              className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500"
              placeholder="Іваненко"
            />
          </label>

          <label className="grid gap-2 text-sm text-slate-300">
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              disabled={isPending}
              className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500"
              placeholder="user@pineapple.ua"
            />
          </label>

          <label className="grid gap-2 text-sm text-slate-300">
            <span>Тимчасовий пароль</span>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
                disabled={isPending}
                className="focus-ring min-w-0 flex-1 rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500"
                placeholder="Min 8, велика літера, цифра"
              />
              <button
                type="button"
                onClick={applyGeneratedPassword}
                className="focus-ring inline-flex min-h-[52px] items-center justify-center rounded-[18px] border border-white/10 bg-white/[0.04] px-3 text-ink sm:w-[52px] sm:px-0"
                aria-label="Згенерувати пароль"
              >
                <KeyRound className="size-4" aria-hidden="true" />
              </button>
            </div>
          </label>

          <label className="grid gap-2 text-sm text-slate-300">
            <span>Посада</span>
            <input
              value={form.position}
              onChange={(event) => updateField("position", event.target.value)}
              disabled={isPending}
              className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500"
              placeholder="Продавець-консультант"
            />
          </label>

          <label className="grid gap-2 text-sm text-slate-300">
            <span>Відділ</span>
            <input
              value={form.department}
              onChange={(event) => updateField("department", event.target.value)}
              disabled={isPending}
              className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500"
              placeholder="Мобільна техніка"
            />
          </label>

          <label className="grid gap-2 text-sm text-slate-300">
            <span>Роль</span>
            <select
              value={form.role}
              onChange={(event) => updateField("role", event.target.value as Role)}
              disabled={isPending}
              className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3 text-white"
            >
              <option value="SELLER">SELLER</option>
              <option value="MANAGER">MANAGER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm text-slate-300">
            <span>Магазин / локація</span>
            <input
              value={form.store}
              onChange={(event) => updateField("store", event.target.value)}
              disabled={isPending}
              className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500"
              placeholder="Київ #1"
            />
          </label>
        </div>

        <details className="group rounded-[24px] border border-white/10 bg-white/[0.025] p-4">
          <summary className="cursor-pointer list-none text-left text-sm font-semibold text-ink">
            Розширені поля профілю
            <span className="ml-2 text-slate-500 group-open:hidden">відкрити додаткові контакти, дати й нотатки</span>
          </summary>

          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-300">
              <span>По батькові</span>
              <input
                value={form.middleName}
                onChange={(event) => updateField("middleName", event.target.value)}
                disabled={isPending}
                className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500"
              />
            </label>

            <label className="grid gap-2 text-sm text-slate-300">
              <span>Телефон</span>
              <input
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                disabled={isPending}
                className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500"
                placeholder="+380..."
              />
            </label>

            <label className="grid gap-2 text-sm text-slate-300">
              <span>Дата народження</span>
              <input
                type="date"
                value={form.birthday}
                onChange={(event) => updateField("birthday", event.target.value)}
                disabled={isPending}
                className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3 text-white"
              />
            </label>

            <label className="grid gap-2 text-sm text-slate-300">
              <span>Місто</span>
              <input
                value={form.city}
                onChange={(event) => updateField("city", event.target.value)}
                disabled={isPending}
                className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500"
                placeholder="Київ"
              />
            </label>

            <label className="grid gap-2 text-sm text-slate-300">
              <span>Дата найму</span>
              <input
                type="date"
                value={form.hireDate}
                onChange={(event) => updateField("hireDate", event.target.value)}
                disabled={isPending}
                className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3 text-white"
              />
            </label>

            <label className="flex items-center gap-3 rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300 xl:mt-7">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) => updateField("isActive", event.target.checked)}
                disabled={isPending}
                className="size-4 rounded border-white/20 bg-white/5"
              />
              <span>{form.isActive ? "Створити активний акаунт" : "Створити заблокований акаунт"}</span>
            </label>

            <label className="grid gap-2 text-sm text-slate-300 xl:col-span-2">
              <span>Нотатки адміністратора</span>
              <textarea
                value={form.notes}
                onChange={(event) => updateField("notes", event.target.value)}
                disabled={isPending}
                rows={4}
                className="focus-ring min-h-[120px] rounded-[20px] border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500"
                placeholder="Що важливо знати про працівника, графік, сильні сторони, план навчання тощо."
              />
            </label>
          </div>
        </details>

        {issuedPassword ? (
          <div className="rounded-[22px] border border-[rgba(40,178,158,0.24)] bg-[rgba(40,178,158,0.08)] p-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Останній виданий пароль</p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
              <p className="min-w-0 flex-1 break-all text-sm text-white">{issuedPassword}</p>
              <button
                type="button"
                onClick={() => void copyIssuedPassword()}
                className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold text-ink sm:w-auto"
              >
                <Copy className="size-3.5" aria-hidden="true" />
                Копіювати пароль
              </button>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          </div>

          <button
            type="submit"
            disabled={isPending || !isReady}
            className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <UserRoundPlus className="size-4" aria-hidden="true" />}
            Створити користувача
          </button>
        </div>
      </form>
    </section>
  );
}
