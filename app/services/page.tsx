import { PortalContentPage } from "@/components/portal/PortalContentPage";
import { requireAuthPageUser } from "@/lib/guards";
import { getPortalModuleMapping, getPortalPageContent } from "@/lib/queries";

function enrichHrefs(
  cards: Array<{ href?: string; [key: string]: unknown }>,
  mapping: Record<string, number>
) {
  return cards.map((card) => {
    if (!card.href) return card;
    const match = (card.href as string).match(/^\/services\/(.+)$/);
    if (!match) return card;
    const slug = `service-${match[1]}`;
    const moduleId = mapping[slug];
    return moduleId ? { ...card, href: `/module/${moduleId}` } : card;
  });
}

export default async function ServicesPage() {
  const user = await requireAuthPageUser();
  const [content, mapping] = await Promise.all([
    getPortalPageContent("services"),
    getPortalModuleMapping()
  ]);

  const enrichedContent = {
    ...content,
    cards: enrichHrefs(content.cards as never, mapping) as typeof content.cards
  };

  return <PortalContentPage user={user} content={enrichedContent} />;
}
