"use client";

import { getRequestError } from "@/lib/http-client";

import type { FormEvent } from "react";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ShieldCheck } from "lucide-react";
import { formatDateForInput, getEditableNameParts } from "@/lib/user-profile";

type EditableAdminUser = {
  id: string;
  name: string;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  email: string;
  phone: string | null;
  birthday: string | Date | null;
  city: string | null;
  position: string;
  department: string;
  store: string | null;
  hireDate: string | Date | null;
  notes: string | null;
  role: "ADMIN" | "MANAGER" | "SELLER";
  isActive: boolean;
};

type AdminUserProfileFormProps = {
  user: EditableAdminUser;
  canEdit: boolean;
  canChangeAccess: boolean;
};

type FormState = {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phone: string;
  birthday: string;
  city: string;
  position: string;
  department: string;
  store: string;
  hireDate: string;
  notes: string;
  role: EditableAdminUser["role"];
  isActive: boolean;
};

function getInitialState(user: EditableAdminUser): FormState {
  const nameParts = getEditableNameParts(user);

  return {
    firstName: nameParts.firstName,
    lastName: nameParts.lastName,
    middleName: nameParts.middleName,
    email: user.email,
    phone: user.phone ?? "",
    birthday: formatDateForInput(user.birthday),
    city: user.city ?? "",
    position: user.position,
    department: user.department,
    store: user.store ?? "",
    hireDate: formatDateForInput(user.hireDate),
    notes: user.notes ?? "",
    role: user.role,
    isActive: user.isActive
  };
}

export function AdminUserProfileForm({ user, canEdit, canChangeAccess }: AdminUserProfileFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => getInitialState(user));
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const pendingRequest = useRef(false);

  const summaryText = useMemo(() => {
    if (canEdit) {
      return "Адміністратор може оновити особисті та робочі дані співробітника в одному місці: ПІБ, контакти, дату народження, посаду, відділ, магазин і внутрішні нотатки.";
    }

    return "Цей блок відкритий у режимі перегляду. Повне редагування картки працівника доступне адміністратору.";
  }, [canEdit]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canEdit || pendingRequest.current) {
      return;
    }

    pendingRequest.current = true;
    setIsPending(true);
    try {
      setError(null);
      setMessage(null);

      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          firstName: form.firstName,
          lastName: form.lastName,
          middleName: form.middleName,
          email: form.email,
          phone: form.phone,
          birthday: form.birthday,
          city: form.city,
          position: form.position,
          department: form.department,
          store: form.store,
          hireDate: form.hireDate,
          notes: form.notes,
          ...(canChangeAccess ? { role: form.role, isActive: form.isActive } : {})
        })
      });

      const data = (await response.json()) as { error?: string; user?: { name?: string } };

      if (!response.ok) {
        setError(data.error ?? "Не вдалося зберегти зміни");
        return;
      }

      setMessage(`Профіль «${data.user?.name ?? user.name}» оновлено`);
      router.refresh();
    } catch (requestError) {
      setError(getRequestError(requestError));
    } finally {
      pendingRequest.current = false;
      setIsPending(false);
    }
  }

  return (
    <section id="profile-data" className="card scroll-mt-24 p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <div className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
              <ShieldCheck className="size-5 text-[color:var(--brand-strong)]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Редактор профілю</p>
              <h2 className="mt-1 font-[var(--font-heading)] text-2xl font-semibold text-ink">Повні дані працівника</h2>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-600">{summaryText}</p>
        </div>

        <div className="w-full rounded-[24px] border border-white/10 bg-white/[0.025] px-4 py-3 text-sm text-slate-500 sm:w-auto">
          {canEdit ? "Зміни зберігаються одразу в профіль користувача" : "Режим перегляду"}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="grid gap-6 xl:grid-cols-2">
          <fieldset className="rounded-[24px] border border-white/10 bg-white/[0.025] p-4 sm:p-5">
            <legend className="px-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Особисті дані</legend>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm text-slate-300">
                <span>Ім&apos;я</span>
                <input
                  value={form.firstName}
                  onChange={(event) => updateField("firstName", event.target.value)}
                  disabled={!canEdit || isPending}
                  required
                  maxLength={80}
                  className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder="Ім'я"
                />
              </label>

              <label className="grid gap-2 text-sm text-slate-300">
                <span>Прізвище</span>
                <input
                  value={form.lastName}
                  onChange={(event) => updateField("lastName", event.target.value)}
                  disabled={!canEdit || isPending}
                  className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder="Прізвище"
                />
              </label>

              <label className="grid gap-2 text-sm text-slate-300 sm:col-span-2">
                <span>По батькові</span>
                <input
                  value={form.middleName}
                  onChange={(event) => updateField("middleName", event.target.value)}
                  disabled={!canEdit || isPending}
                  className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder="За потреби"
                />
              </label>

              <label className="grid gap-2 text-sm text-slate-300 sm:col-span-2">
                <span>Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  disabled={!canEdit || isPending}
                  className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder="user@pineapple.ua"
                />
              </label>

              <label className="grid gap-2 text-sm text-slate-300">
                <span>Телефон</span>
                <input
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  disabled={!canEdit || isPending}
                  className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder="+380..."
                />
              </label>

              <label className="grid gap-2 text-sm text-slate-300">
                <span>Дата народження</span>
                <input
                  type="date"
                  value={form.birthday}
                  onChange={(event) => updateField("birthday", event.target.value)}
                  disabled={!canEdit || isPending}
                  className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
                />
              </label>

              <label className="grid gap-2 text-sm text-slate-300 sm:col-span-2">
                <span>Місто</span>
                <input
                  value={form.city}
                  onChange={(event) => updateField("city", event.target.value)}
                  disabled={!canEdit || isPending}
                  className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder="Київ"
                />
              </label>
            </div>
          </fieldset>

          <fieldset className="rounded-[24px] border border-white/10 bg-white/[0.025] p-4 sm:p-5">
            <legend className="px-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Робочі дані</legend>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm text-slate-300">
                <span>Посада</span>
                <input
                  value={form.position}
                  onChange={(event) => updateField("position", event.target.value)}
                  disabled={!canEdit || isPending}
                  className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder="Продавець-консультант"
                />
              </label>

              <label className="grid gap-2 text-sm text-slate-300">
                <span>Відділ</span>
                <input
                  value={form.department}
                  onChange={(event) => updateField("department", event.target.value)}
                  disabled={!canEdit || isPending}
                  className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder="Мобільна техніка"
                />
              </label>

              <label className="grid gap-2 text-sm text-slate-300">
                <span>Магазин / локація</span>
                <input
                  value={form.store}
                  onChange={(event) => updateField("store", event.target.value)}
                  disabled={!canEdit || isPending}
                  className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder="Київ #1"
                />
              </label>

              <label className="grid gap-2 text-sm text-slate-300">
                <span>Дата найму</span>
                <input
                  type="date"
                  value={form.hireDate}
                  onChange={(event) => updateField("hireDate", event.target.value)}
                  disabled={!canEdit || isPending}
                  className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
                />
              </label>

              <label className="grid gap-2 text-sm text-slate-300">
                <span>Роль</span>
                <select
                  value={form.role}
                  onChange={(event) => updateField("role", event.target.value as FormState["role"])}
                  disabled={!canEdit || !canChangeAccess || isPending}
                  className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="SELLER">SELLER</option>
                </select>
              </label>

              <label className="flex items-center gap-3 rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300 sm:mt-7">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) => updateField("isActive", event.target.checked)}
                  disabled={!canEdit || !canChangeAccess || isPending}
                  className="size-4 rounded border-white/20 bg-white/5"
                />
                <span>{form.isActive ? "Акаунт активний" : "Акаунт заблокований"}</span>
              </label>
            </div>
          </fieldset>
        </div>

        <label className="grid gap-2 text-sm text-slate-300">
          <span>Нотатки адміністратора</span>
          <textarea
            value={form.notes}
            onChange={(event) => updateField("notes", event.target.value)}
            disabled={!canEdit || isPending}
            rows={5}
            className="focus-ring min-h-[140px] rounded-[24px] border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="Внутрішні коментарі: сильні сторони, дата онбордингу, особливості графіка, навчальні примітки тощо."
          />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            {message ? <p role="status" className="text-sm text-emerald-300">{message}</p> : null}
            {error ? <p role="alert" className="text-sm text-rose-300">{error}</p> : null}
          </div>

          <button
            type="submit"
            disabled={!canEdit || isPending}
            className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
            Зберегти профіль
          </button>
        </div>
      </form>
    </section>
  );
}
