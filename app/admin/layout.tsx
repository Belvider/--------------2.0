import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminOrManagerPageUser } from "@/lib/guards";

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdminOrManagerPageUser();

  return (
    <AdminShell user={user}>
      {children}
    </AdminShell>
  );
}
