"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Box, Loader2, X } from "lucide-react";
import type { LearningModelLink } from "@/lib/learning-guide";
import { getSketchfabEmbedUrl } from "@/lib/inline-model";

export function InlineModelViewer({ model, active, onActivate, onClose }: {
  model: LearningModelLink; active: boolean; onActivate: () => void; onClose: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const viewer = model.viewer;
  const src = getSketchfabEmbedUrl(viewer?.uid);
  useEffect(() => { setLoading(true); setFailed(false); }, [active, src]);
  if (!viewer || !src) return null;
  return <div data-inline-model={viewer.uid} className="min-w-0 overflow-hidden rounded-xl border border-white/10">
    <div className="flex items-start justify-between gap-3 border-b border-white/[0.07] px-3 py-3">
      <div className="min-w-0">
        <h4 className="text-sm font-semibold leading-6 text-slate-100">{model.title}</h4>
        <p className="mt-0.5 text-[11px] leading-5 text-slate-400">Незалежна 3D-візуалізація</p>
      </div>
      {active && <button type="button" onClick={onClose} aria-label={`Закрити 3D: ${model.title}`} className="focus-ring shrink-0 rounded-lg p-2 text-slate-400 hover:bg-white/[0.04] hover:text-white"><X className="size-4" aria-hidden="true" /></button>}
    </div>
    {active && !failed ? <div className="relative bg-[#121019]">
      {loading && <p role="status" className="absolute inset-x-0 top-3 z-10 mx-auto flex w-fit max-w-[90%] items-center gap-2 rounded-lg bg-black/75 px-3 py-2 text-xs text-slate-200"><Loader2 className="size-3.5 animate-spin" aria-hidden="true" />Завантажуємо 3D-перегляд…</p>}
      <iframe key={src} src={src} title={`3D-перегляд: ${model.title}`} className="h-[360px] w-full sm:h-[460px]" onLoad={() => setLoading(false)} onError={() => setFailed(true)}
        allow="autoplay; fullscreen; xr-spatial-tracking" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
    </div> : <button type="button" onClick={() => { setFailed(false); setLoading(true); onActivate(); }} className="focus-ring flex min-h-40 w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_center,rgba(40,178,158,0.10),transparent_75%)] px-4 py-6 text-center text-sm font-semibold text-teal-100 hover:bg-white/[0.025]">
      <Box className="size-7 text-teal-300" aria-hidden="true" />{failed ? "Спробувати завантажити 3D ще раз" : "Переглянути 3D на сайті"}
    </button>}
    <div className="space-y-2 px-3 py-3">
      {active && <p className="text-xs leading-5 text-slate-400">Потягніть модель, щоб обертати. Коліщатко миші або жест двома пальцями змінює масштаб. У плеєрі є повноекранний режим.</p>}
      {failed && <p role="alert" className="text-xs leading-5 text-slate-300">Перегляд не завантажився. Спробуйте ще раз або відкрийте модель за посиланням нижче.</p>}
      <p className="text-xs leading-5 text-slate-300">{model.variant}</p>
      <p className="text-xs leading-5 text-slate-400">{model.note}</p>
      <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1 text-[11px] leading-5 text-slate-400">
        <a href={viewer.authorUrl} target="_blank" rel="noopener noreferrer" className="focus-ring rounded underline decoration-white/20 underline-offset-4 hover:text-slate-200">Автор: {viewer.author}</a>
        <a href={viewer.licenseUrl} target="_blank" rel="noopener noreferrer" className="focus-ring rounded underline decoration-white/20 underline-offset-4 hover:text-slate-200">{viewer.license}</a>
        <a href={viewer.sourceUrl} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex items-center gap-1 rounded underline decoration-white/20 underline-offset-4 hover:text-slate-200">Модель у Sketchfab<ArrowUpRight className="size-3" aria-hidden="true" /></a>
      </div>
    </div>
  </div>;
}
