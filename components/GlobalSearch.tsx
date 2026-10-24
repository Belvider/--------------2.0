"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2, BookOpenCheck, FolderOpen, Search, Smartphone, TextSearch, X } from "lucide-react";
import { AccessibleDialog } from "@/components/AccessibleDialog";
import { getRequestError, requestJson } from "@/lib/http-client";
import { splitSearchHighlights } from "@/lib/search-highlights";
import type { SearchResponse, SearchResult, SearchResultType } from "@/lib/search-types";

const PAGE_SIZE = 12;
const resultLabels: Record<SearchResultType, string> = {
  brand: "Бренд", category: "Категорія", module: "Модуль", product: "Пристрій", section: "Фрагмент матеріалу"
};
const resultIcons = { brand: Building2, category: FolderOpen, module: BookOpenCheck, product: Smartphone, section: TextSearch };

function Highlight({ text, query }: { text: string; query: string }) {
  return <>{splitSearchHighlights(text, query).map((part, index) => part.highlighted
    ? <mark key={index} className="rounded-sm bg-[rgba(40,178,158,0.2)] px-0.5 text-teal-100">{part.text}</mark>
    : part.text)}</>;
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [nextOffset, setNextOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryOffset, setRetryOffset] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const requestVersion = useRef(0);
  const pendingRef = useRef(false);
  const navigatingRef = useRef(false);
  const listId = useId();
  const router = useRouter();
  const trimmed = query.trim();
  const canSearch = trimmed.length >= 2;
  const activeResultKey = results[activeIndex] ? `${results[activeIndex].type}-${results[activeIndex].id}` : "";

  function closeSearch() {
    navigatingRef.current = false;
    requestVersion.current++;
    controllerRef.current?.abort();
    setOpen(false);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        navigatingRef.current = false;
        setOpen((previous) => !previous);
      }
    }
    function openSearch() { navigatingRef.current = false; setOpen(true); }
    window.addEventListener("keydown", onKey);
    window.addEventListener("portal:open-search", openSearch);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("portal:open-search", openSearch);
    };
  }, []);

  const fetchPage = useCallback(async (searchQuery: string, offset: number, version: number) => {
    if (pendingRef.current || requestVersion.current !== version) return;
    const controller = new AbortController();
    controllerRef.current = controller;
    pendingRef.current = true;
    setIsPending(true);
    setError(null);
    setRetryOffset(offset);
    try {
      const data = await requestJson<SearchResponse>(`/api/search?q=${encodeURIComponent(searchQuery)}&offset=${offset}&limit=${PAGE_SIZE}`, { signal: controller.signal });
      if (requestVersion.current !== version || controller.signal.aborted) return;
      if (!data || !Array.isArray(data.results) || !Number.isFinite(data.total) || !Number.isFinite(data.offset)) {
        throw new Error("Сервер повернув некоректні результати пошуку. Спробуйте ще раз.");
      }
      setResults((previous) => offset === 0 ? data.results : [
        ...previous,
        ...data.results.filter((item) => !previous.some((existing) => existing.type === item.type && existing.id === item.id))
      ]);
      setTotal(data.total);
      setNextOffset(data.offset + data.results.length);
      setHasMore(data.hasMore && data.results.length > 0);
    } catch (requestError) {
      if (requestVersion.current === version && !controller.signal.aborted) setError(getRequestError(requestError));
    } finally {
      if (requestVersion.current === version) {
        pendingRef.current = false;
        setIsPending(false);
      }
    }
  }, []);

  useEffect(() => {
    const version = ++requestVersion.current;
    controllerRef.current?.abort();
    pendingRef.current = false;
    setResults([]);
    setTotal(0);
    setNextOffset(0);
    setHasMore(false);
    setActiveIndex(0);
    setError(null);
    if (!open) setQuery("");
    if (!open || trimmed.length < 2) { setIsPending(false); return; }
    setIsPending(true);
    const timer = setTimeout(() => { void fetchPage(trimmed, 0, version); }, 180);
    return () => { clearTimeout(timer); controllerRef.current?.abort(); };
  }, [open, trimmed, fetchPage]);

  useEffect(() => {
    if (open && activeResultKey) document.getElementById(`${listId}-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex, activeResultKey, listId]);

  function changeQuery(value: string) {
    // Invalidate before the next render, including fetch implementations that ignore AbortSignal.
    if (value.trim() !== trimmed) {
      requestVersion.current++;
      controllerRef.current?.abort();
      pendingRef.current = false;
      setResults([]);
    }
    setQuery(value);
  }

  function navigate(result: SearchResult) {
    navigatingRef.current = true;
    requestVersion.current++;
    controllerRef.current?.abort();
    setOpen(false);
    // Wait until the dialog has released its focus trap and body scroll lock.
    window.requestAnimationFrame(() => {
      const destination = new URL(result.href, window.location.href);
      if (destination.pathname === window.location.pathname && destination.hash) {
        window.location.hash = destination.hash;
        window.dispatchEvent(new CustomEvent("material:navigate", { detail: { anchor: decodeURIComponent(destination.hash.slice(1)) } }));
      } else {
        router.push(result.href as never);
      }
    });
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(0, Math.min(index + (event.key === "ArrowDown" ? 1 : -1), results.length - 1)));
    } else if (event.key === "Enter" && results[activeIndex]) {
      event.preventDefault();
      navigate(results[activeIndex]);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-2 pb-2 pt-[4dvh] sm:px-4 sm:pb-4 sm:pt-[8dvh]"
      style={{ background: "rgba(7, 5, 14, 0.7)", backdropFilter: "blur(8px)" }} onClick={closeSearch}>
      <AccessibleDialog label="Пошук по порталу" onClose={closeSearch} initialFocusRef={inputRef}
        restoreFocus={() => !navigatingRef.current}
        className="flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-[20px] border border-white/10 bg-[rgba(13,10,22,0.98)] shadow-[0_32px_80px_rgba(0,0,0,0.5)] sm:max-h-[84dvh]">
        <div className="flex shrink-0 items-center gap-2.5 border-b border-white/[0.07] px-3 py-3.5 sm:px-4">
          <Search className="size-4 flex-none text-slate-400" aria-hidden="true" />
          <input ref={inputRef} type="search" maxLength={160} role="combobox" aria-label="Пошуковий запит" aria-autocomplete="list"
            aria-expanded={results.length > 0} aria-controls={listId} aria-describedby={`${listId}-hint`}
            aria-activedescendant={results[activeIndex] ? `${listId}-${activeIndex}` : undefined}
            autoComplete="off" value={query} onChange={(event) => changeQuery(event.target.value)} onKeyDown={onKeyDown}
            placeholder="Що потрібно знайти?"
            className="min-w-0 flex-1 bg-transparent text-base text-white placeholder:text-slate-500 focus:outline-none sm:text-sm" />
          {isPending && <span aria-hidden="true" className="size-4 shrink-0 animate-spin rounded-full border border-white/20 border-t-[color:var(--brand-strong)]" />}
          <button type="button" onClick={closeSearch} className="focus-ring shrink-0 rounded-[8px] p-2 text-slate-400 transition hover:bg-white/[0.04] hover:text-slate-200" aria-label="Закрити пошук">
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <p id={`${listId}-hint`} className="shrink-0 border-b border-white/[0.04] px-4 py-2.5 text-xs leading-relaxed text-slate-400">
          Пошук у текстах, характеристиках і картках пристроїв. Результат відкриє потрібне місце в матеріалі.
        </p>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {results.length > 0 && <>
            <p role="status" aria-live="polite" className="px-4 pb-1 pt-3 text-xs text-slate-400">Знайдено: {total}. Показано: {results.length}.</p>
            <ul id={listId} role="listbox" aria-label="Результати пошуку" aria-busy={isPending} className="space-y-1 p-2">
              {results.map((result, index) => {
                const active = index === activeIndex;
                const Icon = resultIcons[result.type];
                return <li key={`${result.type}-${result.id}`} role="presentation">
                  <Link id={`${listId}-${index}`} href={result.href as never} role="option" aria-selected={active} tabIndex={-1}
                    onClick={(event) => {
                      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
                      event.preventDefault();
                      navigate(result);
                    }} onMouseEnter={() => setActiveIndex(index)} onFocus={() => setActiveIndex(index)}
                    className={`flex items-start gap-2.5 rounded-[12px] px-2.5 py-3 transition sm:gap-3 sm:px-3 ${active ? "bg-[rgba(40,178,158,0.1)]" : "hover:bg-white/[0.04]"}`}>
                    <span className={`mt-0.5 flex size-8 flex-none items-center justify-center rounded-[8px] border ${active ? "border-[rgba(40,178,158,0.22)] bg-[rgba(40,178,158,0.12)]" : "border-white/10 bg-white/[0.03]"}`}>
                      <Icon className={`size-4 ${active ? "text-[color:var(--brand-strong)]" : "text-slate-400"}`} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
                      <span className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold tracking-wide text-slate-400">
                        <span className={active ? "text-teal-300" : ""}>{resultLabels[result.type]}</span>
                        {result.meta && <span className="text-slate-500">{result.meta}</span>}
                      </span>
                      <span className="block text-sm font-semibold leading-snug text-white"><Highlight text={result.title} query={trimmed} /></span>
                      <span className="mt-1 block text-xs leading-relaxed text-slate-400"><Highlight text={result.subtitle} query={trimmed} /></span>
                      {result.snippet && <span className="mt-2 block line-clamp-3 text-xs leading-relaxed text-slate-300"><Highlight text={result.snippet} query={trimmed} /></span>}
                    </span>
                    <ArrowRight className={`mt-1 size-3.5 flex-none ${active ? "text-[color:var(--brand-strong)]" : "text-slate-500"}`} aria-hidden="true" />
                  </Link>
                </li>;
              })}
            </ul>
          </>}
          {error ? <div className="px-4 py-4">
            <p role="alert" className="text-sm leading-relaxed text-rose-200">{error}</p>
            <button type="button" onClick={() => { void fetchPage(trimmed, retryOffset, requestVersion.current); }} disabled={isPending}
              className="focus-ring mt-3 rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/[0.05] disabled:opacity-50">Спробувати ще раз</button>
          </div> : results.length === 0 && (isPending
            ? <p role="status" className="px-4 py-8 text-center text-sm text-slate-400">Шукаємо в матеріалах…</p>
            : <p role="status" className="px-4 py-8 text-center text-sm leading-relaxed text-slate-400">{canSearch
              ? <>За запитом «{trimmed}» нічого не знайдено. Спробуйте іншу назву чи характеристику.</>
              : <>Введіть щонайменше 2 символи: назву пристрою, характеристику або запитання.</>}</p>)}
          {hasMore && !error && <div className="px-4 pb-4 pt-1">
            <button type="button" onClick={() => { void fetchPage(trimmed, nextOffset, requestVersion.current); }} disabled={isPending}
              className="focus-ring w-full rounded-xl border border-white/10 bg-white/[0.025] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.06] disabled:opacity-50">
              {isPending ? "Завантажуємо…" : `Показати ще (${Math.max(0, total - results.length)})`}
            </button>
          </div>}
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-white/[0.06] px-4 py-2.5 text-[10px] text-slate-400">
          <span><kbd className="font-mono">↑↓</kbd> обрати · <kbd className="font-mono">Enter</kbd> відкрити</span>
          <span><kbd className="font-mono">Esc</kbd> закрити</span>
        </div>
      </AccessibleDialog>
    </div>
  );
}
