import { notFound } from "next/navigation";
import { AdminPortalPageEditor } from "@/components/admin/AdminPortalPageEditor";
import { requireAdminPageUser } from "@/lib/guards";
import { getPortalPageContent } from "@/lib/queries";
import { isPortalPageSlug } from "@/lib/portal-pages";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AdminPortalPageEditorPage({ params }: PageProps) {
  const user = await requireAdminPageUser();
  const { slug } = await params;

  if (!isPortalPageSlug(slug)) {
    notFound();
  }

  const page = await getPortalPageContent(slug);

  return (
    <>
      <AdminPortalPageEditor page={page} />
    </>
  );
}
