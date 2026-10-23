"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, Mail, MapPin, Trash2, UserRound } from "lucide-react";
import { UserAvatar } from "@/components/UserAvatar";
import { AVATAR_ACCEPT, MAX_AVATAR_FILE_SIZE, getAvatarFileError } from "@/lib/avatar-upload";
import { getRequestError, requestJson } from "@/lib/http-client";

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
  const mutationPendingRef = useRef(false);
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setAvatarUrl(user.avatarUrl ?? null);
  }, [user.avatarUrl]);

  async function updateAvatar(method: "POST" | "DELETE", file?: File) {
    if (mutationPendingRef.current) return;

    setError(null);
    setNotice(null);

    if (file) {
      const fileError = getAvatarFileError(file);
      if (fileError) {
        setError(fileError);
        return;
      }
    }

    mutationPendingRef.current = true;
    setIsPending(true);

    try {
      const formData = file ? new FormData() : undefined;
      if (file) formData?.append("avatar", file);
      const data = await requestJson<{ avatarUrl?: string }>("/api/profile/avatar", {
        method,
        body: formData
      });

      const uploadedAvatarUrl = data?.avatarUrl;
      if (method === "POST" && (typeof uploadedAvatarUrl !== "string" || !uploadedAvatarUrl.trim())) {
        throw new Error("Сервер не повернув фото. Спробуйте ще раз.");
      }

      setAvatarUrl(method === "POST" ? uploadedAvatarUrl! : null);
      setNotice(method === "POST" ? "Фото профілю оновлено." : "Фото профілю видалено.");
      router.refresh();
    } catch (requestError) {
      setError(getRequestError(requestError, method === "POST" ? "Не вдалося оновити фото" : "Не вдалося видалити фото"));
    } finally {
      mutationPendingRef.current = false;
      setIsPending(false);
    }
  }

  return (
    <section aria-busy={isPending} className="card px-4 py-5 sm:px-6 sm:py-7 xl:px-8 xl:py-8">
      <div className="grid gap-5 xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:items-center">
        <div className="flex items-center justify-center">
          <div className="relative">
            <UserAvatar
              name={user.name}
              avatarUrl={avatarUrl}
              size="lg"
              className="shadow-[0_22px_40px_rgba(0,0,0,0.18)]"
              initialsClassName="text-xl"
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isPending}
              className="focus-ring absolute -bottom-1 -right-1 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-[rgba(40,178,158,0.22)] text-white transition hover:bg-[rgba(40,178,158,0.3)] disabled:opacity-70"
              aria-label="Змінити фото профілю"
            >
              {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Camera className="size-4" aria-hidden="true" />}
            </button>
            <input
              ref={inputRef}
              type="file"
              accept={AVATAR_ACCEPT}
              disabled={isPending}
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.currentTarget.value = "";
                if (file) {
                  return updateAvatar("POST", file);
                }
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
          {avatarUrl ? (
            <button
              type="button"
              onClick={() => updateAvatar("DELETE")}
              disabled={isPending}
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-3 text-sm font-medium text-white/85 transition hover:bg-white/[0.04] disabled:opacity-70"
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Видалити
            </button>
          ) : null}
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400">JPG, PNG, WEBP або AVIF, до {MAX_AVATAR_FILE_SIZE / 1024 / 1024} МБ.</p>
      {error ? <p role="alert" className="relative mt-3 text-sm text-rose-300">{error}</p> : null}
      {notice ? <p role="status" className="relative mt-3 text-sm text-slate-300">{notice}</p> : null}
    </section>
  );
}
