"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, Mail, MapPin, Trash2, UserRound } from "lucide-react";
import { UserAvatar } from "@/components/UserAvatar";

type ProfileIdentityCardProps = {
  user: {
    name: string;
    email: string;
    avatarUrl?: string | null;
    position: string;
    department: string;
    store: string | null;
  };
};

export function ProfileIdentityCard({ user }: ProfileIdentityCardProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append("avatar", file);

    startTransition(async () => {
      setError(null);
      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Не вдалося оновити фото");
        return;
      }

      router.refresh();
    });
  }

  function removeAvatar() {
    startTransition(async () => {
      setError(null);
      const response = await fetch("/api/profile/avatar", {
        method: "DELETE"
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Не вдалося видалити фото");
        return;
      }

      router.refresh();
    });
  }

  return (
    <section className="card px-4 py-5 sm:px-6 sm:py-7 xl:px-8 xl:py-8">
      <div className="grid gap-5 xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:items-center">
        <div className="flex items-center justify-center">
          <div className="relative">
            <UserAvatar
              name={user.name}
              avatarUrl={user.avatarUrl}
              size="lg"
              className="shadow-[0_22px_40px_rgba(0,0,0,0.18)]"
              initialsClassName="text-xl"
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="focus-ring absolute -bottom-1 -right-1 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-[rgba(40,178,158,0.22)] text-white transition hover:bg-[rgba(40,178,158,0.3)]"
              aria-label="Змінити фото профілю"
            >
              {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Camera className="size-4" aria-hidden="true" />}
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  uploadAvatar(file);
                }
                event.currentTarget.value = "";
              }}
            />
          </div>
        </div>

        <div>
          <span className="portal-chip">Особистий кабінет</span>
          <h1 className="portal-page-title mt-4">{user.name}</h1>
          <p className="portal-subtitle mt-3 max-w-2xl">
            Ваш персональний центр навчання: основні дані, досягнення, історія проходження модулів та керування фото
            профілю в одному місці.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5 text-sm text-slate-600">
              <UserRound className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
              {user.position}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5 text-sm text-slate-600">
              <MapPin className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
              {user.department}
              {user.store ? ` · ${user.store}` : ""}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5 text-sm text-slate-600">
              <Mail className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
              {user.email}
            </span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isPending}
            className="focus-ring bg-ink inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold disabled:opacity-70"
          >
            {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Camera className="size-4" aria-hidden="true" />}
            Змінити фото
          </button>
          {user.avatarUrl ? (
            <button
              type="button"
              onClick={removeAvatar}
              disabled={isPending}
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-3 text-sm font-medium text-white/85 transition hover:bg-white/[0.04] disabled:opacity-70"
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Видалити
            </button>
          ) : null}
        </div>
      </div>

      {error ? <p className="relative mt-4 text-sm text-rose-300">{error}</p> : null}
    </section>
  );
}
