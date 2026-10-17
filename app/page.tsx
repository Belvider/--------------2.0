"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthBootScreen } from "@/components/auth/AuthBootScreen";

const MIN_SPLASH_TIME_MS = 900;

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function resolveEntryPoint() {
      try {
        const [response] = await Promise.all([
          fetch("/api/auth/me", {
            method: "GET",
            cache: "no-store",
            credentials: "include"
          }),
          new Promise((resolve) => setTimeout(resolve, MIN_SPLASH_TIME_MS))
        ]);

        if (cancelled) {
          return;
        }

        router.replace(response.ok ? "/dashboard" : "/login");
      } catch {
        if (!cancelled) {
          router.replace("/login");
        }
      }
    }

    void resolveEntryPoint();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <AuthBootScreen
      eyebrow="PineApple Entry"
      title="Відкриваємо ваш простір навчання"
      text="Перевіряємо доступ, підтягуємо сесію та відкриваємо правильний маршрут у системі."
    />
  );
}
