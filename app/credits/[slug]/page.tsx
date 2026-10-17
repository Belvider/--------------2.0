import { notFound, redirect } from "next/navigation";
import { requireAuthPageUser } from "@/lib/guards";
import { getPortalModuleMapping } from "@/lib/queries";
import { isCreditPageSlug } from "@/lib/credit-pages";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CreditArticlePage({ params }: PageProps) {
  await requireAuthPageUser();
  const { slug } = await params;

  if (!isCreditPageSlug(slug)) {
    notFound();
  }

  const mapping = await getPortalModuleMapping();
  const moduleId = mapping[`credit-${slug}`];

  if (moduleId) {
    redirect(`/module/${moduleId}`);
  }

  notFound();
}
