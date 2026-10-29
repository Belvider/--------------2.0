import { getLearningGuideAnchor, type LearningGuide } from "@/lib/learning-guide";
import { LearningSourceLinks } from "@/components/module/LearningSourceLinks";

const targetProps = (anchor: string) => ({ id: anchor, "data-material-anchor": anchor, tabIndex: -1 });

export function LearningComparisons({ guide, moduleId }: { guide: LearningGuide; moduleId: number }) {
  if (!guide.comparisons?.length) return null;

  return <>{guide.comparisons.map(comparison => {
    const anchor = getLearningGuideAnchor(moduleId, "comparison", comparison.id);
    const sources = guide.sources.filter(source => comparison.sourceIds.includes(source.id));
    return <details key={comparison.id} {...targetProps(anchor)} className="min-w-0 rounded-xl border border-white/[0.08] px-3 sm:px-4">
      <summary className="focus-ring cursor-pointer py-2 text-sm font-semibold text-slate-200 marker:text-teal-400">
        Порівняння: {comparison.title}
      </summary>
      <div className="min-w-0 space-y-4 pb-4 pt-1">
        <p {...targetProps(`${anchor}-question`)} className="text-sm leading-6 text-slate-300">{comparison.question}</p>
        <div className="grid min-w-0 grid-cols-2 gap-3 border-b border-white/[0.08] pb-2">
          {[comparison.left, comparison.right].map((model, index) => <a key={`${model.anchor}-${index}`} href={`#${model.anchor}`}
            className="focus-ring flex min-h-9 min-w-0 items-center rounded text-xs font-semibold leading-5 text-teal-300 underline decoration-teal-300/30 underline-offset-4 [overflow-wrap:anywhere] hover:text-teal-100">
            {model.title}
          </a>)}
        </div>
        <dl className="min-w-0 space-y-3">
          {comparison.rows.map(row => <div key={row.id} {...targetProps(`${anchor}-row-${row.id}`)} className="min-w-0">
            <dt className="mb-1 text-xs font-medium leading-5 text-slate-400">{row.label}</dt>
            <dd className="grid min-w-0 grid-cols-2 gap-3 text-sm leading-6 text-slate-200">
              <div className="min-w-0 [overflow-wrap:anywhere]"><span className="sr-only">{comparison.left.title}: </span>{row.left}</div>
              <div className="min-w-0 border-l border-white/[0.08] pl-3 [overflow-wrap:anywhere]"><span className="sr-only">{comparison.right.title}: </span>{row.right}</div>
            </dd>
          </div>)}
        </dl>
        <div className="border-t border-white/[0.08] pt-3">
          <h3 className="text-xs font-semibold leading-5 text-slate-200">Як пояснити вибір</h3>
          <p {...targetProps(`${anchor}-takeaway`)} className="mt-1 text-sm leading-6 text-slate-300">{comparison.takeaway}</p>
        </div>
        {!!sources.length && <details className="border-t border-white/[0.06] pt-1">
          <summary className="focus-ring cursor-pointer py-2 text-xs text-slate-400 marker:text-slate-500">Джерела порівняння</summary>
          <LearningSourceLinks sources={sources} />
        </details>}
      </div>
    </details>;
  })}</>;
}
