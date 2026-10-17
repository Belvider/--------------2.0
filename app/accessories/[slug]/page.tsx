import { notFound, redirect } from "next/navigation";
import { requireAuthPageUser } from "@/lib/guards";
import { getPortalModuleMapping } from "@/lib/queries";
import { isAccessoryPageSlug } from "@/lib/accessory-pages";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AccessoryArticlePage({ params }: PageProps) {
  await requireAuthPageUser();
  const { slug } = await params;

  if (!isAccessoryPageSlug(slug)) {
    notFound();
  }

  const mapping = await getPortalModuleMapping();
  const moduleId = mapping[`accessory-${slug}`];

  if (moduleId) {
    redirect(`/module/${moduleId}`);
  }

  notFound();
}
