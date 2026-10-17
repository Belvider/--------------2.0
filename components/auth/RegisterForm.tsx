"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { getRequestError, requestJson } from "@/lib/http-client";

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      position: String(formData.get("position") ?? ""),
      department: String(formData.get("department") ?? ""),
      store: String(formData.get("store") ?? "")
    };

    try {
      await requestJson("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });

      router.push("/dashboard");
      router.refresh();
    } catch (requestError) {
      setError(getRequestError(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="auth-field">
        <label htmlFor="name" className="auth-label">
          ПІБ
        </label>
        <input id="name" name="name" required className="auth-input focus-ring" placeholder="Ім'я Прізвище" />
      </div>

      <div className="auth-field">
        <label htmlFor="email" className="auth-label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="auth-input focus-ring"
          placeholder="you@company.ua"
        />
      </div>

      <div className="auth-field">
        <label htmlFor="password" className="auth-label">
          Пароль
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="auth-input focus-ring"
          placeholder="Мінімум 8 символів, велика літера та цифра"
        />
      </div>

      <div className="auth-form-grid">
        <div className="auth-field">
          <label htmlFor="position" className="auth-label">
            Посада
          </label>
          <input
            id="position"
            name="position"
            required
            className="auth-input focus-ring"
            placeholder="Продавець-консультант"
          />
        </div>

        <div className="auth-field">
          <label htmlFor="department" className="auth-label">
            Відділ
          </label>
          <input
            id="department"
            name="department"
            required
            className="auth-input focus-ring"
            placeholder="Мобільна техніка"
          />
        </div>
      </div>

      <div className="auth-field">
        <label htmlFor="store" className="auth-label">
          Магазин
        </label>
        <input
          id="store"
          name="store"
          required
          className="auth-input focus-ring"
          placeholder="Київ #1"
        />
      </div>

      {error && <p role="alert" className="auth-message auth-message--error">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="auth-submit focus-ring disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Створюємо акаунт..." : "Зареєструватись"}
      </button>

      <p className="auth-inline-note">
        Вже маєте акаунт?{" "}
        <Link href="/login" className="auth-link auth-link--accent focus-ring rounded px-1">
          Увійти
        </Link>
      </p>
    </form>
  );
}
