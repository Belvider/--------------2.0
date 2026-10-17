"use client";

import { getRequestError } from "@/lib/http-client";

import { useState } from "react";
import { Copy, KeyRound, Link2, Loader2, ShieldCheck, Sparkles } from "lucide-react";

type AdminUserAccessPanelProps = {
  userId: string;
  userName: string;
  canManage: boolean;
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

export function AdminUserAccessPanel({ userId, userName, canManage }: AdminUserAccessPanelProps) {
  const [password, setPassword] = useState("");
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isCreatingResetLink, setIsCreatingResetLink] = useState(false);

  function applyGeneratedPassword() {
    const next = createStrongPassword();
    setPassword(next);
    setMessage("Згенеровано новий тимчасовий пароль. Його можна одразу встановити або скопіювати.");
    setError(null);
  }

  async function copyText(value: string, successText: string) {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        setMessage(successText);
        setError(null);
      }
    } catch {
      setError("Не вдалося скопіювати в буфер обміну");
    }
  }

  async function setTemporaryPassword() {
    if (isSavingPassword || isCreatingResetLink) return;
    try {
      if (!canManage || !password.trim()) {
        return;
      }
  
      setIsSavingPassword(true);
      setMessage(null);
      setError(null);
  
      const response = await fetch("/api/admin/users/access", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "set-password",
          userId,
          password
        })
      });
  
      const data = (await response.json()) as { error?: string; message?: string };
      setIsSavingPassword(false);
  
      if (!response.ok) {
        setError(data.error ?? "Не вдалося оновити пароль");
        return;
      }
  
      setMessage(data.message ?? `Пароль для «${userName}» оновлено`);
      setResetUrl(null);
      setExpiresAt(null);
    } catch (requestError) {
      setError(getRequestError(requestError));
    } finally {
      setIsSavingPassword(false);
    }
  }

  async function createResetLink() {
    if (isSavingPassword || isCreatingResetLink) return;
    try {
      if (!canManage) {
        return;
      }
  
      setIsCreatingResetLink(true);
      setMessage(null);
      setError(null);
  
      const response = await fetch("/api/admin/users/access", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "create-reset-link",
          userId
        })
      });
  
      const data = (await response.json()) as {
        error?: string;
        message?: string;
        resetUrl?: string;
        expiresAt?: string;
      };
  
      setIsCreatingResetLink(false);
  
      if (!response.ok || !data.resetUrl) {
        setError(data.error ?? "Не вдалося сформувати reset-посилання");
        return;
      }
  
      setResetUrl(data.resetUrl);
      setExpiresAt(data.expiresAt ?? null);
      setMessage(data.message ?? `Reset-посилання для «${userName}» готове`);
    } catch (requestError) {
      setError(getRequestError(requestError));
    } finally {
      setIsCreatingResetLink(false);
    }
  }

  return (
    <section className="card p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <div className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
              <ShieldCheck className="size-5 text-[color:var(--brand-strong)]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Керування доступом</p>
              <h2 className="mt-1 font-[var(--font-heading)] text-2xl font-semibold text-ink">Паролі та відновлення</h2>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Тут адміністратор самостійно перевидає доступ: задає тимчасовий пароль або створює окреме reset-посилання
            для працівника без участі розробника чи ручних SQL-операцій.
          </p>
        </div>

        <button
          type="button"
          onClick={applyGeneratedPassword}
          disabled={!canManage || isSavingPassword || isCreatingResetLink}
          className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <Sparkles className="size-4" aria-hidden="true" />
          Згенерувати пароль
        </button>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_0.85fr]">
        <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-4 sm:p-5">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Тимчасовий пароль</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={!canManage || isSavingPassword}
              className="focus-ring min-w-0 flex-1 rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="Введіть або згенеруйте новий пароль"
            />
            <button
              type="button"
              onClick={() => void copyText(password, "Пароль скопійовано в буфер обміну")}
              disabled={!canManage || !password.trim()}
              className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <Copy className="size-4" aria-hidden="true" />
              Копіювати
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={setTemporaryPassword}
              disabled={!canManage || !password.trim() || isSavingPassword || isCreatingResetLink}
              className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isSavingPassword ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <KeyRound className="size-4" aria-hidden="true" />}
              Встановити пароль
            </button>
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-4 sm:p-5">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Reset-посилання</p>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Підійде, коли краще не диктувати пароль вручну, а дати людині разовий безпечний перехід на зміну доступу.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={createResetLink}
              disabled={!canManage || isCreatingResetLink || isSavingPassword}
              className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isCreatingResetLink ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Link2 className="size-4" aria-hidden="true" />}
              Створити reset-посилання
            </button>
          </div>

          {resetUrl ? (
            <div className="mt-4 rounded-[20px] border border-[rgba(40,178,158,0.24)] bg-[rgba(40,178,158,0.08)] p-4">
              <p className="break-all text-sm text-white">{resetUrl}</p>
              {expiresAt ? <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">Активне до: {new Date(expiresAt).toLocaleString("uk-UA")}</p> : null}
              <button
                type="button"
                onClick={() => void copyText(resetUrl, "Reset-посилання скопійовано")}
                className="focus-ring mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-ink sm:w-auto"
              >
                <Copy className="size-3.5" aria-hidden="true" />
                Копіювати посилання
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4 space-y-1">
        {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        {!canManage ? <p className="text-sm text-slate-500">Керування доступом недоступне для цього профілю.</p> : null}
      </div>
    </section>
  );
}
