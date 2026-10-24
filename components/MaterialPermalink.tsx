"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Link2 } from "lucide-react";

export function MaterialPermalink({ anchor, title, compact = false, className = "" }: {
  anchor: string; title: string; compact?: boolean; className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const label = `Скопіювати посилання: ${title}`;
  return <a href={`#${encodeURIComponent(anchor)}`} aria-label={label} title={copied ? "Посилання скопійовано" : label}
    data-material-permalink={anchor}
    className={`focus-ring inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg align-middle text-slate-400 transition hover:bg-teal-400/10 hover:text-teal-200 ${compact ? "size-8 border border-white/[0.08] bg-white/[0.025]" : "min-h-8 px-1.5 text-[11px]"} ${className}`}
    onClick={(event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0 || !navigator.clipboard?.writeText) return;
      event.preventDefault();
      const url = new URL(window.location.href);
      url.hash = anchor;
      navigator.clipboard.writeText(url.href).then(() => {
        setCopied(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 2400);
      }).catch(() => { window.location.hash = anchor; });
    }}>
    {copied ? <Check className="size-3.5 text-teal-300" aria-hidden="true" /> : <Link2 className="size-3.5" aria-hidden="true" />}
    {!compact && <span>{copied ? "Посилання скопійовано" : "Посилання на матеріал"}</span>}
    <span className="sr-only" role="status">{copied ? "Посилання скопійовано" : ""}</span>
  </a>;
}
