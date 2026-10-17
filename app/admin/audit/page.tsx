import { requireAdminOrManagerPageUser } from "@/lib/guards";
import { AdminConsole } from "@/components/admin/AdminConsole";
import { fetchAdminConsoleData } from "@/app/admin/_shared/fetchAdminData";

export default async function AdminAuditPage() {
  const [user, { users, brandRows, portalPages }] = await Promise.all([
    requireAdminOrManagerPageUser(),
    fetchAdminConsoleData()
  ]);

  return (
    <AdminConsole
      currentUserId={user.id}
      role={user.role}
      initialUsers={users}
      brands={brandRows}
      portalPages={portalPages}
      defaultTab="audit"
    />
  );
}