"use client";

import { getRequestError, requestJson } from "@/lib/http-client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Role } from "@prisma/client";
import { formatDate } from "@/lib/ui";

type AuditRow = {
  id: number;
  action: string;
  targetType: string;
  targetId: string | null;
  targetLabel: string | null;
  summary: string;
  ipAddress: string | null;
  createdAt: string | Date;
  actor: { id: string; name: string; email: string; role: Role } | null;
};

type AuditSummary = {
  total: number;
  last24h: number;
  last7d: number;
  userActions: number;
  contentActions: number;
  mediaActions: number;
};

type AdminAuditTabProps = {
  onNotice: (msg: string) => void;
};

function auditTone(action: string) {
  if (action.includes("delete")) return "border-rose-500/20 bg-rose-500/12 text-rose-100";
  if (action.includes("create") || action.includes("upload")) return "border-emerald-500/20 bg-emerald-500/12 text-emerald-100";
  if (action.includes("export")) return "border-sky-500/20 bg-sky-500/12 text-sky-100";
  return "border-white/10 bg-white/[0.03] text-slate-300";
}

function roleTone(role: Role) {
  if (role === "ADMIN") return "border-amber-500/20 bg-amber-500/12 text-amber-100";
  if (role === "MANAGER") return "border-sky-500/20 bg-sky-500/12 text-sky-100";
  return "border-white/10 bg-white/[0.03] text-slate-300";
}

export function AdminAuditTab({ onNotice }: AdminAuditTabProps) {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [summary, setSummary] = useState<AuditSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [action, setAction] = useState("");
  const [targetType, setTargetType] = useState("");

  const requestIdRef = useRef(0);

  const loadAudit = useCallback(async (signal?: AbortSignal) => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("query", query);
      if (action) params.set("action", action);
      if (targetType) params.set("targetType", targetType);
      params.set("limit", "80");
      const data = await requestJson<{ rows?: AuditRow[]; summary?: AuditSummary }>("/api/admin/audit?" + params.toString(), { signal });
      if (signal?.aborted || requestId !== requestIdRef.current) return;
      setRows(data.rows ?? []);
      setSummary(data.summary ?? null);
    } catch (requestError) {
      if (!signal?.aborted && requestId === requestIdRef.current) onNotice(getRequestError(requestError));
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [query, action, targetType, onNotice]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => { void loadAudit(controller.signal); }, 180);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [loadAudit]);

  const ACTION_OPTIONS = [
    "user.create", "user.update", "user.password-set", "user.reset-link", "user.delete",
    "user.bulk-update", "user.bulk-delete", "brand.create", "brand.update", "brand.delete",
    "category.create", "category.update", "category.delete", "module.create", "module.update",
    "module.delete", "module.bulk-update", "module.bulk-delete", "portal-page.update",
    "media.upload", "media.delete", "report.export"
  ];

  return (
    <div className="mt-6 space-y-5">
      {/* KPI */}
      <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {[
          { label: "Всього подій", value: summary?.total ?? 0 },
          { label: "24 години", value: summary?.last24h ?? 0 },
          { label: "7 днів", value: summary?.last7d ?? 0 },
          { label: "Люди", value: summary?.userActions ?? 0 },
          { label: "Контент", value: summary?.contentActions ?? 0 },
          { label: "Медіа", value: summary?.mediaActions ?? 0 }
        ].map((s) => (
          <div key={s.label} className="rounded-[14px] border border-white/10 bg-white/[0.025] p-4">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500">{s.label}</p>
            <p className="mt-2 font-[var(--font-heading)] text-2xl font-semibold text-ink">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Фільтри */}
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_200px_200px_auto]">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Пошук по опису, email або цілі" className="focus-ring rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500" />
        <select value={action} onChange={(e) => setAction(e.target.value)} className="focus-ring rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white">
          <option value="">Усі дії</option>
          {ACTION_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <select value={targetType} onChange={(e) => setTargetType(e.target.value)} className="focus-ring rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white">
          <option value="">Всі сутності</option>
          {["user", "brand", "category", "module", "portal-page", "media", "report"].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <button type="button" onClick={() => void loadAudit()} disabled={loading} className="focus-ring w-full rounded-full bg-ink px-4 py-3 text-sm font-semibold text-white">
          {loading ? "Завантаження..." : "Оновити"}
        </button>
      </div>

      {/* Журнал */}
      <div className="space-y-3">
        {rows.map((row) => (
          <article key={row.id} className="rounded-[14px] border border-white/10 bg-white/[0.025] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${auditTone(row.action)}`}>{row.action}</span>
                  <span className="rounded-full border border-white/10 bg-white/[0.025] px-2.5 py-1 text-[10px] font-semibold text-slate-500">{row.targetType}</span>
                  {row.targetLabel && <span className="rounded-full border border-white/10 bg-white/[0.025] px-2.5 py-1 text-[10px] font-semibold text-slate-500">{row.targetLabel}</span>}
                </div>
                <p className="mt-2.5 text-sm font-medium text-slate-100">{row.summary}</p>
                <p className="mt-1 text-xs text-slate-500">{row.actor ? `${row.actor.name} · ${row.actor.email}` : "Системна подія"}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">{formatDate(row.createdAt)}</p>
                <p className="mt-1 text-[10px] text-slate-600">{row.ipAddress ?? "—"}</p>
                {row.actor && <span className={`mt-2 inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${roleTone(row.actor.role)}`}>{row.actor.role}</span>}
              </div>
            </div>
          </article>
        ))}
        {!loading && rows.length === 0 && (
          <div className="rounded-[14px] border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center text-sm text-slate-500">
            Журнал порожній або нічого не знайдено
          </div>
        )}
      </div>
    </div>
  );
}
