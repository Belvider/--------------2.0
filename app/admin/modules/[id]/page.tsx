import { notFound } from "next/navigation";
import { AdminModuleEditor } from "@/components/admin/AdminModuleEditor";
import { requireAdminPageUser } from "@/lib/guards";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminModuleEditorPage({ params }: PageProps) {
  await requireAdminPageUser();
  const { id } = await params;
  const moduleId = Number(id);

  if (!Number.isSafeInteger(moduleId) || moduleId <= 0 || moduleId > 2147483647) {
    notFound();
  }

  const [learningModule, categories] = await Promise.all([
    prisma.module.findUnique({
      where: { id: moduleId },
      select: {
        id: true,
        title: true,
        description: true,
        durationMin: true,
        sortOrder: true,
        isPublished: true,
        categoryId: true,
        contentBlocks: true,
        questions: {
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            question: true,
            type: true,
            options: true,
            correctAnswer: true,
            sortOrder: true
          }
        }
      }
    }),
    prisma.category.findMany({
      orderBy: [{ brand: { sortOrder: "asc" } }, { sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        brand: {
          select: {
            name: true
          }
        }
      }
    })
  ]);

  if (!learningModule) {
    notFound();
  }

  return (
    <>
      <AdminModuleEditor
        module={learningModule}
        categories={categories.map((category) => ({
          id: category.id,
          name: category.name,
          brandName: category.brand.name
        }))}
      />
    </>
  );
}
