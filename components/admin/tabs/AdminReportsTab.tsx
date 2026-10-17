"use client";

import { getRequestError, requestJson } from "@/lib/http-client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AdminContentBrandRow } from "@/components/admin/AdminContentTree";

type ReportRow = {
  userId: string;
  name: string;
  department: string;
  store: string | null;
  completed: number;
  inProgress: number;
  total: number;
};

type ReportSummary = {
  users: number;
  completedModules: number;
  inProgressModules: number;
  notStartedUsers: number;
};

type ModuleAnalyticsRow = {
  moduleId: number;
  title: string;
  brand: string;
  category: string;
};

type HardestModuleRow = ModuleAnalyticsRow & {
  attempts: number;
  failedAttempts: number;
  avgScore: number;
  passRate: number;
};

type StuckModuleRow = ModuleAnalyticsRow & {
  touchedUsers: number;
  completedCount: number;
  inProgressCount: number;
  completionRate: number;
};

type WeakestUserRow = {
  userId: string;
  name: string;
  department: string;
  store: string | null;
  attempts: number;
  failedAttempts: number;
  avgScore: number;
  completed: number;
  inProgress: number;
};

type ReportAnalytics = {
  hardestModules: HardestModuleRow[];
  stuckModules: StuckModuleRow[];
  weakestUsers: WeakestUserRow[];
};

type AdminReportsTabProps = {
  brands: AdminContentBrandRow[];
  onNotice: (msg: string) => void;
};

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[14px] border border-white/10 bg-white/[0.025] p-4">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 font-[var(--font-heading)] text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
}

export function AdminReportsTab({ brands, onNotice }: AdminReportsTabProps) {
  const [department, setDepartment] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [reportRows, setReportRows] = useState<ReportRow[]>([]);
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [analytics, setAnalytics] = useState<ReportAnalytics | null>(null);
  const [loading, setLoading] = useState(false);

  const requestIdRef = useRef(0);

  const loadReports = useCallback(async (signal?: AbortSignal) => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (department) params.set("department", department);
      if (brandFilter) params.set("brand", brandFilter);
      const data = await requestJson<{ rows?: ReportRow[]; summary?: ReportSummary; analytics?: ReportAnalytics }>("/api/admin/reports?" + params.toString(), { signal });
      if (signal?.aborted || requestId !== requestIdRef.current) return;
      setReportRows(data.rows ?? []);
      setSummary(data.summary ?? null);
      setAnalytics(data.analytics ?? null);
    } catch (requestError) {
      if (!signal?.aborted && requestId === requestIdRef.current) onNotice(getRequestError(requestError));
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [brandFilter, department, onNotice]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => { void loadReports(controller.signal); }, 180);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [loadReports]);

  return (
    <div className="mt-6 space-y-5">
      {/* Фільтри */}
      <div className="grid gap-3 lg:grid-cols-3">
        <input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Фільтр по відділу" className="focus-ring rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500" />
        <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className="focus-ring rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white">
          <option value="">Всі бренди</option>
          {brands.map((b) => <option key={b.id} value={b.slug}>{b.name}</option>)}
        </select>
        <button type="button" onClick={() => void loadReports()} disabled={loading} className="focus-ring w-full rounded-full bg-ink px-4 py-3 text-sm font-semibold text-white">
          {loading ? "Завантаження..." : "Оновити звіт"}
        </button>
      </div>

      {/* KPI */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Працівники" value={summary?.users ?? 0} />
        <StatCard label="Завершено" value={summary?.completedModules ?? 0} />
        <StatCard label="У процесі" value={summary?.inProgressModules ?? 0} />
        <StatCard label="Без старту" value={summary?.notStartedUsers ?? 0} />
      </div>

      {/* Analytics: 3 колонки */}
      <div className="grid gap-4 xl:grid-cols-3">
        {/* Найскладніші модулі */}
        <article className="rounded-[14px] border border-white/10 bg-white/[0.025] p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-[var(--font-heading)] text-base font-semibold text-white">Найскладніші модулі</h3>
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">за балом</span>
          </div>
          <div className="space-y-2.5">
            {analytics?.hardestModules.map((m) => (
              <div key={m.moduleId} className="rounded-[10px] border border-white/[0.065] bg-white/[0.02] p-3">
                <p className="text-sm font-medium text-slate-100">{m.title}</p>
                <p className="mt-0.5 text-[10px] text-slate-500">{m.brand} · {m.category}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {[`${m.avgScore}% бал`, `${m.passRate}% pass`, `${m.failedAttempts}/${m.attempts} провалів`].map((t) => (
                    <span key={t} className="rounded-full border border-white/10 bg-white/[0.025] px-2 py-0.5 text-[10px] font-semibold text-slate-500">{t}</span>
                  ))}
                </div>
              </div>
            ))}
            {!analytics?.hardestModules.length && <p className="text-xs text-slate-500 py-3">Недостатньо даних</p>}
          </div>
        </article>

        {/* Модулі зі залипанням */}
        <article className="rounded-[14px] border border-white/10 bg-white/[0.025] p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-[var(--font-heading)] text-base font-semibold text-white">Модулі зі залипанням</h3>
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">in progress</span>
          </div>
          <div className="space-y-2.5">
            {analytics?.stuckModules.map((m) => (
              <div key={m.moduleId} className="rounded-[10px] border border-white/[0.065] bg-white/[0.02] p-3">
                <p className="text-sm font-medium text-slate-100">{m.title}</p>
                <p className="mt-0.5 text-[10px] text-slate-500">{m.brand} · {m.category}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {[`${m.inProgressCount} в процесі`, `${m.touchedUsers} торкнулись`, `${m.completionRate}% completion`].map((t) => (
                    <span key={t} className="rounded-full border border-white/10 bg-white/[0.025] px-2 py-0.5 text-[10px] font-semibold text-slate-500">{t}</span>
                  ))}
                </div>
              </div>
            ))}
            {!analytics?.stuckModules.length && <p className="text-xs text-slate-500 py-3">Немає залипань</p>}
          </div>
        </article>

        {/* Найслабші по людях */}
        <article className="rounded-[14px] border border-white/10 bg-white/[0.025] p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-[var(--font-heading)] text-base font-semibold text-white">Ризикова група</h3>
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">низький бал</span>
          </div>
          <div className="space-y-2.5">
            {analytics?.weakestUsers.map((u) => (
              <div key={u.userId} className="rounded-[10px] border border-white/[0.065] bg-white/[0.02] p-3">
                <p className="text-sm font-medium text-slate-100">{u.name}</p>
                <p className="mt-0.5 text-[10px] text-slate-500">{u.department}{u.store ? ` · ${u.store}` : ""}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {[`${u.avgScore}% бал`, `${u.failedAttempts}/${u.attempts} провалів`, `${u.completed} завершено`].map((t) => (
                    <span key={t} className="rounded-full border border-white/10 bg-white/[0.025] px-2 py-0.5 text-[10px] font-semibold text-slate-500">{t}</span>
                  ))}
                </div>
              </div>
            ))}
            {!analytics?.weakestUsers.length && <p className="text-xs text-slate-500 py-3">Недостатньо спроб</p>}
          </div>
        </article>
      </div>

      {/* Повна таблиця */}
      <div className="overflow-x-auto rounded-[20px] border border-white/10 bg-white/[0.025]">
        <table className="min-w-[700px] text-left text-sm">
          <thead className="border-b border-white/10 text-[0.65rem] uppercase tracking-[0.2em] text-slate-500">
            <tr>
              {["Працівник", "Відділ", "Магазин", "Завершено", "У процесі", "Всього"].map((h) => (
                <th key={h} className="px-4 py-3.5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reportRows.map((row, i) => (
              <tr key={row.userId} className={`border-t border-white/10 ${i === 0 ? "bg-[rgba(40,178,158,0.05)]" : ""}`}>
                <td className="px-4 py-3 font-medium text-slate-100">{row.name}</td>
                <td className="px-4 py-3 text-slate-300">{row.department}</td>
                <td className="px-4 py-3 text-slate-500">{row.store ?? "—"}</td>
                <td className="px-4 py-3 text-slate-300">{row.completed}</td>
                <td className="px-4 py-3 text-slate-300">{row.inProgress}</td>
                <td className="px-4 py-3 text-slate-300">{row.total}</td>
              </tr>
            ))}
            {reportRows.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">Дані ще не завантажені</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
