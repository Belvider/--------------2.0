import { Prisma, QuestionType, Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { createAdminAuditLog, getRequestIpAddress } from "@/lib/admin-audit";
import { prisma } from "@/lib/prisma";
import { validateQuizQuestions, validateQuestionIds } from "@/lib/quiz-editor";
import { parseLearningGuide } from "@/lib/learning-guide";

class QuizQuestionInputError extends Error {
  constructor(message: string, readonly status = 400) { super(message); }
}

function learningGuideError(blocks: unknown, moduleId?: number) {
  if (!Array.isArray(blocks)) return "Блоки матеріалу мають бути списком.";
  const guides = blocks.filter(block => block !== null && typeof block === "object" && Object.hasOwn(block, "learningGuide"));
  if (guides.length > 1) return "Навчальний супровід має бути лише в одному блоці модуля.";
  if (guides.some(block => !parseLearningGuide(block.learningGuide, moduleId))) {
    return "Некоректний навчальний супровід: перевірте поля, джерела й переходи в межах модуля.";
  }
  if (moduleId === undefined && guides.some(block => {
    const guide = parseLearningGuide(block.learningGuide)!;
    return guide.route.length || guide.reference.length || guide.sources.some(source => source.anchors.length);
  })) return "Спершу створіть модуль, потім додайте переходи навчального супроводу в його редакторі.";
  return null;
}

const relativeOrAbsoluteUrlSchema = z.string().refine((value) => {
  if (value.startsWith("/")) {
    return true;
  }

  return z.string().url().safeParse(value).success;
}, "Некоректне посилання");

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildIntroHtml(title: string, description: string, introText?: string) {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const paragraphs = (introText ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll("\n", "<br />")}</p>`)
    .join("");

  return [
    "<h3>Ключові тези</h3>",
    `<p>Модуль <strong>${safeTitle}</strong> створено через адмін-панель і готовий до подальшого наповнення.</p>`,
    `<p>${safeDescription}</p>`,
    paragraphs || "<p>Додайте в цей блок ключові тези, аргументи продажу, типові сценарії консультації та важливі акценти для команди.</p>"
  ].join("");
}

function buildFactsItems(title: string, facts?: string[]) {
  const items = (facts ?? []).map((item) => item.trim()).filter(Boolean);

  if (items.length > 0) {
    return items;
  }

  return [
    `Почніть наповнення модуля «${title}» з ключових переваг продукту.`,
    "Додайте сценарії консультації, типові заперечення та підбір аксесуарів.",
    "Після базового наповнення можна окремо додати тестові питання."
  ];
}

function buildModuleTemplateContent(input: {
  title: string;
  description: string;
  categoryName: string;
  introText?: string;
  facts?: string[];
  videoUrl?: string;
  pdfUrl?: string;
  imageUrl?: string;
  imageCaption?: string;
}) {
  return [
    ...(input.videoUrl ? [{
      type: "video",
      title: `Відео-огляд: ${input.categoryName}`,
      provider: "youtube",
      url: input.videoUrl
    }] : []),
    {
      type: "text",
      title: "Що має знати продавець",
      html: buildIntroHtml(input.title, input.description, input.introText)
    },
    ...(input.imageUrl ? [{
      type: "image",
      title: "Візуальні акценти",
      url: input.imageUrl,
      caption: input.imageCaption?.trim() || "Базовий візуальний блок для стартового наповнення модуля"
    }] : []),
    {
      type: "facts",
      title: "Важливо знати",
      items: buildFactsItems(input.title, input.facts)
    },
    ...(input.pdfUrl ? [{
      type: "pdf",
      title: "Швидкий конспект",
      url: input.pdfUrl
    }] : [])
  ];
}

const createSchema = z.discriminatedUnion("entity", [
  z.object({
    entity: z.literal("brand"),
    name: z.string().min(2),
    slug: z.string().min(2),
    logoUrl: z.string().min(1),
    description: z.string().min(5)
  }),
  z.object({
    entity: z.literal("category"),
    brandId: z.number().int().positive(),
    name: z.string().min(2),
    slug: z.string().min(2),
    description: z.string().min(5)
  }),
  z.object({
    entity: z.literal("module"),
    categoryId: z.number().int().positive(),
    title: z.string().min(2),
    description: z.string().min(5),
    durationMin: z.number().int().min(1),
    contentBlocks: z.unknown().optional(),
    introText: z.string().min(10).optional(),
    facts: z.array(z.string().min(2)).optional(),
    videoUrl: z.string().url().optional(),
    pdfUrl: relativeOrAbsoluteUrlSchema.optional(),
    imageUrl: relativeOrAbsoluteUrlSchema.optional(),
    imageCaption: z.string().min(2).optional()
  })
]);

const singleQuestionSchema = z.object({
  id: z.number().int().positive().optional(),
  question: z.string().trim().min(2),
  type: z.literal(QuestionType.SINGLE),
  options: z.array(z.string().trim().min(1)).min(2),
  correctAnswer: z.object({
    index: z.number().int().min(0)
  })
});

const multipleQuestionSchema = z.object({
  id: z.number().int().positive().optional(),
  question: z.string().trim().min(2),
  type: z.literal(QuestionType.MULTIPLE),
  options: z.array(z.string().trim().min(1)).min(2),
  correctAnswer: z.object({
    indices: z.array(z.number().int().min(0)).min(1)
  })
});

const trueFalseQuestionSchema = z.object({
  id: z.number().int().positive().optional(),
  question: z.string().trim().min(2),
  type: z.literal(QuestionType.TRUE_FALSE),
  options: z.array(z.string().trim().min(1)).length(2),
  correctAnswer: z.object({
    value: z.boolean()
  })
});

const matchingQuestionSchema = z.object({
  id: z.number().int().positive().optional(),
  question: z.string().trim().min(2),
  type: z.literal(QuestionType.MATCHING),
  options: z.object({
    left: z.array(z.string().trim().min(1)).min(2),
    right: z.array(z.string().trim().min(1)).min(2)
  }),
  correctAnswer: z.record(z.number().int().min(0))
});

const adminQuizQuestionSchema = z.discriminatedUnion("type", [
  singleQuestionSchema,
  multipleQuestionSchema,
  trueFalseQuestionSchema,
  matchingQuestionSchema
]).superRefine((question, context) => {
  const error = validateQuizQuestions([question]);
  if (error) context.addIssue({ code: z.ZodIssueCode.custom, message: error });
});

const updateSchema = z.discriminatedUnion("entity", [
  z.object({
    entity: z.literal("brand"),
    id: z.number().int().positive(),
    name: z.string().min(2),
    slug: z.string().min(2),
    logoUrl: z.string().min(1),
    description: z.string().min(5),
    sortOrder: z.number().int().min(0).optional()
  }),
  z.object({
    entity: z.literal("category"),
    id: z.number().int().positive(),
    brandId: z.number().int().positive(),
    name: z.string().min(2),
    slug: z.string().min(2),
    description: z.string().min(5),
    sortOrder: z.number().int().min(0).optional()
  }),
  z.object({
    entity: z.literal("module"),
    id: z.number().int().positive(),
    categoryId: z.number().int().positive(),
    title: z.string().min(2),
    description: z.string().min(5),
    durationMin: z.number().int().min(1),
    sortOrder: z.number().int().min(0),
    isPublished: z.boolean(),
    contentBlocks: z.unknown(),
    questions: z.array(adminQuizQuestionSchema),
    deletedQuestionIds: z.array(z.number().int().positive()).default([])
  })
]);

const deleteSchema = z.object({
  entity: z.enum(["brand", "category", "module"]),
  id: z.number().int().positive()
});

export async function POST(request: Request) {
  const admin = await requireRole([Role.ADMIN]);
  if (!admin) {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Некоректні параметри" }, { status: 400 });
    }

    if (parsed.data.entity === "brand") {
      const maxSortOrder = await prisma.brand.aggregate({
        _max: { sortOrder: true }
      });

      const brand = await prisma.brand.create({
        data: {
          name: parsed.data.name,
          slug: parsed.data.slug,
          logoUrl: parsed.data.logoUrl,
          description: parsed.data.description,
          sortOrder: (maxSortOrder._max.sortOrder ?? 0) + 1
        }
      });

      await createAdminAuditLog({
        actorId: admin.id,
        action: "brand.create",
        targetType: "brand",
        targetId: brand.id,
        targetLabel: brand.name,
        summary: `Створено бренд «${brand.name}»`,
        ipAddress: getRequestIpAddress(request),
        details: {
          slug: brand.slug,
          sortOrder: brand.sortOrder
        }
      });

      return NextResponse.json({ brand });
    }

    if (parsed.data.entity === "category") {
      const maxSortOrder = await prisma.category.aggregate({
        where: { brandId: parsed.data.brandId },
        _max: { sortOrder: true }
      });

      const category = await prisma.category.create({
        data: {
          brandId: parsed.data.brandId,
          name: parsed.data.name,
          slug: parsed.data.slug,
          description: parsed.data.description,
          sortOrder: (maxSortOrder._max.sortOrder ?? 0) + 1
        }
      });

      await createAdminAuditLog({
        actorId: admin.id,
        action: "category.create",
        targetType: "category",
        targetId: category.id,
        targetLabel: category.name,
        summary: `Створено категорію «${category.name}»`,
        ipAddress: getRequestIpAddress(request),
        details: {
          brandId: category.brandId,
          slug: category.slug,
          sortOrder: category.sortOrder
        }
      });

      return NextResponse.json({ category });
    }

    if (parsed.data.contentBlocks !== undefined) {
      const guideError = learningGuideError(parsed.data.contentBlocks);
      if (guideError) return NextResponse.json({ error: guideError }, { status: 400 });
    }

    const category = await prisma.category.findUnique({
      where: { id: parsed.data.categoryId },
      select: {
        id: true,
        name: true
      }
    });

    if (!category) {
      return NextResponse.json({ error: "Категорію не знайдено" }, { status: 404 });
    }

    const maxSortOrder = await prisma.module.aggregate({
      where: { categoryId: parsed.data.categoryId },
      _max: { sortOrder: true }
    });

    const contentBlocks = parsed.data.contentBlocks
      ? JSON.parse(JSON.stringify(parsed.data.contentBlocks))
      : buildModuleTemplateContent({
          title: parsed.data.title,
          description: parsed.data.description,
          categoryName: category.name,
          introText: parsed.data.introText,
          facts: parsed.data.facts,
          videoUrl: parsed.data.videoUrl,
          pdfUrl: parsed.data.pdfUrl,
          imageUrl: parsed.data.imageUrl,
          imageCaption: parsed.data.imageCaption
        });

    const learningModule = await prisma.module.create({
      data: {
        categoryId: parsed.data.categoryId,
        title: parsed.data.title,
        description: parsed.data.description,
        durationMin: parsed.data.durationMin,
        isPublished: false,
        sortOrder: (maxSortOrder._max.sortOrder ?? 0) + 1,
        contentBlocks: contentBlocks as Prisma.InputJsonValue
      }
    });

    await createAdminAuditLog({
      actorId: admin.id,
      action: "module.create",
      targetType: "module",
      targetId: learningModule.id,
      targetLabel: learningModule.title,
      summary: `Створено чернетку модуля «${learningModule.title}»`,
      ipAddress: getRequestIpAddress(request),
      details: {
        categoryId: learningModule.categoryId,
        isPublished: learningModule.isPublished,
        sortOrder: learningModule.sortOrder
      }
    });

    return NextResponse.json({ module: learningModule });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Помилка збереження контенту" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const admin = await requireRole([Role.ADMIN]);
  if (!admin) {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  const url = new URL(request.url);
  const parsed = deleteSchema.safeParse({
    entity: url.searchParams.get("entity"),
    id: Number(url.searchParams.get("id"))
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Некоректні параметри" }, { status: 400 });
  }

  try {
    if (parsed.data.entity === "brand") {
      const previous = await prisma.brand.findUnique({
        where: { id: parsed.data.id },
        select: {
          id: true,
          name: true,
          slug: true,
          sortOrder: true
        }
      });

      await prisma.brand.delete({ where: { id: parsed.data.id } });

      await createAdminAuditLog({
        actorId: admin.id,
        action: "brand.delete",
        targetType: "brand",
        targetId: parsed.data.id,
        targetLabel: previous?.name ?? `brand:${parsed.data.id}`,
        summary: `Видалено бренд «${previous?.name ?? parsed.data.id}»`,
        ipAddress: getRequestIpAddress(request),
        details: previous
      });
    }

    if (parsed.data.entity === "category") {
      const previous = await prisma.category.findUnique({
        where: { id: parsed.data.id },
        select: {
          id: true,
          name: true,
          slug: true,
          brandId: true,
          sortOrder: true
        }
      });

      await prisma.category.delete({ where: { id: parsed.data.id } });

      await createAdminAuditLog({
        actorId: admin.id,
        action: "category.delete",
        targetType: "category",
        targetId: parsed.data.id,
        targetLabel: previous?.name ?? `category:${parsed.data.id}`,
        summary: `Видалено категорію «${previous?.name ?? parsed.data.id}»`,
        ipAddress: getRequestIpAddress(request),
        details: previous
      });
    }

    if (parsed.data.entity === "module") {
      const previous = await prisma.module.findUnique({
        where: { id: parsed.data.id },
        select: {
          id: true,
          title: true,
          categoryId: true,
          sortOrder: true
        }
      });

      await prisma.module.delete({ where: { id: parsed.data.id } });

      await createAdminAuditLog({
        actorId: admin.id,
        action: "module.delete",
        targetType: "module",
        targetId: parsed.data.id,
        targetLabel: previous?.title ?? `module:${parsed.data.id}`,
        summary: `Видалено модуль «${previous?.title ?? parsed.data.id}»`,
        ipAddress: getRequestIpAddress(request),
        details: previous
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Помилка видалення" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const admin = await requireRole([Role.ADMIN]);
  if (!admin) {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Некоректні параметри" }, { status: 400 });
    }

    if (parsed.data.entity === "brand") {
      const previous = await prisma.brand.findUnique({
        where: { id: parsed.data.id },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          sortOrder: true
        }
      });

      const brand = await prisma.brand.update({
        where: { id: parsed.data.id },
        data: {
          name: parsed.data.name,
          slug: parsed.data.slug,
          logoUrl: parsed.data.logoUrl,
          description: parsed.data.description,
          sortOrder: parsed.data.sortOrder
        }
      });

      await createAdminAuditLog({
        actorId: admin.id,
        action: "brand.update",
        targetType: "brand",
        targetId: brand.id,
        targetLabel: brand.name,
        summary: `Оновлено бренд «${brand.name}»`,
        ipAddress: getRequestIpAddress(request),
        details: {
          before: previous,
          after: {
            name: brand.name,
            slug: brand.slug,
            sortOrder: brand.sortOrder
          }
        }
      });

      return NextResponse.json({ brand });
    }

    if (parsed.data.entity === "category") {
      const previous = await prisma.category.findUnique({
        where: { id: parsed.data.id },
        select: {
          id: true,
          name: true,
          slug: true,
          brandId: true,
          description: true,
          sortOrder: true
        }
      });

      const category = await prisma.category.update({
        where: { id: parsed.data.id },
        data: {
          brandId: parsed.data.brandId,
          name: parsed.data.name,
          slug: parsed.data.slug,
          description: parsed.data.description,
          sortOrder: parsed.data.sortOrder
        }
      });

      await createAdminAuditLog({
        actorId: admin.id,
        action: "category.update",
        targetType: "category",
        targetId: category.id,
        targetLabel: category.name,
        summary: `Оновлено категорію «${category.name}»`,
        ipAddress: getRequestIpAddress(request),
        details: {
          before: previous,
          after: {
            name: category.name,
            slug: category.slug,
            brandId: category.brandId,
            sortOrder: category.sortOrder
          }
        }
      });

      return NextResponse.json({ category });
    }

    if (parsed.data.entity !== "module") {
      return NextResponse.json({ error: "Некоректна сутність" }, { status: 400 });
    }

    const moduleData = parsed.data;
    const guideError = learningGuideError(moduleData.contentBlocks, moduleData.id);
    if (guideError) return NextResponse.json({ error: guideError }, { status: 400 });

    const learningModule = await prisma.$transaction(async (tx) => {
      const previousModule = await tx.module.findUnique({
        where: { id: moduleData.id },
        select: {
          id: true,
          title: true,
          categoryId: true,
          durationMin: true,
          sortOrder: true,
          isPublished: true
        }
      });
      if (!previousModule) throw new QuizQuestionInputError("Модуль не знайдено", 404);
      const existingQuestions = await tx.quizQuestion.findMany({ where: { moduleId: moduleData.id }, select: { id: true } });
      const idError = validateQuestionIds(moduleData.questions, existingQuestions.map((question) => question.id), moduleData.deletedQuestionIds);
      if (idError) throw new QuizQuestionInputError(idError);

      const updatedModule = await tx.module.update({
        where: { id: moduleData.id },
        data: {
          categoryId: moduleData.categoryId,
          title: moduleData.title,
          description: moduleData.description,
          durationMin: moduleData.durationMin,
          sortOrder: moduleData.sortOrder,
          isPublished: moduleData.isPublished,
          contentBlocks: JSON.parse(JSON.stringify(moduleData.contentBlocks)) as Prisma.InputJsonValue
        }
      });

      if (moduleData.deletedQuestionIds.length) {
        await tx.quizQuestion.deleteMany({ where: { moduleId: moduleData.id, id: { in: moduleData.deletedQuestionIds } } });
      }
      const savedQuestions: Array<{ id: number }> = [];
      for (const [index, question] of moduleData.questions.entries()) {
        const data = {
          question: question.question, type: question.type,
          options: JSON.parse(JSON.stringify(question.options)) as Prisma.InputJsonValue,
          correctAnswer: JSON.parse(JSON.stringify(question.correctAnswer)) as Prisma.InputJsonValue,
          sortOrder: index + 1
        };
        savedQuestions.push(question.id === undefined
          ? await tx.quizQuestion.create({ data: { ...data, moduleId: moduleData.id }, select: { id: true } })
          : await tx.quizQuestion.update({ where: { id: question.id }, data, select: { id: true } }));
      }
      const currentQuestions = await tx.quizQuestion.findMany({ where: { moduleId: moduleData.id }, select: { id: true } });

      return {
        updatedModule,
        previousModule,
        savedQuestions,
        questionIds: currentQuestions.map((question) => question.id)
      };
    });

    await createAdminAuditLog({
      actorId: admin.id,
      action: "module.update",
      targetType: "module",
      targetId: learningModule.updatedModule.id,
      targetLabel: learningModule.updatedModule.title,
      summary: `Оновлено модуль «${learningModule.updatedModule.title}»`,
      ipAddress: getRequestIpAddress(request),
      details: {
        before: learningModule.previousModule,
        after: {
          categoryId: learningModule.updatedModule.categoryId,
          durationMin: learningModule.updatedModule.durationMin,
          sortOrder: learningModule.updatedModule.sortOrder,
          isPublished: learningModule.updatedModule.isPublished
        },
        questionsCount: learningModule.questionIds.length
      }
    });

    return NextResponse.json({ module: learningModule.updatedModule, questions: learningModule.savedQuestions, questionIds: learningModule.questionIds });
  } catch (error) {
    if (error instanceof QuizQuestionInputError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error(error);
    return NextResponse.json({ error: "Помилка оновлення контенту" }, { status: 500 });
  }
}
