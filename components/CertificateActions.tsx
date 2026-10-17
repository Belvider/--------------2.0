"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Printer } from "lucide-react";

type CertificateActionsProps = {
  certId: number;
  title: string;
};

export function CertificateActions({ certId, title }: CertificateActionsProps) {
  const [copied, setCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyUrl, setCopyUrl] = useState("");
  const timerRef = useRef<number | null>(null);

  useEffect(() => () => { if (timerRef.current !== null) window.clearTimeout(timerRef.current); }, []);

  async function handleCopy() {
    if (isCopying) return;
    const url = `${window.location.origin}/certificate/${certId}`;
    setCopyUrl(url);
    setError(null);
    setCopied(false);
    setIsCopying(true);
    try {
      if (!navigator.clipboard?.writeText) {
        setError("Автоматичне копіювання недоступне. Скопіюйте посилання з поля нижче.");
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Не вдалося скопіювати посилання. Виділіть і скопіюйте його з поля нижче.");
    } finally {
      setIsCopying(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        disabled={isCopying}
        className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.04] disabled:opacity-60 print:hidden"
      >
        {copied ? (
          <><Check className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />Скопійовано!</>
        ) : (
          <><Copy className="size-4" aria-hidden="true" />{isCopying ? "Копіюємо..." : "Скопіювати посилання"}</>
        )}
      </button>
      <button
        type="button"
        onClick={handlePrint}
        title={title}
        className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.04] print:hidden"
      >
        <Printer className="size-4" aria-hidden="true" />
        Друкувати
      </button>
      {error && <div className="w-full space-y-2 print:hidden">
        <p role="alert" className="text-sm text-rose-200">{error}</p>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>Посилання на сертифікат для ручного копіювання</span>
          <input readOnly value={copyUrl} onFocus={(event) => event.currentTarget.select()}
            className="focus-ring w-full rounded-xl border border-white/10 px-3 py-2 text-white" />
        </label>
      </div>}
    </>
  );
}
