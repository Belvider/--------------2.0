"use client";

import { getRequestError } from "@/lib/http-client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { AssignmentTargetType, Role } from "@prisma/client";
import {
  AlertTriangle,
  BadgeCheck,
  BookOpenCheck,
  Building2,
  CalendarClock,
  Loader2,
  Search,
  Target,
  Trash2,
  UserPlus
} from "lucide-react";
import type { AdminContentBrandRow } from "@/components/admin/AdminContentTree";
import { formatDate } from "@/lib/ui";

type UserOption = {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  store: string | null;
  isActive: boolean;
};

type AssignmentRow = {
  id: number;
  moduleId: number;
  moduleTitle: string;
  moduleDescription: string;
  moduleDurationMin: number;
  brandName: string;
  categoryName: string;
  targetType: AssignmentTargetType;
  targetUserId: string | null;
  targetLabel: string;
  targetDepartment: string;
  targetEmail: string | null;
  dueAt: string | Date | null;
  required: boolean;
  note: string | null;
  assignedByName: string;
  createdAt: string | Date;
  affectedUsers: number;
  completedUsers: number;
  inProgressUsers: number;
  notStartedUsers: number;
  overdueUsers: number;
  dueSoonUsers: number;
  completionRate: number;
};

type AssignmentSummary = {
  total: number;
  required: number;
  userAssignments: number;
  departmentAssignments: number;
  affectedUsers: number;
  completedUsers: number;
  overdueUsers: number;
  dueSoonUsers: number;
  completionRate: number;
};

type AdminAssignmentsPanelProps = {
  role: Role;
  users: UserOption[];
  brands: AdminContentBrandRow[];
};

export function AdminAssignmentsPanel({ role, users, brands }: AdminAssignmentsPanelProps) {
  const isAdmin = role === "ADMIN";
  const activeUsers = useMemo(() => users.filter((user) => user.isActive), [users]);
  const departmentOptions = useMemo(
    () => [...new Set(activeUsers.map((user) => user.department.trim() || "Без відділу"))].sort((a, b) => a.localeCompare(b, "uk")),
    [activeUsers]
  );
  const moduleOptions = useMemo(
    () =>
      brands.flatMap((brand) =>
        brand.categories.flatMap((category) =>
          category.modules.map((module) => ({
            id: module.id,
            label: `${brand.name} / ${category.name} / ${module.title}`
          }))
        )
      ),
    [brands]
  );

  const [rows, setRows] = useState<AssignmentRow[]>([]);
  const [summary, setSummary] = useState<AssignmentSummary | null>(null);
  const [departments, setDepartments] = useState<string[]>(departmentOptions);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterTargetType, setFilterTargetType] = useState<"" | AssignmentTargetType>("");
  const [targetType, setTargetType] = useState<AssignmentTargetType>("USER");
  const [selectedUserId, setSelectedUserId] = useState(activeUsers[0]?.id ?? "");
  const [selectedDepartment, setSelectedDepartment] = useState(departmentOptions[0] ?? "");
  const [selectedModuleId, setSelectedModuleId] = useState(moduleOptions[0] ? String(moduleOptions[0].id) : "");
  const [dueAt, setDueAt] = useState("");
  const [note, setNote] = useState("");
  const [required, setRequired] = useState(true);
  const workspaceRequestRef = useRef(0);

  useEffect(() => {
    if (selectedUserId && activeUsers.some((user) => user.id === selectedUserId)) {
      return;
    }

    if (activeUsers[0]) {
      setSelectedUserId(activeUsers[0].id);
    }
  }, [activeUsers, selectedUserId]);

  useEffect(() => {
    if (selectedDepartment && departmentOptions.includes(selectedDepartment)) {
      return;
    }

    if (departmentOptions[0]) {
      setSelectedDepartment(departmentOptions[0]);
    }
  }, [departmentOptions, selectedDepartment]);

  useEffect(() => {
    if (selectedModuleId && moduleOptions.some((module) => String(module.id) === selectedModuleId)) {
      return;
    }

    if (moduleOptions[0]) {
      setSelectedModuleId(String(moduleOptions[0].id));
    }
  }, [moduleOptions, selectedModuleId]);

  async function loadWorkspace(overrides?: {
    query?: string;
    department?: string;
    targetType?: "" | AssignmentTargetType;
  }) {
    const requestId = ++workspaceRequestRef.current;
    try {
      setIsLoading(true);
      setError(null);
  
      const params = new URLSearchParams();
      const effectiveQuery = overrides?.query ?? query;
      const effectiveDepartment = overrides?.department ?? filterDepartment;
      const effectiveTargetType = overrides?.targetType ?? filterTargetType;
  
      if (effectiveQuery.trim()) params.set("query", effectiveQuery.trim());
      if (effectiveDepartment.trim()) params.set("department", effectiveDepartment.trim());
      if (effectiveTargetType) params.set("targetType", effectiveTargetType);
  
      const response = await fetch(`/api/admin/assignments?${params.toString()}`);
      const data = (await response.json()) as {
        rows?: AssignmentRow[];
        summary?: AssignmentSummary;
        departments?: string[];
        error?: string;
      };
      if (requestId !== workspaceRequestRef.current) return;
  
      setIsLoading(false);
  
      if (!response.ok) {
        setError(data.error ?? "Не вдалося завантажити призначення");
        return;
      }
  
      setRows(data.rows ?? []);
      setSummary(data.summary ?? null);
      setDepartments(data.departments?.length ? data.departments : departmentOptions);
    } catch (requestError) {
      if (requestId === workspaceRequestRef.current) setError(getRequestError(requestError));
    } finally {
      if (requestId === workspaceRequestRef.current) setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadWorkspace();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createAssignment(event: FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();
      if (!isAdmin || !selectedModuleId) {
        return;
      }
  
      setIsSaving(true);
      setError(null);
      setNotice(null);
  
      const response = await fetch("/api/admin/assignments", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          moduleId: Number(selectedModuleId),
          targetType,
          userId: targetType === "USER" ? selectedUserId : undefined,
          department: targetType === "DEPARTMENT" ? selectedDepartment : undefined,
          dueAt: dueAt || undefined,
          required,
          note: note.trim() || undefined
        })
      });
  
      const data = (await response.json()) as { error?: string };
  
      setIsSaving(false);
  
      if (!response.ok) {
        setError(data.error ?? "Не вдалося створити призначення");
        return;
      }
  
      setNotice("Призначення додано до навчальної траєкторії");
      setDueAt("");
      setNote("");
      setRequired(true);
      await loadWorkspace();
    } catch (requestError) {
      setError(getRequestError(requestError));
    } finally {
      setIsSaving(false);
    }
  }

  async function deactivateAssignment(assignmentId: number, label: string) {
    try {
      if (!isAdmin) {
        return;
      }
  
      const confirmed = window.confirm(`Зняти призначення «${label}» з активних?`);
      if (!confirmed) {
        return;
      }
  
      setError(null);
      setNotice(null);
  
      const response = await fetch(`/api/admin/assignments?id=${assignmentId}`, {
        method: "DELETE"
      });
  
      const data = (await response.json()) as { error?: string };
  
      if (!response.ok) {
        setError(data.error ?? "Не вдалося деактивувати призначення");
        return;
      }
  
      setNotice("Призначення переведено в неактивний стан");
      await loadWorkspace();
    } catch (requestError) {
      setError(getRequestError(requestError));
    }
  }

  return (
    <div className="space-y-5">
      {notice ? (
        <div className="rounded-[22px] border border-[rgba(40,178,158,0.24)] bg-[rgba(40,178,158,0.1)] px-4 py-3 text-sm text-white">
          {notice}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-[22px] border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Активні призначення</p>
          <p className="mt-2 font-[var(--font-heading)] text-3xl font-semibold text-ink">{summary?.total ?? 0}</p>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Охоплено людей</p>
          <p className="mt-2 font-[var(--font-heading)] text-3xl font-semibold text-ink">{summary?.affectedUsers ?? 0}</p>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Завершили</p>
          <p className="mt-2 font-[var(--font-heading)] text-3xl font-semibold text-ink">{summary?.completedUsers ?? 0}</p>
          <p className="mt-1 text-sm text-slate-600">{summary?.completionRate ?? 0}% покриття</p>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Прострочення</p>
          <p className="mt-2 font-[var(--font-heading)] text-3xl font-semibold text-rose-100">{summary?.overdueUsers ?? 0}</p>
          <p className="mt-1 text-sm text-slate-600">потрібно втрутитися</p>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Скоро дедлайн</p>
          <p className="mt-2 font-[var(--font-heading)] text-3xl font-semibold text-amber-100">{summary?.dueSoonUsers ?? 0}</p>
          <p className="mt-1 text-sm text-slate-600">потребують уваги</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_0.8fr]">
        <article className="card p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
              <Target className="size-5 text-[color:var(--brand-strong)]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Нова траєкторія</p>
              <h2 className="mt-1 font-[var(--font-heading)] text-2xl font-semibold text-ink">Призначити навчання</h2>
            </div>
          </div>

          {isAdmin ? (
            <form className="mt-5 grid gap-3" onSubmit={createAssignment}>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-slate-400">
                  Формат призначення
                  <select
                    value={targetType}
                    onChange={(event) => setTargetType(event.target.value as AssignmentTargetType)}
                    className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white"
                  >
                    <option value="USER">Конкретний користувач</option>
                    <option value="DEPARTMENT">Увесь відділ</option>
                  </select>
                </label>

                <label className="grid gap-2 text-sm text-slate-400">
                  Модуль
                  <select
                    value={selectedModuleId}
                    onChange={(event) => setSelectedModuleId(event.target.value)}
                    className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white"
                  >
                    {moduleOptions.map((module) => (
                      <option key={module.id} value={module.id}>
                        {module.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {targetType === "USER" ? (
                <label className="grid gap-2 text-sm text-slate-400">
                  Працівник
                  <select
                    value={selectedUserId}
                    onChange={(event) => setSelectedUserId(event.target.value)}
                    className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white"
                  >
                    {activeUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} · {user.department}
                        {user.store ? ` · ${user.store}` : ""}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <label className="grid gap-2 text-sm text-slate-400">
                  Відділ
                  <select
                    value={selectedDepartment}
                    onChange={(event) => setSelectedDepartment(event.target.value)}
                    className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white"
                  >
                    {departmentOptions.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <div className="grid gap-3 md:grid-cols-[220px_minmax(0,1fr)]">
                <label className="grid gap-2 text-sm text-slate-400">
                  Дедлайн
                  <input
                    type="date"
                    value={dueAt}
                    onChange={(event) => setDueAt(event.target.value)}
                    className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white"
                  />
                </label>

                <label className="grid gap-2 text-sm text-slate-400">
                  Примітка для команди
                  <textarea
                    rows={3}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Наприклад: пройти до кінця тижня перед запуском нової лінійки"
                    className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
                  />
                </label>
              </div>

              <label className="inline-flex items-center gap-3 rounded-[18px] border border-white/10 bg-white/[0.025] px-4 py-3 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={required}
                  onChange={(event) => setRequired(event.target.checked)}
                  className="size-4 rounded border-white/20 bg-white/5"
                />
                Обов’язкове призначення
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={isSaving || !selectedModuleId || (targetType === "USER" ? !selectedUserId : !selectedDepartment)}
                  className="focus-ring bg-ink inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {isSaving ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <UserPlus className="size-4" aria-hidden="true" />}
                  Додати призначення
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDueAt("");
                    setNote("");
                    setRequired(true);
                  }}
                  className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-ink sm:w-auto"
                >
                  Очистити поля
                </button>
              </div>
            </form>
          ) : (
            <p className="mt-5 rounded-[24px] border border-white/10 bg-white/[0.025] px-4 py-5 text-sm text-slate-500">
              Менеджер тут бачить живу картину призначень, але створення й деактивація залишаються за адміністратором.
            </p>
          )}
        </article>

        <article className="card p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
              <Search className="size-5 text-[color:var(--brand-strong)]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Фокус аналітики</p>
              <h2 className="mt-1 font-[var(--font-heading)] text-2xl font-semibold text-ink">Фільтри й зрізи</h2>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Пошук по модулю, відділу, працівнику або примітці"
              className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
            />
            <div className="grid gap-3 md:grid-cols-2">
              <select
                value={filterTargetType}
                onChange={(event) => setFilterTargetType(event.target.value as "" | AssignmentTargetType)}
                className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white"
              >
                <option value="">Усі типи</option>
                <option value="USER">Користувачі</option>
                <option value="DEPARTMENT">Відділи</option>
              </select>
              <select
                value={filterDepartment}
                onChange={(event) => setFilterDepartment(event.target.value)}
                className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white"
              >
                <option value="">Усі відділи</option>
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => void loadWorkspace()}
                className="focus-ring bg-ink inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white sm:w-auto"
              >
                {isLoading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <BookOpenCheck className="size-4" aria-hidden="true" />}
                Оновити дані
              </button>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setFilterDepartment("");
                  setFilterTargetType("");
                  setNotice(null);
                  setError(null);
                  void loadWorkspace({
                    query: "",
                    department: "",
                    targetType: ""
                  });
                }}
                className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-ink sm:w-auto"
              >
                Скинути фільтри
              </button>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-4 text-sm text-slate-600">
              Звідси ми вже бачимо не просто контент, а реальну траєкторію навчання: кому що призначили, де вже є
              ризик прострочення і які відділи потребують уваги швидше за інші.
            </div>
          </div>
        </article>
      </div>

      <div className="space-y-3">
        {rows.map((row) => {
          const rowStatus =
            row.completedUsers === row.affectedUsers && row.affectedUsers > 0
              ? "completed"
              : row.overdueUsers > 0
                ? "overdue"
                : row.dueSoonUsers > 0
                  ? "dueSoon"
                  : "active";

          return (
            <article key={row.id} className="card p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="portal-chip">{row.brandName}</span>
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-500">
                      {row.categoryName}
                    </span>
                    <span
                      className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                        rowStatus === "completed"
                          ? "border-[rgba(40,178,158,0.28)] bg-[rgba(40,178,158,0.12)] text-[color:var(--brand-strong)]"
                          : rowStatus === "overdue"
                            ? "border-rose-500/20 bg-rose-500/10 text-rose-100"
                            : rowStatus === "dueSoon"
                              ? "border-amber-500/20 bg-amber-500/10 text-amber-100"
                              : "border-white/10 bg-white/[0.03] text-slate-400"
                      }`}
                    >
                      {rowStatus === "completed"
                        ? "Виконано"
                        : rowStatus === "overdue"
                          ? "Прострочено"
                          : rowStatus === "dueSoon"
                            ? "Скоро дедлайн"
                            : "Активне"}
                    </span>
                  </div>

                  <h3 className="mt-4 font-[var(--font-heading)] text-2xl font-semibold text-ink">{row.moduleTitle}</h3>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{row.moduleDescription}</p>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                      {row.moduleDurationMin} хв
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                      {row.targetType === "USER" ? "Персональне" : "По відділу"}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                      Автор: {row.assignedByName}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                      Створено: {formatDate(row.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="grid gap-2 text-left sm:text-right">
                  <div className="rounded-[22px] border border-white/10 bg-white/[0.025] px-4 py-3">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Дедлайн</p>
                    <p className="mt-2 font-semibold text-white">{row.dueAt ? formatDate(row.dueAt) : "Без дати"}</p>
                  </div>
                  <div className="rounded-[22px] border border-white/10 bg-white/[0.025] px-4 py-3">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Покриття</p>
                    <p className="mt-2 font-semibold text-white">{row.completionRate}%</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-4">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Кому призначено</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-300">
                    {row.targetType === "USER" ? <UserPlus className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" /> : <Building2 className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />}
                    <span className="font-medium text-white">{row.targetLabel}</span>
                    <span className="text-slate-500">· {row.targetDepartment}</span>
                    {row.targetEmail ? <span className="text-slate-500">· {row.targetEmail}</span> : null}
                  </div>
                  {row.note ? <p className="mt-4 text-sm leading-7 text-slate-600">{row.note}</p> : null}
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-4">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Статус виконання</p>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-[18px] border border-white/10 bg-white/[0.025] px-4 py-3">
                      <p className="text-slate-500">Завершили</p>
                      <p className="mt-1 font-semibold text-white">{row.completedUsers}</p>
                    </div>
                    <div className="rounded-[18px] border border-white/10 bg-white/[0.025] px-4 py-3">
                      <p className="text-slate-500">У процесі</p>
                      <p className="mt-1 font-semibold text-white">{row.inProgressUsers}</p>
                    </div>
                    <div className="rounded-[18px] border border-white/10 bg-white/[0.025] px-4 py-3">
                      <p className="text-slate-500">Ще не стартували</p>
                      <p className="mt-1 font-semibold text-white">{row.notStartedUsers}</p>
                    </div>
                    <div className="rounded-[18px] border border-white/10 bg-white/[0.025] px-4 py-3">
                      <p className="text-slate-500">Прострочено</p>
                      <p className={`mt-1 font-semibold ${row.overdueUsers > 0 ? "text-rose-100" : "text-white"}`}>{row.overdueUsers}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href={`/module/${row.moduleId}`}
                  className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-ink"
                >
                  <BookOpenCheck className="size-3.5" aria-hidden="true" />
                  Матеріал
                </Link>
                {row.targetUserId ? (
                  <Link
                    href={`/admin/users/${row.targetUserId}`}
                    className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-ink"
                  >
                    <BadgeCheck className="size-3.5" aria-hidden="true" />
                    Профіль
                  </Link>
                ) : null}
                {row.overdueUsers > 0 ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-100">
                    <AlertTriangle className="size-3.5" aria-hidden="true" />
                    Потрібне втручання
                  </span>
                ) : null}
                {row.dueSoonUsers > 0 ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-100">
                    <CalendarClock className="size-3.5" aria-hidden="true" />
                    Скоро дедлайн
                  </span>
                ) : null}
                {isAdmin ? (
                  <button
                    type="button"
                    onClick={() => void deactivateAssignment(row.id, row.moduleTitle)}
                    className="focus-ring inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-100"
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                    Зняти призначення
                  </button>
                ) : null}
              </div>
            </article>
          );
        })}

        {!isLoading && rows.length === 0 ? (
          <article className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.025] px-5 py-8 text-sm text-slate-500">
            Активних призначень за поточним фільтром ще немає.
          </article>
        ) : null}
      </div>
    </div>
  );
}
