"use client";

import { Search } from "lucide-react";

export function SearchTrigger({ compact = false }: { compact?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(new Event("portal:open-search"));
      }}
      className={`focus-ring items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.025] text-sm text-slate-500 transition hover:bg-white/[0.04] hover:text-slate-300 ${compact ? "inline-flex size-10 justify-center" : "hidden px-3.5 py-2 lg:inline-flex"}`}
      aria-label="Відкрити пошук"
      aria-haspopup="dialog"
    >
      <Search className="size-3.5" aria-hidden="true" />
      {!compact && <><span>Пошук</span>
      <kbd className="rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px]">Ctrl/⌘K</kbd></>}
    </button>
  );
}
