"use client";

import { useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { getRequestError, requestJson } from "@/lib/http-client";

export function ResetPasswordForm() {
  const params = useSearchParams();
  const token = useMemo(() => params.get("token") ?? "", [params]);

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const data = await requestJson<{ message?: string }>("/api/auth/reset-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, password })
      });

      setMessage(data.message ?? "Пароль змінено");
    } catch (requestError) {
      setError(getRequestError(requestError));
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return <p className="auth-message auth-message--error">Токен не знайдено у посиланні.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="auth-field">
        <label className="auth-label" htmlFor="password">
          Новий пароль
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="auth-input focus-ring"
          placeholder="Мінімум 8 символів, велика літера та цифра"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="auth-submit focus-ring disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Оновлюємо..." : "Змінити пароль"}
      </button>

      {message && <p className="auth-message auth-message--success">{message}</p>}
      {error && <p role="alert" className="auth-message auth-message--error">{error}</p>}
    </form>
  );
}
