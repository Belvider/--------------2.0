"use client";

import type { Role } from "@prisma/client";
import { AdminAssignmentsPanel } from "@/components/admin/AdminAssignmentsPanel";
import type { AdminContentBrandRow } from "@/components/admin/AdminContentTree";

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

type AdminAssignmentsTabProps = {
  role: Role;
  users: UserRow[];
  brands: AdminContentBrandRow[];
};

export function AdminAssignmentsTab({ role, users, brands }: AdminAssignmentsTabProps) {
  return (
    <div className="mt-6">
      <AdminAssignmentsPanel role={role} users={users} brands={brands} />
    </div>
  );
}
