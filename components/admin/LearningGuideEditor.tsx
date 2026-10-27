"use client";

import { useState } from "react";
import type { LearningGuide, LearningSource } from "@/lib/learning-guide";
import type { ModuleContentBlock } from "@/lib/module-content";
import { getModuleBlockAnchor, getProductAnchor } from "@/lib/content-anchors";
import { LOCAL_LEARNING_MODEL_ASSETS, getLearningModelAsset, getLocalLearningModelViewer, type LearningModelAssetId } from "@/lib/learning-model-assets";

type Props = {
  value?: LearningGuide;
  moduleId: number;
  blocks: ModuleContentBlock[];
  onChange: (value: LearningGuide | undefined) => void;
};

const inputClass = "mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-100";
const buttonClass = "focus-ring rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/[0.05] disabled:opacity-40";
const removeClass = "focus-ring rounded-lg px-2 py-1 text-xs text-rose-200 hover:bg-rose-400/10";
const newId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
const lines = (value: string) => value.split("\n");

function Field({ label, value, onChange, multiline = false, maxLength = 500, type = "text", hint }: {
  label: string; value: string; onChange: (value: string) => void; multiline?: boolean; maxLength?: number; type?: string; hint?: string;
}) {
  return <label className="block min-w-0 text-xs font-medium text-slate-300">
    {label}
    {multiline ? <textarea value={value} rows={3} maxLength={maxLength} onChange={event => onChange(event.target.value)} className={inputClass} />
      : <input type={type} value={value} maxLength={maxLength} onChange={event => onChange(event.target.value)} className={inputClass} />}
    {hint && <span className="mt-1 block text-[11px] font-normal leading-5 text-slate-500">{hint}</span>}
  </label>;
}

export function LearningGuideEditor({ value, moduleId, blocks, onChange }: Props) {
  const [expanded, setExpanded] = useState(false);
  const anchors = blocks.flatMap((block, index) => {
    const anchor = getModuleBlockAnchor(moduleId, index);
    return [{ anchor, title: `${index + 1}. ${block.title}` }, ...(block.type === "productCatalog" ? block.products.map((product, productIndex) => ({
      anchor: getProductAnchor(anchor, productIndex), title: `${block.title}: ${product.title}`
    })) : [])];
  });
  const patch = (changes: Partial<LearningGuide>) => { if (value) onChange({ ...value, ...changes }); };
  function create() {
    onChange({ version: 1, reviewedAt: new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Kyiv", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()),
      objectives: [""], prerequisites: "", route: [], reference: [], sources: [], practice: [] });
    setExpanded(true);
  }
  function anchorSelect(selected: string, onSelect: (anchor: string) => void) {
    return <label className="block text-xs font-medium text-slate-300">Розділ або модель
      <select value={selected} onChange={event => onSelect(event.target.value)} className={inputClass}>
        <option value="">Оберіть точку переходу</option>
        {selected && !anchors.some(item => item.anchor === selected) && <option value={selected}>Збережений фрагмент: {selected}</option>}
        {anchors.map(item => <option key={item.anchor} value={item.anchor}>{item.title}</option>)}
      </select>
    </label>;
  }
  function anchorChoices(selected: string[], onSelect: (anchors: string[]) => void) {
    const options = [...anchors, ...selected.filter(anchor => !anchors.some(item => item.anchor === anchor)).map(anchor => ({ anchor, title: `Збережений фрагмент: ${anchor}` }))];
    return <fieldset className="min-w-0"><legend className="text-xs font-medium text-slate-300">Розділи та моделі, яких стосується джерело</legend>
      <div className="mt-2 max-h-40 space-y-1 overflow-y-auto rounded-xl border border-white/10 p-2">
        {options.map(item => <label key={item.anchor} className="flex items-start gap-2 py-1 text-xs leading-5 text-slate-400">
          <input type="checkbox" checked={selected.includes(item.anchor)} onChange={event => onSelect(event.target.checked ? [...selected, item.anchor] : selected.filter(anchor => anchor !== item.anchor))} className="mt-1" />
          <span>{item.title}</span>
        </label>)}
      </div>
    </fieldset>;
  }
  function routeEditor(title: string, key: "route" | "reference") {
    if (!value) return null;
    return <section className="space-y-3 border-t border-white/10 pt-4">
      <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
      {value[key].map((item, index) => <div key={index} className="rounded-xl border border-white/[0.07] p-3">
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Назва переходу" value={item.title} maxLength={140} onChange={title => patch({ [key]: value[key].map((row, i) => i === index ? { ...row, title } : row) })} />
          {anchorSelect(item.anchor, anchor => patch({ [key]: value[key].map((row, i) => i === index ? { ...row, anchor } : row) }))}
        </div>
        <button type="button" className={`${removeClass} mt-2`} onClick={() => patch({ [key]: value[key].filter((_, i) => i !== index) })}>Прибрати перехід</button>
      </div>)}
      <button type="button" className={buttonClass} disabled={value[key].length >= 16 || !anchors.length} onClick={() => patch({ [key]: [...value[key], { title: "", anchor: anchors[0]?.anchor ?? "" }] })}>Додати перехід</button>
    </section>;
  }
  function sourcePatch(index: number, changes: Partial<LearningSource>) {
    if (value) patch({ sources: value.sources.map((source, i) => i === index ? { ...source, ...changes } : source) });
  }

  return <section className="card p-4 sm:p-5">
    <details open={expanded} onToggle={event => setExpanded(event.currentTarget.open)}>
      <summary className="focus-ring cursor-pointer rounded-lg text-sm font-semibold text-slate-200">Навчальний маршрут, джерела та практика
        <span className="ml-2 font-normal text-slate-500">{value ? `${value.sources.length} джерел · ${value.practice.length} сценаріїв` : "Не додано"}</span>
      </summary>
      <p className="mt-3 text-xs leading-6 text-slate-400">Ці відомості доповнюють матеріал і не додають окремих обов’язкових блоків до навчального прогресу.</p>
      {!value ? <button type="button" disabled={!blocks.length} onClick={create} className={`${buttonClass} mt-3`}>Додати навчальний супровід</button> : <div className="mt-4 space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Дата перевірки джерел" type="date" value={value.reviewedAt} maxLength={10} onChange={reviewedAt => patch({ reviewedAt })} />
          <Field label="Попередні знання" value={value.prerequisites} onChange={prerequisites => patch({ prerequisites })} />
        </div>
        <Field label="Що працівник зможе зробити" value={value.objectives.join("\n")} multiline maxLength={902} hint="Від одного до трьох результатів, кожен із нового рядка; до 300 символів у рядку." onChange={text => patch({ objectives: lines(text) })} />
        {routeEditor("Маршрут для першого вивчення", "route")}
        {routeEditor("Швидкий довідник", "reference")}
        <section className="space-y-3 border-t border-white/10 pt-4">
          <h3 className="text-sm font-semibold text-slate-200">Офіційні джерела</h3>
          {value.sources.map((source, index) => <details key={source.id} className="rounded-xl border border-white/[0.07] p-3">
            <summary className="cursor-pointer text-sm text-slate-300">{source.title || `Нове джерело ${index + 1}`}</summary>
            <div className="mt-3 space-y-3">
              <Field label="Назва джерела" value={source.title} maxLength={160} onChange={title => sourcePatch(index, { title })} />
              <Field label="Офіційне посилання" type="url" value={source.url} maxLength={1600} onChange={url => sourcePatch(index, { url })} hint="Повна адреса https:// без облікових даних." />
              <Field label="Що підтверджує: модель, регіон, умови" value={source.scope} multiline maxLength={600} onChange={scope => sourcePatch(index, { scope })} />
              {anchorChoices(source.anchors, anchors => sourcePatch(index, { anchors }))}
              <button type="button" className={removeClass} onClick={() => patch({ sources: value.sources.filter((_, i) => i !== index), practice: value.practice.map(item => ({ ...item, sourceIds: item.sourceIds.filter(id => id !== source.id) })) })}>Прибрати джерело</button>
            </div>
          </details>)}
          <button type="button" className={buttonClass} disabled={value.sources.length >= 60} onClick={() => patch({ sources: [...value.sources, { id: newId("source"), title: "", url: "", scope: "", anchors: [] }] })}>Додати джерело</button>
        </section>
        <section className="space-y-3 border-t border-white/10 pt-4">
          <h3 className="text-sm font-semibold text-slate-200">Навчальне відео</h3>
          {!value.video ? <button type="button" className={buttonClass} onClick={() => patch({ video: { title: "", url: "", author: "", summary: [""] } })}>Додати відео</button> : <>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Назва відео" value={value.video.title} maxLength={180} onChange={title => patch({ video: { ...value.video!, title } })} />
              <Field label="Автор або канал" value={value.video.author} maxLength={100} onChange={author => patch({ video: { ...value.video!, author } })} />
            </div>
            <Field label="Посилання на відео" value={value.video.url} type="url" maxLength={1600} onChange={url => patch({ video: { ...value.video!, url } })} hint="YouTube, Vimeo або прямий HTTPS-файл MP4, WebM чи OGG." />
            <Field label="Український конспект" value={value.video.summary.join("\n")} multiline maxLength={2504} hint="До п’яти тез, кожна з нового рядка; до 500 символів у рядку." onChange={text => patch({ video: { ...value.video!, summary: lines(text) } })} />
            <Field label="Завдання після перегляду (необов’язково)" value={value.video.exercise ?? ""} multiline maxLength={600} onChange={exercise => patch({ video: { ...value.video!, exercise: exercise || undefined } })} />
            <button type="button" className={removeClass} onClick={() => patch({ video: undefined })}>Прибрати відео</button>
          </>}
        </section>
        <section className="space-y-3 border-t border-white/10 pt-4">
          <h3 className="text-sm font-semibold text-slate-200">Практичні сценарії</h3>
          {value.practice.map((item, index) => {
            const update = (changes: Partial<typeof item>) => patch({ practice: value.practice.map((row, i) => i === index ? { ...row, ...changes } : row) });
            return <details key={item.id} className="rounded-xl border border-white/[0.07] p-3">
              <summary className="cursor-pointer text-sm text-slate-300">{item.title || `Новий сценарій ${index + 1}`}</summary>
              <div className="mt-3 space-y-3">
                <Field label="Назва" value={item.title} maxLength={140} onChange={title => update({ title })} />
                <Field label="Ситуація клієнта" value={item.situation} multiline maxLength={900} onChange={situation => update({ situation })} />
                <Field label="Завдання працівнику" value={item.prompt} multiline onChange={prompt => update({ prompt })} />
                <Field label="Пояснення відповіді" value={item.explanation} multiline maxLength={1400} onChange={explanation => update({ explanation })} />
                <fieldset><legend className="text-xs font-medium text-slate-300">Джерела сценарію</legend>
                  <div className="mt-2 max-h-36 space-y-1 overflow-y-auto">{value.sources.map(source => <label key={source.id} className="flex items-start gap-2 py-1 text-xs text-slate-400">
                    <input type="checkbox" checked={item.sourceIds.includes(source.id)} onChange={event => update({ sourceIds: event.target.checked ? [...item.sourceIds, source.id] : item.sourceIds.filter(id => id !== source.id) })} />
                    <span>{source.title || "Джерело без назви"}</span>
                  </label>)}</div>
                </fieldset>
                <button type="button" className={removeClass} onClick={() => patch({ practice: value.practice.filter((_, i) => i !== index) })}>Прибрати сценарій</button>
              </div>
            </details>;
          })}
          <button type="button" className={buttonClass} disabled={value.practice.length >= 4} onClick={() => patch({ practice: [...value.practice, { id: newId("practice"), title: "", situation: "", prompt: "", explanation: "", sourceIds: [] }] })}>Додати сценарій</button>
        </section>
        <section className="space-y-3 border-t border-white/10 pt-4">
          <h3 className="text-sm font-semibold text-slate-200">3D-перегляди та авторські моделі</h3>
          {(value.models3d ?? []).map((item, index) => {
            const update = (changes: Partial<typeof item>) => patch({ models3d: value.models3d!.map((row, i) => i === index ? { ...row, ...changes } : row) });
            const sketchfabViewer = item.viewer?.provider === "sketchfab" ? item.viewer : null;
            const selectLocalModel = (assetId: unknown) => {
              const asset = getLearningModelAsset(assetId);
              if (asset) update({ title: asset.title, ...asset.presentation, viewer: getLocalLearningModelViewer(assetId as LearningModelAssetId) });
            };
            return <details key={index} className="rounded-xl border border-white/[0.07] p-3">
              <summary className="cursor-pointer text-sm text-slate-300">{item.title || `Новий перегляд ${index + 1}`}</summary>
              <div className="mt-3 space-y-3">
                <Field label="Назва" value={item.title} maxLength={140} onChange={title => update({ title })} />
                <Field label="Офіційна сторінка пристрою" value={item.url} type="url" maxLength={1600} onChange={url => update({ url })} />
                <Field label="Точна модель та регіон" value={item.variant} maxLength={240} onChange={variant => update({ variant })} />
                <Field label="Умови перегляду й обмеження" value={item.note} multiline maxLength={600} onChange={note => update({ note })} />
                {!item.viewer ? <div className="flex flex-wrap gap-2">
                  <button type="button" className={buttonClass} onClick={() => update({ viewer: {
                    provider: "sketchfab", uid: "", author: "", authorUrl: "", sourceUrl: "", license: "", licenseUrl: ""
                  } })}>Додати 3D-перегляд на сайті</button>
                  <button type="button" className={buttonClass} onClick={() => selectLocalModel("iphone-15-pro-max")}>Вибрати локальну 3D-модель</button>
                </div> : item.viewer.provider === "local" ? <fieldset className="space-y-3 rounded-xl border border-white/10 p-3">
                  <legend className="px-1 text-xs font-semibold text-slate-200">Локальна 3D-модель</legend>
                  <label className="block text-xs font-medium text-slate-300">Модель із перевіреної бібліотеки
                    <select value={item.viewer.assetId} onChange={event => selectLocalModel(event.target.value)} className={inputClass}>
                      {Object.entries(LOCAL_LEARNING_MODEL_ASSETS).map(([assetId, asset]) => <option key={assetId} value={assetId}>{asset.title}</option>)}
                    </select>
                  </label>
                  <p className="text-xs leading-5 text-slate-400">Файл завантажується з нашого сайту. Походження й ліцензія закріплені за моделлю та зберігаються автоматично.</p>
                  <p className="text-xs leading-5 text-slate-300">Автор: <a href={item.viewer.authorUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{item.viewer.author}</a></p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs leading-5 text-slate-400">
                    <a href={item.viewer.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Джерело моделі</a>
                    <a href={item.viewer.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{item.viewer.license}</a>
                  </div>
                  <button type="button" className={removeClass} onClick={() => update({ viewer: undefined })}>Прибрати вбудований перегляд</button>
                </fieldset> : <fieldset className="space-y-3 rounded-xl border border-white/10 p-3">
                  <legend className="px-1 text-xs font-semibold text-slate-200">Перегляд на сайті через Sketchfab</legend>
                  <p className="text-xs leading-5 text-slate-400">Збережіть автора та умови використання. Авторська візуалізація не замінює офіційну специфікацію пристрою.</p>
                  <Field label="Посилання на модель Sketchfab" value={sketchfabViewer!.sourceUrl} type="url" maxLength={1600} hint="Сторінка конкретної моделі. Її ідентифікатор визначається з адреси автоматично." onChange={sourceUrl => {
                    const uid = sourceUrl.trim().match(/\/([a-zA-Z0-9_-]*?)([a-f0-9]{32})\/?$/)?.[2] ?? "";
                    update({ viewer: { ...sketchfabViewer!, sourceUrl, uid } });
                  }} />
                  <Field label="Ім’я автора 3D-моделі" value={sketchfabViewer!.author} maxLength={100} onChange={author => update({ viewer: { ...sketchfabViewer!, author } })} />
                  <Field label="Профіль автора на Sketchfab" value={sketchfabViewer!.authorUrl} type="url" maxLength={1600} onChange={authorUrl => update({ viewer: { ...sketchfabViewer!, authorUrl } })} />
                  <Field label="Ліцензія 3D-моделі" value={sketchfabViewer!.license} maxLength={140} onChange={license => update({ viewer: { ...sketchfabViewer!, license } })} />
                  <Field label="Посилання на умови ліцензії" value={sketchfabViewer!.licenseUrl} type="url" maxLength={1600} onChange={licenseUrl => update({ viewer: { ...sketchfabViewer!, licenseUrl } })} />
                  <button type="button" className={removeClass} onClick={() => update({ viewer: undefined })}>Прибрати вбудований перегляд</button>
                </fieldset>}
                <button type="button" className={removeClass} onClick={() => patch({ models3d: value.models3d!.filter((_, i) => i !== index) })}>Прибрати 3D-посилання</button>
              </div>
            </details>;
          })}
          <button type="button" className={buttonClass} disabled={(value.models3d?.length ?? 0) >= 4} onClick={() => patch({ models3d: [...(value.models3d ?? []), { title: "", url: "", variant: "", note: "" }] })}>Додати 3D-посилання</button>
        </section>
        <button type="button" className={removeClass} onClick={() => onChange(undefined)}>Прибрати навчальний супровід</button>
      </div>}
    </details>
  </section>;
}
