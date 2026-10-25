"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, BookOpenCheck, Play, Search } from "lucide-react";
import { getLearningGuideAnchor, type LearningGuide, type LearningSource } from "@/lib/learning-guide";
import { getVideoSource } from "@/lib/video-source";

const reviewedDate = (value: string) => value.split("-").reverse().join(".");
const targetProps = (anchor: string) => ({ id: anchor, "data-material-anchor": anchor, tabIndex: -1 });
const summaryClass = "focus-ring cursor-pointer py-2 text-sm font-semibold text-slate-200 marker:text-teal-400";

function SourceLinks({ sources }: { sources: LearningSource[] }) {
  return <ul className="mt-3 space-y-3">
    {sources.map(source => <li key={source.id} className="min-w-0">
      <a href={source.url} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex max-w-full items-start gap-1.5 rounded text-sm text-teal-300 underline decoration-teal-300/30 underline-offset-4 [overflow-wrap:anywhere] hover:text-teal-100">
        <span>{source.title}</span><ArrowUpRight className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
      </a>
      <p className="mt-1 text-xs leading-5 text-slate-400">{source.scope}</p>
    </li>)}
  </ul>;
}

export function LearningSourceReferences({ guide, anchor }: { guide?: LearningGuide | null; anchor: string }) {
  const sources = guide?.sources.filter(source => source.anchors.includes(anchor)) ?? [];
  if (!guide || !sources.length) return null;
  return <details className="mt-4 border-t border-white/[0.06] pt-1">
    <summary className="focus-ring cursor-pointer py-2 text-xs text-slate-400 marker:text-slate-500">
      Офіційні джерела <span className="ml-1 text-slate-500">· {reviewedDate(guide.reviewedAt)}</span>
    </summary>
    <SourceLinks sources={sources} />
  </details>;
}

export function LearningGuideOverview({ guide, moduleId }: { guide: LearningGuide; moduleId: number }) {
  const [mode, setMode] = useState<"study" | "reference">("study");
  const routeRef = useRef<HTMLDetailsElement>(null);
  const links = mode === "study" ? guide.route : guide.reference;
  return <section {...targetProps(getLearningGuideAnchor(moduleId, "overview"))} className="mb-6 min-w-0 border-b border-white/[0.08] pb-5" aria-label="Маршрут вивчення теми">
    <div className="flex flex-wrap gap-2" role="group" aria-label="Спосіб роботи з матеріалом">
      <button type="button" aria-pressed={mode === "study"} onClick={() => { setMode("study"); if (routeRef.current) routeRef.current.open = true; }}
        className={`focus-ring inline-flex min-h-9 items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${mode === "study" ? "border-teal-400/25 bg-teal-400/10 text-teal-100" : "border-white/10 text-slate-400"}`}>
        <BookOpenCheck className="size-3.5" aria-hidden="true" />Вивчаю вперше
      </button>
      <button type="button" aria-pressed={mode === "reference"} onClick={() => { setMode("reference"); if (routeRef.current) routeRef.current.open = true; }}
        className={`focus-ring inline-flex min-h-9 items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${mode === "reference" ? "border-teal-400/25 bg-teal-400/10 text-teal-100" : "border-white/10 text-slate-400"}`}>
        <Search className="size-3.5" aria-hidden="true" />Швидкий довідник
      </button>
    </div>
    <details ref={routeRef} className="mt-2">
      <summary className="focus-ring cursor-pointer py-2 text-xs text-slate-400 marker:text-slate-500">{mode === "study" ? `Маршрут: ${links.length} кроків` : `Довідник: ${links.length} тем`}</summary>
    <nav className="mt-1" aria-label={mode === "study" ? "Послідовність вивчення" : "Довідкові теми"}>
      <ol className="grid gap-1 sm:grid-cols-2">
        {links.map((item, index) => <li key={item.anchor} className="min-w-0">
          <a href={`#${item.anchor}`} className="focus-ring flex min-h-9 items-start gap-2 rounded-lg px-2 py-2 text-xs leading-5 text-slate-300 transition hover:bg-white/[0.035] hover:text-white">
            <span className="shrink-0 tabular-nums text-teal-400" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <span className="min-w-0 [overflow-wrap:anywhere]">{item.title}</span>
          </a>
        </li>)}
      </ol>
    </nav>
    </details>
    <details className="mt-2">
      <summary className="focus-ring cursor-pointer py-2 text-xs font-medium text-slate-400 marker:text-slate-500">Що ви зможете після вивчення</summary>
      <p {...targetProps(`${getLearningGuideAnchor(moduleId, "overview")}-prerequisites`)} className="mt-2 text-xs leading-5 text-slate-400">{guide.prerequisites}</p>
      <ul className="mt-1 list-disc space-y-1.5 pl-5 text-sm leading-6 text-slate-300">{guide.objectives.map((item, index) => <li key={item} {...targetProps(`${getLearningGuideAnchor(moduleId, "overview")}-objective-${index + 1}`)}>{item}</li>)}</ul>
    </details>
    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-teal-300">
      {guide.video && <a className="focus-ring rounded underline decoration-teal-300/30 underline-offset-4" href={`#${getLearningGuideAnchor(moduleId, "video")}`}>Відео та конспект</a>}
      {guide.practice.length > 0 && <a className="focus-ring rounded underline decoration-teal-300/30 underline-offset-4" href={`#${getLearningGuideAnchor(moduleId, "practice", guide.practice[0].id)}`}>Практика консультації</a>}
      {!!guide.models3d?.length && <a className="focus-ring rounded underline decoration-teal-300/30 underline-offset-4" href={`#${getLearningGuideAnchor(moduleId, "models")}`}>Огляд корпусу у 3D</a>}
    </div>
  </section>;
}

export function LearningGuideResources({ guide, moduleId }: { guide: LearningGuide; moduleId: number }) {
  const [videoStarted, setVideoStarted] = useState(false);
  const video = guide.video ? getVideoSource(guide.video.url) : null;
  return <section className="mt-8 min-w-0 space-y-3 border-t border-white/[0.08] pt-5" aria-label="Демонстрації, практика та джерела">
    {guide.video && <details {...targetProps(getLearningGuideAnchor(moduleId, "video"))} className="min-w-0 rounded-xl border border-white/[0.08] px-3 sm:px-4">
      <summary className={summaryClass}>Відео: {guide.video.title}</summary>
      <div className="min-w-0 space-y-4 pb-4 pt-1">
        <p className="text-xs text-slate-400">Автор: {guide.video.author}</p>
        {video && (videoStarted ? <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
          {video.kind === "iframe" ? <iframe src={video.url} title={guide.video.title} loading="lazy" className="aspect-video w-full" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
            : <video src={video.url} controls preload="metadata" className="aspect-video w-full" aria-label={guide.video.title}>Ваш браузер не підтримує відтворення відео.</video>}
        </div> : <button type="button" onClick={() => setVideoStarted(true)} className="focus-ring flex min-h-24 w-full items-center justify-center gap-2 rounded-xl border border-teal-400/20 bg-teal-400/[0.06] px-4 py-5 text-sm font-semibold text-teal-100">
          <Play className="size-4" aria-hidden="true" />Завантажити відео
        </button>)}
        <a href={guide.video.url} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex items-center gap-1.5 rounded text-sm text-teal-300 underline decoration-teal-300/30 underline-offset-4">Відкрити оригінал відео<ArrowUpRight className="size-3.5" aria-hidden="true" /></a>
        <div>
          <h3 className="text-sm font-semibold text-white">Короткий конспект</h3>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">{guide.video.summary.map((item, index) => {
            const anchor = `${getLearningGuideAnchor(moduleId, "video")}-note-${index + 1}`;
            return <li key={item} {...targetProps(anchor)}>{item}</li>;
          })}</ul>
        </div>
        {guide.video.exercise && <p {...targetProps(`${getLearningGuideAnchor(moduleId, "video")}-exercise`)} className="text-sm leading-6 text-slate-400"><strong className="font-semibold text-slate-200">Спробуйте пояснити клієнту: </strong>{guide.video.exercise}</p>}
      </div>
    </details>}
    {guide.practice.map(item => <details key={item.id} {...targetProps(getLearningGuideAnchor(moduleId, "practice", item.id))} className="min-w-0 rounded-xl border border-white/[0.08] px-3 sm:px-4">
      <summary className={summaryClass}>Практика: {item.title}</summary>
      <div className="space-y-3 pb-4 pt-1 text-sm leading-6">
        <p className="text-slate-300">{item.situation}</p>
        <p className="font-medium text-slate-200">{item.prompt}</p>
        <details className="border-t border-white/[0.06] pt-1">
          <summary className="focus-ring cursor-pointer py-2 text-xs font-semibold text-teal-300">Переглянути розбір</summary>
          <p {...targetProps(`${getLearningGuideAnchor(moduleId, "practice", item.id)}-explanation`)} className="mt-1 text-slate-300">{item.explanation}</p>
          {!!item.sourceIds.length && <SourceLinks sources={guide.sources.filter(source => item.sourceIds.includes(source.id))} />}
        </details>
      </div>
    </details>)}
    {!!guide.models3d?.length && <details {...targetProps(getLearningGuideAnchor(moduleId, "models"))} className="min-w-0 rounded-xl border border-white/[0.08] px-3 sm:px-4">
      <summary className={summaryClass}>Огляд корпусу у 3D у виробника</summary>
      <ul className="space-y-4 pb-4 pt-2">{guide.models3d.map(item => <li key={item.url} className="min-w-0">
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex max-w-full items-start gap-1.5 rounded text-sm font-medium text-teal-300 underline decoration-teal-300/30 underline-offset-4 [overflow-wrap:anywhere]">{item.title}<ArrowUpRight className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" /></a>
        <p className="mt-1 text-xs leading-5 text-slate-300">{item.variant}</p><p className="mt-1 text-xs leading-5 text-slate-400">{item.note}</p>
      </li>)}</ul>
    </details>}
    <details {...targetProps(getLearningGuideAnchor(moduleId, "sources"))} className="min-w-0 rounded-xl border border-white/[0.08] px-3 pb-1 sm:px-4">
      <summary className={summaryClass}>Усі джерела теми · {reviewedDate(guide.reviewedAt)}</summary>
      <div className="pb-4"><SourceLinks sources={guide.sources} /></div>
    </details>
  </section>;
}
