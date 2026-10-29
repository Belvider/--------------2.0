import { ArrowUpRight } from "lucide-react";
import type { LearningSource } from "@/lib/learning-guide";

export function LearningSourceLinks({ sources }: { sources: LearningSource[] }) {
  return <ul className="mt-3 space-y-3">
    {sources.map(source => <li key={source.id} className="min-w-0">
      <a href={source.url} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex max-w-full items-start gap-1.5 rounded text-sm text-teal-300 underline decoration-teal-300/30 underline-offset-4 [overflow-wrap:anywhere] hover:text-teal-100">
        <span>{source.title}</span><ArrowUpRight className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
      </a>
      <p className="mt-1 text-xs leading-5 text-slate-400">{source.scope}</p>
    </li>)}
  </ul>;
}
