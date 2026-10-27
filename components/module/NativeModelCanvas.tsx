"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize, Minimize, RotateCcw, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import type { NativeModelController } from "@/lib/native-model-viewer";

export function NativeModelCanvas({ assetId, onReady, onError }: { assetId: string; onReady: () => void; onError: () => void }) {
  const host = useRef<HTMLDivElement>(null), frame = useRef<HTMLDivElement>(null), controller = useRef<NativeModelController | null>(null);
  const callbacks = useRef({ onReady, onError }); callbacks.current = { onReady, onError };
  const [ready, setReady] = useState(false), [fullscreenError, setFullscreenError] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  useEffect(() => {
    const update = () => setFullscreen(document.fullscreenElement === frame.current);
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);
  useEffect(() => {
    let cancelled = false;
    setReady(false);
    void import("@/lib/native-model-viewer").then(({ mountNativeModel }) => {
      if (cancelled || !host.current) return;
      controller.current = mountNativeModel(host.current, assetId, () => {
        if (cancelled) return;
        setReady(true); callbacks.current.onReady();
      }, () => { if (!cancelled) callbacks.current.onError(); });
    }).catch(() => { if (!cancelled) callbacks.current.onError(); });
    return () => { cancelled = true; controller.current?.dispose(); controller.current = null; };
  }, [assetId]);
  const buttonClass = "focus-ring inline-flex size-10 items-center justify-center rounded-lg border border-white/10 text-slate-300 hover:bg-white/[0.06] disabled:opacity-40";
  return <div ref={frame} className="bg-[#191724]" data-native-model={assetId} data-native-state={ready ? "ready" : "loading"}>
    <div ref={host} data-native-stage className="h-[360px] min-w-0 w-full sm:h-[460px]" />
    <div className="flex flex-wrap items-center justify-center gap-2 border-t border-white/[0.07] px-3 py-2">
      <button type="button" className={buttonClass} disabled={!ready} onClick={() => controller.current?.rotate(-1)} aria-label="Повернути модель ліворуч" title="Повернути ліворуч"><RotateCcw className="size-4" aria-hidden="true" /></button>
      <button type="button" className={buttonClass} disabled={!ready} onClick={() => controller.current?.rotate(1)} aria-label="Повернути модель праворуч" title="Повернути праворуч"><RotateCw className="size-4" aria-hidden="true" /></button>
      <button type="button" className={buttonClass} disabled={!ready} onClick={() => controller.current?.zoom(0.8)} aria-label="Наблизити модель" title="Наблизити"><ZoomIn className="size-4" aria-hidden="true" /></button>
      <button type="button" className={buttonClass} disabled={!ready} onClick={() => controller.current?.zoom(1.25)} aria-label="Віддалити модель" title="Віддалити"><ZoomOut className="size-4" aria-hidden="true" /></button>
      <button type="button" className="focus-ring h-10 rounded-lg border border-white/10 px-3 text-xs text-slate-300 hover:bg-white/[0.06] disabled:opacity-40" disabled={!ready} onClick={() => controller.current?.reset()}>Скинути</button>
      <button type="button" className={buttonClass} disabled={!ready} aria-label={fullscreen ? "Вийти з повного екрана" : "Відкрити 3D на весь екран"} title={fullscreen ? "Вийти з повного екрана" : "На весь екран"} onClick={async () => {
        setFullscreenError(false);
        try {
          if (document.fullscreenElement === frame.current) await document.exitFullscreen();
          else if (frame.current?.requestFullscreen) await frame.current.requestFullscreen();
          else setFullscreenError(true);
        } catch { setFullscreenError(true); }
      }}>{fullscreen ? <Minimize className="size-4" aria-hidden="true" /> : <Maximize className="size-4" aria-hidden="true" />}</button>
    </div>
    {fullscreenError && <p role="status" className="px-3 pb-2 text-xs text-slate-300">Повноекранний режим недоступний у цьому браузері. Моделлю можна керувати тут.</p>}
  </div>;
}
