"use client";

import { getRequestError } from "@/lib/http-client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Ban, Loader2, Trash2 } from "lucide-react";

type AdminUserActionsProps = {
  userId: string;
  userName: string;
  initialIsActive: boolean;
  canManage: boolean;
};

export function AdminUserActions({ userId, userName, initialIsActive, canManage }: AdminUserActionsProps) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(initialIsActive);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  useEffect(() => { setIsActive(initialIsActive); }, [initialIsActive, userId]);

  function toggleAccess() {
    if (!canManage || isPending) {
      return;
    }

    startTransition(async () => {
      try {
        setError(null);
        const response = await fetch("/api/admin/users", {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            userId,
            isActive: !isActive
          })
        });
  
        const data = (await response.json()) as { error?: string };
  
        if (!response.ok) {
          setError(data.error ?? "Не вдалося змінити статус користувача");
          return;
        }
  
        setIsActive((prev) => !prev);
        router.refresh();
      } catch (requestError) {
        setError(getRequestError(requestError));
      }
    });
  }

  function removeUser() {
    if (!canManage || isPending) {
      return;
    }

    const confirmed = window.confirm(`Видалити користувача «${userName}»? Цю дію не можна скасувати.`);
    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      try {
        setError(null);
        const response = await fetch(`/api/admin/users?userId=${encodeURIComponent(userId)}`, {
          method: "DELETE"
        });
  
        const data = (await response.json()) as { error?: string };
  
        if (!response.ok) {
          setError(data.error ?? "Не вдалося видалити користувача");
          return;
        }
  
        router.push("/admin");
        router.refresh();
      } catch (requestError) {
        setError(getRequestError(requestError));
      }
    });
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
      <button
        type="button"
        onClick={toggleAccess}
        disabled={!canManage || isPending}
        className="focus-ring inline-flex items-center justify-center gap-2 rounded-[20px] border border-white/10 bg-white/[0.025] px-4 py-3 text-sm font-medium text-white/90 transition hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Ban className="size-4" aria-hidden="true" />}
        {isActive ? "Заблокувати" : "Розблокувати"}
      </button>

      <button
        type="button"
        onClick={removeUser}
        disabled={!canManage || isPending}
        className="focus-ring inline-flex items-center justify-center gap-2 rounded-[20px] border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-100 transition hover:bg-rose-500/16 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Trash2 className="size-4" aria-hidden="true" />}
        Видалити
      </button>

      {error ? <p className="text-sm text-rose-300 sm:col-span-2 xl:col-span-1">{error}</p> : null}
    </div>
  );
}
