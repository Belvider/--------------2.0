"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { getRequestError, requestJson } from "@/lib/http-client";
import { getMatchingOptions, hasMatchingAnswer, type MatchingOptions } from "@/lib/matching-quiz";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CheckSquare2,
  Circle,
  ClipboardList,
  RefreshCw,
  ShieldCheck,
  Trophy,
  XCircle
} from "lucide-react";

type Question = {
  id: number;
  question: string;
  type: "SINGLE" | "MULTIPLE" | "TRUE_FALSE" | "MATCHING";
  options: unknown;
};

type ModuleQuizProps = {
  moduleId: number;
  questions: Question[];
  passScore: number;
};

type AnswerMap = Record<number, unknown>;

type QuizResult = {
  score: number;
  passed: boolean;
  attemptsLeft: number;
  correct: number;
  total: number;
  questionResults?: { questionId: number; isCorrect: boolean }[];
};

function normalizeOptions(options: unknown): string[] {
  if (!Array.isArray(options)) return [];
  return options.map((item) => String(item));
}

function hasAnswer(answer: unknown, matching?: MatchingOptions) {
  if (matching) return hasMatchingAnswer(answer, matching);
  if (typeof answer === "boolean") return true;
  if (typeof answer === "number") return true;
  if (Array.isArray(answer)) return answer.length > 0;
  return false;
}

function getTypeConfig(type: Question["type"]) {
  switch (type) {
    case "SINGLE":
      return { label: "Одна відповідь", icon: Circle, shape: "radio" as const };
    case "MULTIPLE":
      return { label: "Кілька відповідей", icon: CheckSquare2, shape: "checkbox" as const };
    case "TRUE_FALSE":
      return { label: "Так / Ні", icon: ShieldCheck, shape: "radio" as const };
    case "MATCHING":
      return { label: "Зіставлення", icon: ArrowRight, shape: "radio" as const };
    default:
      return { label: "Питання", icon: Circle, shape: "radio" as const };
  }
}

function ScoreRing({ score, passed }: { score: number; passed: boolean }) {
  const r = 42;
  const circumference = 2 * Math.PI * r;
  const filled = (score / 100) * circumference;
  const color = passed ? "rgba(40,178,158,0.9)" : "rgba(230,191,114,0.9)";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="120" height="120" viewBox="0 0 100 100" className="-rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={`${filled} ${circumference}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <span className="absolute font-[var(--font-heading)] text-3xl font-semibold text-white">
        {score}%
      </span>
    </div>
  );
}

export function ModuleQuiz({ moduleId, questions, passScore }: ModuleQuizProps) {
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const prepared = useMemo(
    () => questions.map((q) => ({ ...q, options: normalizeOptions(q.options), matching: getMatchingOptions(q.options) })),
    [questions]
  );

  const answeredCount = useMemo(
    () => prepared.filter((q) => hasAnswer(answers[q.id], q.type === "MATCHING" ? q.matching : undefined)).length,
    [answers, prepared]
  );

  const progressPct = prepared.length === 0 ? 0 : Math.round((answeredCount / prepared.length) * 100);
  const allAnswered = answeredCount === prepared.length;

  function setSingle(id: number, value: number) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function setBoolean(id: number, value: boolean) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function toggleMulti(id: number, index: number) {
    setAnswers((prev) => {
      const current = Array.isArray(prev[id]) ? (prev[id] as number[]) : [];
      const exists = current.includes(index);
      return { ...prev, [id]: exists ? current.filter((i) => i !== index) : [...current, index] };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    const payload = {
      moduleId,
      answers: prepared.map((q) => ({ questionId: q.id, answer: answers[q.id] }))
    };

    try {
    const data = await requestJson<Partial<QuizResult>>("/api/quiz/submit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });

    setResult({
      score: data.score ?? 0,
      passed: data.passed ?? false,
      attemptsLeft: data.attemptsLeft ?? 0,
      correct: data.correct ?? 0,
      total: data.total ?? 0,
      questionResults: data.questionResults
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (failure: unknown) {
      setError(getRequestError(failure, "Не вдалося перевірити тест"));
    } finally { setLoading(false); }
  }

  function handleRetry() {
    setAnswers({});
    setResult(null);
    setError(null);
  }

  /* ── Екран результату ── */
  if (result) {
    const passed = result.passed;

    return (
      <section className="card animate-fadeUp p-5 sm:p-8">
        <div className="mx-auto max-w-xl">

          {/* Статус */}
          <div className="flex flex-col items-center text-center">
            <div className={`inline-flex size-16 items-center justify-center rounded-2xl border ${
              passed
                ? "border-[rgba(40,178,158,0.3)] bg-[rgba(40,178,158,0.12)]"
                : "border-[rgba(230,191,114,0.3)] bg-[rgba(230,191,114,0.1)]"
            }`}>
              {passed
                ? <Trophy className="size-8 text-[color:var(--brand-strong)]" aria-hidden="true" />
                : <RefreshCw className="size-8 text-[#e6bf72]" aria-hidden="true" />}
            </div>

            <h2 className="mt-5 font-[var(--font-heading)] text-3xl font-semibold text-white">
              {passed ? "Тест складено!" : "Ще одна спроба"}
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              {passed
                ? "Ви успішно підтвердили знання з модуля. Результат зараховано."
                : `Прохідний бал — ${passScore}%. Перегляньте матеріал і спробуйте ще.`}
            </p>
          </div>

          {/* Балове кільце */}
          <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-10">
            <ScoreRing score={result.score} passed={passed} />

            <div className="space-y-3 text-center sm:text-left">
              <div className="rounded-[14px] border border-white/10 bg-white/[0.03] px-5 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Правильних</p>
                <p className="mt-1.5 font-[var(--font-heading)] text-2xl font-semibold text-white">
                  {result.correct}
                  <span className="text-base font-normal text-slate-500"> / {result.total}</span>
                </p>
              </div>

              <div className={`rounded-[14px] border px-5 py-3 ${
                passed
                  ? "border-[rgba(40,178,158,0.2)] bg-[rgba(40,178,158,0.08)]"
                  : "border-[rgba(230,191,114,0.2)] bg-[rgba(230,191,114,0.07)]"
              }`}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Прохідний бал</p>
                <p className={`mt-1.5 font-[var(--font-heading)] text-2xl font-semibold ${
                  passed ? "text-[color:var(--brand-strong)]" : "text-[#e6bf72]"
                }`}>
                  {passed ? "✓" : `${passScore}%`}
                </p>
              </div>

              {!passed && result.attemptsLeft > 0 && (
                <div className="rounded-[14px] border border-white/10 bg-white/[0.03] px-5 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Спроб залишилось</p>
                  <p className="mt-1.5 font-[var(--font-heading)] text-2xl font-semibold text-white">
                    {result.attemptsLeft}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Прогрес-бар результату */}
          <div className="mt-8 overflow-hidden rounded-full bg-white/[0.06]" style={{ height: 6 }}>
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                passed
                  ? "bg-[linear-gradient(90deg,rgba(40,178,158,0.95),rgba(138,242,223,0.85))]"
                  : "bg-[linear-gradient(90deg,rgba(230,191,114,0.9),rgba(245,210,150,0.8))]"
              }`}
              style={{ width: `${result.score}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-slate-500">
            <span>0%</span>
            <span className="text-[11px] font-semibold">{passScore}% — прохідний</span>
            <span>100%</span>
          </div>

          {/* Breakdown питань */}
          {result.questionResults && result.questionResults.length > 0 && (
            <div className="mt-8">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Відповіді на запитання
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {result.questionResults.map((qr, i) => {
                  const q = prepared.find((p) => p.id === qr.questionId);
                  return (
                    <div
                      key={qr.questionId}
                      className={`flex items-start gap-3 rounded-[12px] border px-3.5 py-3 text-sm ${
                        qr.isCorrect
                          ? "border-[rgba(40,178,158,0.18)] bg-[rgba(40,178,158,0.06)]"
                          : "border-rose-500/15 bg-rose-500/[0.05]"
                      }`}
                    >
                      <span className={`mt-0.5 flex size-5 flex-none items-center justify-center rounded-full text-[10px] font-bold ${
                        qr.isCorrect
                          ? "bg-[rgba(40,178,158,0.2)] text-[color:var(--brand-strong)]"
                          : "bg-rose-500/15 text-rose-300"
                      }`}>
                        {qr.isCorrect ? "✓" : "✗"}
                      </span>
                      <span className={`line-clamp-2 leading-5 ${qr.isCorrect ? "text-slate-400" : "text-rose-200"}`}>
                        {q ? `${i + 1}. ${q.question}` : `Питання ${i + 1}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Дії */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {passed ? (
              <>
                <Link
                  href="/profile"
                  className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.07]"
                >
                  Переглянути профіль
                </Link>
                <Link
                  href="/brands"
                  className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,rgba(40,178,158,0.28),rgba(13,16,28,0.94))] border border-[rgba(40,178,158,0.32)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  До каталогу
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={`/module/${moduleId}`}
                  className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.07]"
                >
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Переглянути матеріал
                </Link>
                {result.attemptsLeft > 0 ? (
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,rgba(230,191,114,0.22),rgba(13,16,28,0.94))] border border-[rgba(230,191,114,0.28)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                  >
                    <RefreshCw className="size-4" aria-hidden="true" />
                    Спробувати ще раз
                  </button>
                ) : (
                  <div className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-5 py-3 text-sm font-medium text-slate-500">
                    <XCircle className="size-4" aria-hidden="true" />
                    Ліміт спроб вичерпано
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </section>
    );
  }

  /* ── Форма тесту ── */
  return (
    <section id="quiz" className="card p-5 sm:p-6 lg:p-7">

      {/* Заголовок */}
      <header className="border-b border-white/[0.07] pb-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="portal-chip">Перевірка знань</span>
            <h2 className="portal-display-title mt-4 text-[clamp(1.8rem,4vw,2.6rem)] text-white">
              Фінальний тест
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-7 text-slate-600">
              Прохідний бал — {passScore}%. Відповідайте спокійно, усі питання засновані на пройденому матеріалі.
            </p>
          </div>

          {/* Лічильник відповідей */}
          <div className="rounded-[16px] border border-white/10 bg-white/[0.03] px-5 py-4 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Відповідей</p>
            <p className="mt-2 font-[var(--font-heading)] text-3xl font-semibold text-white">
              {answeredCount}
              <span className="text-lg font-normal text-slate-500"> / {prepared.length}</span>
            </p>
          </div>
        </div>

        {/* Прогрес-бар */}
        <div className="mt-5 overflow-hidden rounded-full bg-white/[0.06]" style={{ height: 5 }}>
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,rgba(40,178,158,0.9),rgba(138,242,223,0.8))] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-[11px] text-slate-500">
          <span>{progressPct}% заповнено</span>
          <span>{prepared.length - answeredCount} залишилось</span>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">

        {prepared.map((question, index) => {
          const answered = hasAnswer(answers[question.id], question.type === "MATCHING" ? question.matching : undefined);
          const typeConfig = getTypeConfig(question.type);
          const TypeIcon = typeConfig.icon;

          return (
            <article
              key={question.id}
              className={`overflow-hidden rounded-[18px] border transition-colors duration-200 ${
                answered ? "border-[rgba(40,178,158,0.15)]" : "border-white/[0.07]"
              } bg-white/[0.02]`}
            >
              {/* Шапка питання */}
              <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-[var(--font-heading)] text-lg font-semibold text-white/40">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="hidden h-4 w-px bg-white/10 sm:block" />
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    <TypeIcon className="size-3.5" aria-hidden="true" />
                    {typeConfig.label}
                  </span>
                </div>

                {answered ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(40,178,158,0.22)] bg-[rgba(40,178,158,0.1)] px-3 py-1 text-[11px] font-semibold text-[color:var(--brand-strong)]">
                    <CheckCircle2 className="size-3" aria-hidden="true" />
                    Відповідь вибрана
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1 text-[11px] font-semibold text-slate-500">
                    Очікує відповідь
                  </span>
                )}
              </div>

              {/* Текст питання + варіанти */}
              <div className="px-5 py-5">
                <p className="text-base font-semibold leading-7 text-white sm:text-lg">
                  {question.question}
                </p>

                <div className="mt-4 space-y-2.5">

                  {question.type === "MATCHING" && question.matching.left.map((left, leftIndex) => {
                    const current = answers[question.id] && typeof answers[question.id] === "object"
                      ? answers[question.id] as Record<string, number> : {};
                    return (
                      <div key={leftIndex} className="grid min-w-0 grid-cols-1 gap-2 rounded-xl border border-white/10 p-3 sm:grid-cols-2 sm:items-center">
                        <label htmlFor={`matching-${question.id}-${leftIndex}`} className="text-sm text-slate-200">{left}</label>
                        <select id={`matching-${question.id}-${leftIndex}`} className="focus-ring min-w-0 rounded-lg border border-white/10 bg-[var(--surface)] px-3 py-2 text-sm text-white"
                          value={current[String(leftIndex)] ?? ""}
                          onChange={(event) => {
                            const next = { ...current };
                            if (event.target.value === "") delete next[String(leftIndex)];
                            else next[String(leftIndex)] = Number(event.target.value);
                            setAnswers((previous) => ({ ...previous, [question.id]: next }));
                          }}>
                          <option value="">Оберіть відповідність</option>
                          {question.matching.right.map((label, rightIndex) => ({ label, rightIndex }))
                            .sort((a, b) => a.label.localeCompare(b.label, "uk"))
                            .map(({ label, rightIndex }) => <option key={rightIndex} value={rightIndex}>{label}</option>)}
                        </select>
                      </div>
                    );
                  })}
                  {question.type === "MATCHING" && question.matching.left.length === 0 &&
                    <p role="alert" className="text-sm text-rose-200">Варіанти зіставлення відсутні. Повідомте адміністратора.</p>}

                  {/* SINGLE */}
                  {question.type === "SINGLE" && question.options.map((option, i) => {
                    const selected = answers[question.id] === i;
                    return (
                      <label
                        key={option + i}
                        className={`flex cursor-pointer items-start gap-3.5 rounded-[12px] border px-4 py-3.5 text-sm transition-colors focus-within:ring-2 focus-within:ring-[var(--brand-strong)] ${
                          selected
                            ? "border-[rgba(40,178,158,0.28)] bg-[rgba(40,178,158,0.1)] text-white"
                            : "border-white/[0.07] bg-white/[0.015] text-slate-300 hover:border-white/[0.12] hover:bg-white/[0.035]"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q-${question.id}`}
                          checked={selected}
                          onChange={() => setSingle(question.id, i)}
                          className="sr-only"
                        />
                        <span className={`mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded-full border transition-colors ${
                          selected
                            ? "border-[rgba(40,178,158,0.7)] bg-[rgba(40,178,158,0.2)]"
                            : "border-white/25"
                        }`}>
                          {selected && <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand-strong)]" />}
                        </span>
                        <span className="leading-6">{option}</span>
                      </label>
                    );
                  })}

                  {/* TRUE_FALSE */}
                  {question.type === "TRUE_FALSE" && [
                    { label: "Так (True)", value: true },
                    { label: "Ні (False)", value: false }
                  ].map((item) => {
                    const selected = answers[question.id] === item.value;
                    return (
                      <label
                        key={item.label}
                        className={`flex cursor-pointer items-center gap-3.5 rounded-[12px] border px-4 py-3.5 text-sm transition-colors focus-within:ring-2 focus-within:ring-[var(--brand-strong)] ${
                          selected
                            ? "border-[rgba(40,178,158,0.28)] bg-[rgba(40,178,158,0.1)] text-white"
                            : "border-white/[0.07] bg-white/[0.015] text-slate-300 hover:border-white/[0.12] hover:bg-white/[0.035]"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q-${question.id}`}
                          checked={selected}
                          onChange={() => setBoolean(question.id, item.value)}
                          className="sr-only"
                        />
                        <span className={`flex h-4 w-4 flex-none items-center justify-center rounded-full border transition-colors ${
                          selected ? "border-[rgba(40,178,158,0.7)] bg-[rgba(40,178,158,0.2)]" : "border-white/25"
                        }`}>
                          {selected && <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand-strong)]" />}
                        </span>
                        <span className="leading-6">{item.label}</span>
                      </label>
                    );
                  })}

                  {/* MULTIPLE */}
                  {question.type === "MULTIPLE" && question.options.map((option, i) => {
                    const selected = Array.isArray(answers[question.id])
                      ? (answers[question.id] as number[]).includes(i)
                      : false;
                    return (
                      <label
                        key={option + i}
                        className={`flex cursor-pointer items-start gap-3.5 rounded-[12px] border px-4 py-3.5 text-sm transition-colors focus-within:ring-2 focus-within:ring-[var(--brand-strong)] ${
                          selected
                            ? "border-[rgba(40,178,158,0.28)] bg-[rgba(40,178,158,0.1)] text-white"
                            : "border-white/[0.07] bg-white/[0.015] text-slate-300 hover:border-white/[0.12] hover:bg-white/[0.035]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleMulti(question.id, i)}
                          className="sr-only"
                        />
                        <span className={`mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded-[4px] border transition-colors ${
                          selected
                            ? "border-[rgba(40,178,158,0.7)] bg-[rgba(40,178,158,0.2)]"
                            : "border-white/25"
                        }`}>
                          {selected && (
                            <svg viewBox="0 0 10 8" className="h-2.5 w-2.5 text-[color:var(--brand-strong)]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 4l3 3 5-6" />
                            </svg>
                          )}
                        </span>
                        <span className="leading-6">{option}</span>
                      </label>
                    );
                  })}

                </div>
              </div>
            </article>
          );
        })}

        {/* Помилка */}
        {error && (
          <div className="flex items-start gap-3 rounded-[14px] border border-[rgba(255,123,135,0.22)] bg-[rgba(255,123,135,0.1)] px-4 py-3.5 text-sm text-red-200">
            <AlertCircle className="mt-0.5 size-4 flex-none" aria-hidden="true" />
            {error}
          </div>
        )}

        {/* Панель відправки */}
        <div className={`flex flex-wrap items-center justify-between gap-4 rounded-[16px] border px-5 py-4 transition-colors ${
          allAnswered
            ? "border-[rgba(40,178,158,0.18)] bg-[rgba(40,178,158,0.06)]"
            : "border-white/[0.07] bg-white/[0.02]"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`inline-flex size-10 items-center justify-center rounded-xl border ${
              allAnswered
                ? "border-[rgba(40,178,158,0.3)] bg-[rgba(40,178,158,0.14)]"
                : "border-white/10 bg-white/[0.04]"
            }`}>
              {allAnswered
                ? <CheckCircle2 className="size-5 text-[color:var(--brand-strong)]" aria-hidden="true" />
                : <ClipboardList className="size-5 text-slate-500" aria-hidden="true" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                {allAnswered ? "Всі відповіді вибрано" : `Ще ${prepared.length - answeredCount} без відповіді`}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {allAnswered
                  ? "Можна відправляти тест."
                  : "Можна відправити зараз або заповнити решту."}
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="focus-ring inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,rgba(40,178,158,0.28),rgba(13,16,28,0.94))] border border-[rgba(40,178,158,0.32)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(0,0,0,0.22)] transition hover:brightness-110 disabled:opacity-60"
          >
            <ShieldCheck className="size-4" aria-hidden="true" />
            {loading ? "Перевіряємо..." : "Завершити тест"}
          </button>
        </div>

      </form>
    </section>
  );
}
