"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2, BookOpenCheck, FolderOpen, Search, Smartphone, X } from "lucide-react";
import { AccessibleDialog } from "@/components/AccessibleDialog";
import { getRequestError, requestJson } from "@/lib/http-client";

type SearchResultType = "brand" | "category" | "module" | "product";

type SearchResult = {
  type: SearchResultType;
  id: string | number;
  title: string;
  subtitle: string;
  meta?: string;
  href: string;
};

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  /* Відкриття через Cmd+K / Ctrl+K */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    function openSearch() { setOpen(true); }
    window.addEventListener("keydown", onKey);
    window.addEventListener("portal:open-search", openSearch);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("portal:open-search", openSearch);
    };
  }, []);

  /* Фокус при відкритті */
  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setActiveIndex(0);
      setError(null);
    }
  }, [open]);

  /* Пошук */
  useEffect(() => {
    const trimmed = query.trim();
    setResults([]);
    setActiveIndex(0);
    setError(null);
    if (!open || !trimmed) { setIsPending(false); return; }
    const controller = new AbortController();
    let current = true;
    setIsPending(true);
    const timer = setTimeout(async () => {
      try {
        const data = await requestJson<SearchResult[]>(`/api/search?q=${encodeURIComponent(trimmed)}`, { signal: controller.signal });
        if (current) setResults(data);
      } catch (requestError) {
        if (current) setError(getRequestError(requestError));
      } finally {
        if (current) setIsPending(false);
      }
    }, 180);
    return () => { current = false; clearTimeout(timer); controller.abort(); };
  }, [open, query]);

  /* Клавіатурна навігація */
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => Math.max(0, Math.min(i + 1, results.length - 1))); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
    if (e.key === "Enter" && results[activeIndex]) {
      router.push(results[activeIndex].href as never);
      setOpen(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pb-4 pt-[8dvh]"
      style={{ background: "rgba(7, 5, 14, 0.7)", backdropFilter: "blur(8px)" }}
      onClick={() => setOpen(false)}
    >
      <AccessibleDialog
        label="Пошук по порталу"
        onClose={() => setOpen(false)}
        initialFocusRef={inputRef}
        className="w-full max-w-xl max-h-[88dvh] overflow-y-auto rounded-[20px] border border-white/10 bg-[rgba(13,10,22,0.98)] shadow-[0_32px_80px_rgba(0,0,0,0.5)]"
      >
        {/* Поле введення */}
        <div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3.5">
          <Search className="size-4 flex-none text-slate-500" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            aria-label="Пошуковий запит"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Пошук по модулях і брендах..."
            className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          <div className="flex items-center gap-2">
            {isPending && (
              <span className="size-4 animate-spin rounded-full border border-white/20 border-t-[color:var(--brand-strong)]" />
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="focus-ring rounded-[8px] p-1.5 text-slate-500 transition hover:bg-white/[0.04] hover:text-slate-300"
              aria-label="Закрити пошук"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Результати */}
        <div className="max-h-80 overflow-y-auto">
          {error ? <p role="alert" className="px-4 py-6 text-sm text-rose-200">{error}</p> : isPending ? (
            <p role="status" className="px-4 py-6 text-center text-sm text-slate-500">Шукаємо...</p>
          ) : results.length > 0 ? (
            <ul className="p-2">
              {results.map((result, index) => {
                const active = index === activeIndex;
                return (
                  <li key={`${result.type}-${result.id}`}>
                    <Link
                      href={result.href as never}
                      onClick={() => setOpen(false)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`flex items-center gap-3 rounded-[12px] px-3 py-2.5 transition ${
                        active ? "bg-[rgba(40,178,158,0.1)]" : "hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className={`flex size-8 flex-none items-center justify-center rounded-[8px] border ${
                        active
                          ? "border-[rgba(40,178,158,0.22)] bg-[rgba(40,178,158,0.12)]"
                          : "border-white/10 bg-white/[0.03]"
                      }`}>
                        {result.type === "brand" && <Building2 className={`size-4 ${active ? "text-[color:var(--brand-strong)]" : "text-slate-500"}`} aria-hidden="true" />}
                        {result.type === "category" && <FolderOpen className={`size-4 ${active ? "text-[color:var(--brand-strong)]" : "text-slate-500"}`} aria-hidden="true" />}
                        {result.type === "module" && <BookOpenCheck className={`size-4 ${active ? "text-[color:var(--brand-strong)]" : "text-slate-500"}`} aria-hidden="true" />}
                        {result.type === "product" && <Smartphone className={`size-4 ${active ? "text-[color:var(--brand-strong)]" : "text-slate-500"}`} aria-hidden="true" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium text-white">{result.title}</p>
                          {result.meta && (
                            <span className="hidden flex-none rounded-full border border-white/[0.08] bg-white/[0.025] px-2 py-0.5 text-[10px] font-semibold text-slate-500 sm:inline-block">
                              {result.meta}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{result.subtitle}</p>
                      </div>
                      <ArrowRight className={`size-3.5 flex-none transition ${active ? "text-[color:var(--brand-strong)]" : "text-slate-600"}`} aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : query.trim() ? (
            <div className="px-4 py-8 text-center text-sm text-slate-500">
              Нічого не знайдено по запиту «{query}»
            </div>
          ) : (
            <div className="px-4 py-6 text-center text-xs text-slate-600">
              Введіть бренд, назву модуля або ключове слово
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2.5 text-[10px] text-slate-600">
          <span className="flex items-center gap-2">
            <kbd className="rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px]">↑↓</kbd>
            навігація
            <kbd className="rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px]">Enter</kbd>
            відкрити
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px]">Esc</kbd>
            закрити
          </span>
        </div>
      </AccessibleDialog>
    </div>
  );
}
