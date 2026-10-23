"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, Mail, MapPin, Trash2, UserRound } from "lucide-react";
import { UserAvatar } from "@/components/UserAvatar";
import { AVATAR_ACCEPT, MAX_AVATAR_FILE_SIZE, getAvatarFileError } from "@/lib/avatar-upload";
import { getRequestError, requestJson } from "@/lib/http-client";
import styles from "@/app/profile/profile.module.css";

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
    <section aria-busy={isPending} className={styles.identity}>
      <div className={styles.identityMain}>
          <div className={styles.avatarWrap}>
            <UserAvatar
              name={user.name}
              avatarUrl={avatarUrl}
              size="lg"
              className={styles.avatar}
              initialsClassName="text-xl"
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isPending}
              className={`focus-ring ${styles.avatarButton}`}
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
        <div>
          <p className={styles.eyebrow}>Мій профіль</p>
          <h1 className={styles.identityName}>{user.name}</h1>
          <p className={styles.identityEmail}><Mail className="size-3" aria-hidden="true" /><span>{user.email}</span></p>
        </div>
      </div>

      <div className={styles.identityMeta}>
        <span><UserRound className="size-3.5" aria-hidden="true" />{user.position}</span>
        <span><MapPin className="size-3.5" aria-hidden="true" />{user.department}{user.store ? ` · ${user.store}` : ""}</span>
      </div>

        <div className={styles.photoTools}>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isPending}
            className={`focus-ring ${styles.photoButton}`}
          >
            {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Camera className="size-4" aria-hidden="true" />}
            Змінити фото
          </button>
          {avatarUrl ? (
            <button
              type="button"
              onClick={() => updateAvatar("DELETE")}
              disabled={isPending}
              className={`focus-ring ${styles.photoButton}`}
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Видалити
            </button>
          ) : null}
          <p className={styles.photoHint}>JPG, PNG, WEBP, AVIF · до {MAX_AVATAR_FILE_SIZE / 1024 / 1024} МБ</p>
        </div>
      {error ? <p role="alert" className={`${styles.feedback} ${styles.error}`}>{error}</p> : null}
      {notice ? <p role="status" className={`${styles.feedback} ${styles.success}`}>{notice}</p> : null}
    </section>
  );
}
