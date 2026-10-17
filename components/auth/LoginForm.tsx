"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { getRequestError, requestJson } from "@/lib/http-client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await requestJson("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password })
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
    <form onSubmit={handleSubmit} className="auth-form auth-form--login">
      <div className="auth-field">
        <label className="auth-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="auth-input focus-ring"
          placeholder="you@company.ua"
          required
        />
      </div>

      <div className="auth-field">
        <label className="auth-label" htmlFor="password">
          Пароль
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="auth-input focus-ring"
          placeholder="••••••••"
          required
        />
      </div>

      {error && <p role="alert" className="auth-message auth-message--error">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="auth-submit focus-ring disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Входимо..." : "Увійти"}
      </button>

      <div className="auth-links auth-links--login">
        <Link href="/forgot-password" className="auth-link focus-ring rounded px-1">
          Забули пароль?
        </Link>
        <Link href="/register" className="auth-link auth-link--accent focus-ring rounded px-1">
          Створити акаунт
        </Link>
      </div>
    </form>
  );
}
