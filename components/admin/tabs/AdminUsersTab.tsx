"use client";

import { getRequestError } from "@/lib/http-client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@prisma/client";
import { Download, Search, ShieldCheck } from "lucide-react";
import { AdminCreateUserForm } from "@/components/admin/AdminCreateUserForm";
import { formatDate } from "@/lib/ui";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  position: string;
  store: string | null;
  isActive: boolean;
  createdAt: string | Date;
  _count: { progresses: number; attempts: number };
};

type AdminUsersTabProps = {
  currentUserId: string;
  role: Role;
  initialUsers: UserRow[];
  onNotice: (msg: string) => void;
};

function roleTone(role: Role) {
  if (role === "ADMIN") return "border-amber-500/20 bg-amber-500/12 text-amber-100";
  if (role === "MANAGER") return "border-sky-500/20 bg-sky-500/12 text-sky-100";
  return "border-white/10 bg-white/[0.03] text-slate-300";
}

const USERS_PER_PAGE = 20;

export function AdminUsersTab({ currentUserId, role, initialUsers, onNotice }: AdminUsersTabProps) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [userQuery, setUserQuery] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [bulkUserAction, setBulkUserAction] = useState<"activate" | "deactivate" | "set-role" | "delete">("activate");
  const [bulkUserRole, setBulkUserRole] = useState<Role>("SELLER");
  const [isApplyingBulk, setIsApplyingBulk] = useState(false);
  const [usersPage, setUsersPage] = useState(1);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  useEffect(() => {
    setUsers(initialUsers);
    setSelectedUserIds((previous) => previous.filter((id) => initialUsers.some((user) => user.id === id)));
  }, [initialUsers]);

  const filteredUsers = useMemo(() => {
    const q = userQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.name, u.email, u.department, u.store ?? "", u.position, u.role].join(" ").toLowerCase().includes(q)
    );
  }, [userQuery, users]);
  useEffect(() => {
    setUsersPage((page) => Math.min(page, Math.max(1, Math.ceil(filteredUsers.length / USERS_PER_PAGE))));
  }, [filteredUsers.length]);

  const filteredSelectableIds = useMemo(
    () => filteredUsers.filter((u) => u.id !== currentUserId).map((u) => u.id),
    [currentUserId, filteredUsers]
  );
  const allFilteredSelected =
    filteredSelectableIds.length > 0 && filteredSelectableIds.every((id) => selectedUserIds.includes(id));

  const activeCount = users.filter((u) => u.isActive).length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const managerCount = users.filter((u) => u.role === "MANAGER").length;
  const sellerCount = users.filter((u) => u.role === "SELLER").length;
  const totalProgresses = users.reduce((s, u) => s + u._count.progresses, 0);
  const totalAttempts = users.reduce((s, u) => s + u._count.attempts, 0);

  function toggle(id: string, checked: boolean) {
    setSelectedUserIds((prev) => checked ? [...new Set([...prev, id])] : prev.filter((x) => x !== id));
  }

  function toggleAll(checked: boolean) {
    setSelectedUserIds((prev) => {
      const ids = new Set(filteredSelectableIds);
      return checked ? [...new Set([...prev, ...filteredSelectableIds])] : prev.filter((id) => !ids.has(id));
    });
  }

  async function saveUser(user: UserRow) {
    if (pendingUserId || isApplyingBulk) return;
    setPendingUserId(user.id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId: user.id, role: user.role, isActive: user.isActive })
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) { onNotice(data.error ?? "Помилка збереження"); return; }
      onNotice(`«${user.name}» оновлено`);
      router.refresh();
    } catch (requestError) {
      onNotice(getRequestError(requestError));
    } finally {
      setPendingUserId(null);
    }
  }

  async function deleteUser(id: string, name: string) {
    if (pendingUserId || isApplyingBulk) return;
    try {
      if (!window.confirm(`Видалити «${name}»? Цю дію не можна скасувати.`)) return;
      setPendingUserId(id);
      const res = await fetch(`/api/admin/users?userId=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) { onNotice(data.error ?? "Помилка видалення"); return; }
      onNotice(`«${name}» видалено`);
      setUsers((previous) => previous.filter((user) => user.id !== id));
      router.refresh();
    } catch (requestError) {
      onNotice(getRequestError(requestError));
    } finally {
      setPendingUserId(null);
    }
  }

  async function applyBulk() {
    if (isApplyingBulk || pendingUserId) return;
    try {
      const ids = selectedUserIds.filter((id) => id !== currentUserId);
      if (!ids.length) { onNotice("Оберіть хоча б одного"); return; }
      if (bulkUserAction === "delete" && !window.confirm(`Видалити ${ids.length} користувачів?`)) return;
      setIsApplyingBulk(true);
      const res = await fetch("/api/admin/users/bulk", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userIds: ids, action: bulkUserAction, role: bulkUserAction === "set-role" ? bulkUserRole : undefined })
      });
      const data = (await res.json()) as { affectedCount?: number; error?: string };
      setIsApplyingBulk(false);
      if (!res.ok) { onNotice(data.error ?? "Помилка"); return; }
      setSelectedUserIds([]);
      onNotice(`Застосовано до ${data.affectedCount ?? 0} користувачів`);
      router.refresh();
    } catch (requestError) {
      onNotice(getRequestError(requestError));
    } finally {
      setIsApplyingBulk(false);
    }
  }

  return (
    <div className="mt-6 space-y-5">
      {/* Статистика */}
      <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {[
          { label: "Всього", value: users.length },
          { label: "Активні", value: activeCount },
          { label: "A/M/S", value: `${adminCount}/${managerCount}/${sellerCount}` },
          { label: "Прогрес записів", value: totalProgresses },
          { label: "Тестових спроб", value: totalAttempts }
        ].map((s) => (
          <div key={s.label} className="rounded-[14px] border border-white/10 bg-white/[0.025] p-4">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500">{s.label}</p>
            <p className="mt-2 font-[var(--font-heading)] text-2xl font-semibold text-ink">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Пошук + CSV */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
          <input
            value={userQuery}
            onChange={(e) => { setUserQuery(e.target.value); setUsersPage(1); }}
            placeholder="Пошук по ПІБ, email, ролі, відділу або магазину"
            className="focus-ring w-full rounded-full border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-500"
          />
        </div>
        <a
          href="/api/admin/export"
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-ink"
        >
          <Download className="size-4" aria-hidden="true" />
          CSV
        </a>
      </div>

      {role === "ADMIN" && <AdminCreateUserForm />}

      {/* Масові дії */}
      {role === "ADMIN" && (
        <div className="rounded-[14px] border border-white/10 bg-white/[0.025] p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-white">{selectedUserIds.length}</span> обрано
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => toggleAll(true)} className="focus-ring rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-ink">Обрати всіх</button>
              <button type="button" onClick={() => setSelectedUserIds([])} className="focus-ring rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-ink">Очистити</button>
              <select value={bulkUserAction} onChange={(e) => setBulkUserAction(e.target.value as typeof bulkUserAction)} className="focus-ring rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white">
                <option value="activate">Активувати</option>
                <option value="deactivate">Деактивувати</option>
                <option value="set-role">Змінити роль</option>
                <option value="delete">Видалити</option>
              </select>
              {bulkUserAction === "set-role" && (
                <select value={bulkUserRole} onChange={(e) => setBulkUserRole(e.target.value as Role)} className="focus-ring rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white">
                  <option value="SELLER">SELLER</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              )}
              <button type="button" onClick={applyBulk} disabled={!selectedUserIds.length || isApplyingBulk || Boolean(pendingUserId)} className="focus-ring rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white disabled:opacity-40">
                {isApplyingBulk ? "Застосовую..." : "Застосувати"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Таблиця */}
      <div className="overflow-x-auto rounded-[20px] border border-white/10 bg-white/[0.025]">
        <table className="min-w-[900px] text-left text-sm">
          <thead className="border-b border-white/10 text-[0.65rem] uppercase tracking-[0.2em] text-slate-500">
            <tr>
              <th className="px-4 py-3.5">
                {role === "ADMIN" && (
                  <input type="checkbox" checked={allFilteredSelected} onChange={(e) => toggleAll(e.target.checked)} className="size-4 rounded border-white/20 bg-white/5" />
                )}
              </th>
              <th className="px-4 py-3.5">Працівник</th>
              <th className="px-4 py-3.5">Роль</th>
              <th className="px-4 py-3.5">Відділ</th>
              <th className="px-4 py-3.5">Статус</th>
              <th className="px-4 py-3.5">Навчання</th>
              <th className="px-4 py-3.5">Реєстрація</th>
              <th className="px-4 py-3.5">Дії</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.slice((usersPage - 1) * USERS_PER_PAGE, usersPage * USERS_PER_PAGE).map((user) => (
              <tr key={user.id} className="border-t border-white/10 align-top">
                <td className="px-4 py-3.5">
                  {role === "ADMIN" && user.id !== currentUserId && (
                    <input type="checkbox" checked={selectedUserIds.includes(user.id)} onChange={(e) => toggle(user.id, e.target.checked)} className="size-4 rounded border-white/20 bg-white/5" />
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <p className="font-medium text-slate-100">{user.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{user.email}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-600">{user.position}</p>
                </td>
                <td className="px-4 py-3.5">
                  {role === "ADMIN" && user.id !== currentUserId ? (
                    <select value={user.role} onChange={(e) => setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, role: e.target.value as Role } : u))} className="focus-ring rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-white">
                      <option value="ADMIN">ADMIN</option>
                      <option value="MANAGER">MANAGER</option>
                      <option value="SELLER">SELLER</option>
                    </select>
                  ) : (
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${roleTone(user.role)}`}>{user.role}</span>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <p className="text-slate-300">{user.department}</p>
                  <p className="mt-1 text-xs text-slate-500">{user.store ?? "—"}</p>
                </td>
                <td className="px-4 py-3.5">
                  {role === "ADMIN" && user.id !== currentUserId ? (
                    <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                      <input type="checkbox" checked={user.isActive} onChange={(e) => setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, isActive: e.target.checked } : u))} className="size-4 rounded border-white/20 bg-white/5" />
                      {user.isActive ? "Активний" : "Неактивний"}
                    </label>
                  ) : (
                    <span className="text-slate-300">{user.isActive ? "Активний" : "Неактивний"}</span>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <p className="text-slate-300">{user._count.progresses} прогресів</p>
                  <p className="mt-1 text-xs text-slate-500">{user._count.attempts} спроб</p>
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-500">{formatDate(user.createdAt)}</td>
                <td className="px-4 py-3.5">
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/admin/users/${user.id}`} className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-ink">
                      {user.id === currentUserId ? "Мої дані" : "Дані та доступ"}
                    </Link>
                    {role === "ADMIN" && (
                      <>
                        <Link href={`/admin/users/${user.id}/profile`} className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-[rgba(40,178,158,0.25)] bg-[rgba(40,178,158,0.08)] px-3 py-1.5 text-xs font-semibold text-[#8fe3d3]">
                          Навчальний профіль
                        </Link>
                        <button type="button" onClick={() => saveUser(user)} disabled={user.id === currentUserId || Boolean(pendingUserId) || isApplyingBulk} className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40">
                          <ShieldCheck className="size-3" aria-hidden="true" />
                          Зберегти
                        </button>
                        <button type="button" onClick={() => deleteUser(user.id, user.name)} disabled={user.id === currentUserId || Boolean(pendingUserId) || isApplyingBulk} className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-100 disabled:opacity-40">
                          Видалити
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-slate-500">Нічого не знайдено</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredUsers.length > USERS_PER_PAGE && (
        <div className="flex items-center justify-between gap-4 rounded-[14px] border border-white/10 bg-white/[0.025] px-4 py-3">
          <p className="text-xs text-slate-500">
            {filteredUsers.length} · стор. {usersPage} з {Math.ceil(filteredUsers.length / USERS_PER_PAGE)}
          </p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setUsersPage((p) => Math.max(1, p - 1))} disabled={usersPage === 1} className="focus-ring rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-300 disabled:opacity-40">← Назад</button>
            {Array.from({ length: Math.min(5, Math.ceil(filteredUsers.length / USERS_PER_PAGE)) }, (_, i) => {
              const total = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
              const p = Math.max(1, Math.min(usersPage - 2, total - 4)) + i;
              if (p > total) return null;
              return (
                <button key={p} type="button" onClick={() => setUsersPage(p)} className={`focus-ring rounded-full border px-3 py-1.5 text-xs font-semibold ${p === usersPage ? "border-[rgba(40,178,158,0.28)] bg-[rgba(40,178,158,0.12)] text-[color:var(--brand-strong)]" : "border-white/10 bg-white/[0.03] text-slate-400"}`}>{p}</button>
              );
            })}
            <button type="button" onClick={() => setUsersPage((p) => Math.min(Math.ceil(filteredUsers.length / USERS_PER_PAGE), p + 1))} disabled={usersPage >= Math.ceil(filteredUsers.length / USERS_PER_PAGE)} className="focus-ring rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-300 disabled:opacity-40">Далі →</button>
          </div>
        </div>
      )}
    </div>
  );
}
