"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Role } from "@prisma/client";
import {
  BarChart3,
  Download,
  FolderKanban,
  History,
  ShieldCheck,
  Target,
  Users2
} from "lucide-react";
import { AdminUsersTab } from "@/components/admin/tabs/AdminUsersTab";
import { AdminReportsTab } from "@/components/admin/tabs/AdminReportsTab";
import { AdminContentTab } from "@/components/admin/tabs/AdminContentTab";
import { AdminAssignmentsTab } from "@/components/admin/tabs/AdminAssignmentsTab";
import { AdminAuditTab } from "@/components/admin/tabs/AdminAuditTab";
import type { AdminContentBrandRow } from "@/components/admin/AdminContentTree";
import type { PortalPageContent, PortalPageSlug } from "@/lib/portal-pages";

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

type ConsoleTab = "users" | "reports" | "content" | "assignments" | "audit";

export type AdminConsoleProps = {
  currentUserId: string;
  role: Role;
  initialUsers: UserRow[];
  brands: AdminContentBrandRow[];
  portalPages: Array<{
    slug: PortalPageSlug;
    path: string;
    adminLabel: string;
    description: string;
    content: PortalPageContent;
  }>;
  defaultTab?: ConsoleTab;
};

const TABS: Array<{ id: ConsoleTab; label: string; icon: typeof Users2 }> = [
  { id: "users",       label: "Команда",    icon: Users2 },
  { id: "reports",     label: "Звіти",      icon: BarChart3 },
  { id: "content",     label: "Контент",    icon: FolderKanban },
  { id: "assignments", label: "Траєкторії", icon: Target },
  { id: "audit",       label: "Аудит",      icon: History }
];

const TAB_URLS: Record<ConsoleTab, string> = {
  users:       "/admin/users",
  reports:     "/admin/reports",
  content:     "/admin/content",
  assignments: "/admin/assignments",
  audit:       "/admin/audit"
};

export function AdminConsole({
  currentUserId,
  role,
  initialUsers,
  brands,
  portalPages,
  defaultTab = "users"
}: AdminConsoleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<ConsoleTab>(defaultTab);
  const [notice, setNotice] = useState<string | null>(null);

  function handleTabChange(tab: ConsoleTab) {
    setActiveTab(tab);
    router.push(TAB_URLS[tab] as never);
  }

  return (
    <section className="card p-4 sm:p-6">
      {/* Заголовок */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="portal-chip">Operational Workspace</span>
          <h2 className="mt-4 font-[var(--font-heading)] text-[clamp(1.5rem,2.6vw,2.2rem)] font-semibold text-ink">
            Адмін-консоль
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Команда, звіти, контент, траєкторії та журнал дій — в одному workspace.
          </p>
        </div>
        <a
          href="/api/admin/export"
          className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2.5 text-sm font-semibold text-ink"
        >
          <Download className="size-4" aria-hidden="true" />
          Експорт CSV
        </a>
      </div>

      {/* Notice */}
      {notice && (
        <div className="mt-5 flex items-center justify-between gap-3 rounded-[14px] border border-[rgba(40,178,158,0.24)] bg-[rgba(40,178,158,0.1)] px-4 py-3 text-sm text-white">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice(null)} className="text-white/60 hover:text-white">✕</button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`focus-ring inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                active
                  ? "border-[rgba(40,178,158,0.28)] bg-[rgba(40,178,158,0.12)] text-[color:var(--brand-strong)]"
                  : "border-white/10 bg-white/[0.025] text-slate-400 hover:bg-white/[0.04] hover:text-slate-300"
              }`}
            >
              <Icon className="size-4" aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content — кожен таб в окремому компоненті */}
      {activeTab === "users" && (
        <AdminUsersTab
          currentUserId={currentUserId}
          role={role}
          initialUsers={initialUsers}
          onNotice={setNotice}
        />
      )}

      {activeTab === "reports" && (
        <AdminReportsTab
          brands={brands}
          onNotice={setNotice}
        />
      )}

      {activeTab === "content" && (
        <AdminContentTab
          role={role}
          initialBrands={brands}
          portalPages={portalPages}
          onNotice={setNotice}
        />
      )}

      {activeTab === "assignments" && (
        <AdminAssignmentsTab
          role={role}
          users={initialUsers}
          brands={brands}
        />
      )}

      {activeTab === "audit" && (
        <AdminAuditTab
          onNotice={setNotice}
        />
      )}
    </section>
  );
}
