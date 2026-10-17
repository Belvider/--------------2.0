import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ModuleContentBlock, ModuleCatalogProduct } from "@/lib/module-content";

export type SearchResultType = "brand" | "category" | "module" | "product";

export type SearchResult = {
  type: SearchResultType;
  id: string | number;
  title: string;
  subtitle: string;
  meta?: string;
  href: string;
};

function extractProducts(contentBlocks: unknown): ModuleCatalogProduct[] {
  if (!Array.isArray(contentBlocks)) return [];
  const products: ModuleCatalogProduct[] = [];
  for (const block of contentBlocks as ModuleContentBlock[]) {
    if (block.type === "productCatalog" && Array.isArray(block.products)) {
      products.push(...block.products);
    }
  }
  return products;
}

function matchProduct(product: ModuleCatalogProduct, q: string): boolean {
  const normalized = q.toLowerCase();
  if (product.title.toLowerCase().includes(normalized)) return true;
  if (product.family?.toLowerCase().includes(normalized)) return true;
  if (product.summary?.toLowerCase().includes(normalized)) return true;
  if (product.overview.some((o) => o.toLowerCase().includes(normalized))) return true;
  if (product.highlights.some((h) => h.toLowerCase().includes(normalized))) return true;
  if (product.colors.some((c) => c.label.toLowerCase().includes(normalized))) return true;
  return false;
}

export async function GET(request: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (!q || q.length < 2) return NextResponse.json([]);

  const results: SearchResult[] = [];

  // 1. Бренди
  const brands = await prisma.brand.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } }
      ]
    },
    take: 3,
    orderBy: { sortOrder: "asc" }
  });

  for (const brand of brands) {
    results.push({
      type: "brand",
      id: brand.id,
      title: brand.name,
      subtitle: brand.description ?? "Брендовий розділ",
      href: `/brands/${brand.slug}`
    });
  }

  // 2. Категорії
  const categories = await prisma.category.findMany({
    where: { name: { contains: q, mode: "insensitive" } },
    take: 3,
    include: { brand: { select: { name: true, slug: true } } }
  });

  for (const cat of categories) {
    results.push({
      type: "category",
      id: cat.id,
      title: cat.name,
      subtitle: `${cat.brand.name} · категорія`,
      href: `/brands/${cat.brand.slug}/${cat.slug}`
    });
  }

  // 3. Модулі (за назвою та описом)
  const modules = await prisma.module.findMany({
    where: {
      isPublished: true,
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } }
      ]
    },
    take: 6,
    orderBy: { createdAt: "desc" },
    include: {
      category: { include: { brand: { select: { name: true, slug: true } } } }
    }
  });

  const moduleIds = new Set<number>();

  for (const mod of modules) {
    moduleIds.add(mod.id);
    results.push({
      type: "module",
      id: mod.id,
      title: mod.title,
      subtitle: `${mod.category.brand.name} · ${mod.category.name}`,
      meta: `${mod.durationMin} хв`,
      href: `/module/${mod.id}`
    });
  }

  // 4. Продукти всередині contentBlocks (iPhone 17 Pro Max, Dyson Airwrap тощо)
  // PostgreSQL text search на JSON полі
  type RawModuleRow = { id: number; title: string; category_id: number; content_blocks: unknown };
  const candidateModules = await prisma.$queryRaw<RawModuleRow[]>`
    SELECT id, title, category_id, content_blocks
    FROM modules
    WHERE is_published = true
      AND content_blocks::text ILIKE ${`%${q}%`}
    LIMIT 15
  `;

  // Завантажуємо category + brand для кандидатів
  const catIds = [...new Set(candidateModules.map((m) => m.category_id))];
  const categoryMap = catIds.length > 0
    ? await prisma.category.findMany({
        where: { id: { in: catIds } },
        include: { brand: { select: { name: true, slug: true } } }
      })
    : [];
  const catById = new Map(categoryMap.map((c) => [c.id, c]));

  for (const mod of candidateModules) {
    if (moduleIds.has(mod.id)) continue; // вже доданий як модуль

    const products = extractProducts(mod.content_blocks);
    const matched = products.filter((p) => matchProduct(p, q));

    if (matched.length === 0) continue;

    const cat = catById.get(mod.category_id);
    const brandName = cat?.brand.name ?? "";
    const brandSlug = cat?.brand.slug ?? "";

    // Додаємо модуль один раз (навіть якщо кілька продуктів збігаються)
    moduleIds.add(mod.id);

    if (matched.length === 1) {
      // Конкретна модель
      const p = matched[0];
      const year = p.title.match(/\((\d{4})\)/)?.[1];
      results.push({
        type: "product",
        id: `${mod.id}-${p.slug}`,
        title: p.title,
        subtitle: `${brandName} · ${mod.title}`,
        meta: year ?? (p.family ?? undefined),
        href: `/module/${mod.id}#${p.slug}`
      });
    } else {
      // Кілька моделей — посилання на модуль
      results.push({
        type: "module",
        id: mod.id,
        title: mod.title,
        subtitle: `${brandName}${cat ? ` · ${cat.name}` : ""} · ${matched.length} моделей`,
        href: `/module/${mod.id}`
      });
    }
  }

  // Обмежуємо загальну кількість результатів
  return NextResponse.json(results.slice(0, 14));
}
