import { getAdminPortalPages } from "@/lib/queries";
import { prisma } from "@/lib/prisma";

export async function fetchAdminConsoleData() {
  const [users, brandsRaw, portalPages] = await Promise.all([
    prisma.user.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        position: true,
        store: true,
        isActive: true,
        createdAt: true,
        _count: { select: { progresses: true, attempts: true } }
      }
    }),
    prisma.brand.findMany({
      where: { slug: { notIn: ["pineapple-academy"] } },
      orderBy: { sortOrder: "asc" },
      include: {
        categories: {
          orderBy: { sortOrder: "asc" },
          include: {
            _count: { select: { modules: true } },
            modules: {
              orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
              select: {
                id: true,
                title: true,
                description: true,
                durationMin: true,
                sortOrder: true,
                isPublished: true,
                createdAt: true
              }
            }
          }
        }
      }
    }),
    getAdminPortalPages()
  ]);

  const brandRows = brandsRaw.map((brand) => ({
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    logoUrl: brand.logoUrl,
    description: brand.description,
    sortOrder: brand.sortOrder,
    categoryCount: brand.categories.length,
    moduleCount: brand.categories.reduce(
      (sum: number, cat: { _count: { modules: number } }) => sum + cat._count.modules,
      0
    ),
    categories: brand.categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      sortOrder: cat.sortOrder,
      modulesCount: cat._count.modules,
      modules: cat.modules.map((learningModule) => ({
        ...learningModule,
        createdAt: learningModule.createdAt.toISOString()
      }))
    }))
  }));

  return {
    users: users.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() })),
    brandRows,
    portalPages
  };
}
