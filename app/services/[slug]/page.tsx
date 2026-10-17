import { notFound, redirect } from "next/navigation";
import { requireAuthPageUser } from "@/lib/guards";
import { getPortalModuleMapping } from "@/lib/queries";
import { isServicePageSlug } from "@/lib/service-pages";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ServiceArticlePage({ params }: PageProps) {
  await requireAuthPageUser();
  const { slug } = await params;

  if (!isServicePageSlug(slug)) {
    notFound();
  }

  const mapping = await getPortalModuleMapping();
  const moduleId = mapping[`service-${slug}`];

  if (moduleId) {
    redirect(`/module/${moduleId}`);
  }

  // Fallback — якщо модуль ще не створено
  notFound();
}
