import { Prisma, Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { createAdminAuditLog, getRequestIpAddress } from "@/lib/admin-audit";
import {
  getPortalPageSettingKey,
  parsePortalPageContent,
  portalCardIconKeys,
  portalPageSlugs
} from "@/lib/portal-pages";
import { prisma } from "@/lib/prisma";

const portalCardSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(2),
  icon: z.enum(portalCardIconKeys),
  text: z.string().optional().default(""),
  items: z.array(z.string()).optional().default([]),
  imageUrl: z.string().optional().default(""),
  imageAlt: z.string().optional().default(""),
  href: z.string().optional().default("")
});

const portalPageSchema = z.object({
  label: z.string().min(2),
  title: z.string().min(2),
  subtitle: z.string().min(5),
  sideLabel: z.string().min(2),
  sideText: z.string().min(5),
  cards: z.array(portalCardSchema).min(1)
});

const patchSchema = z.object({
  slug: z.enum(portalPageSlugs),
  content: portalPageSchema
});

export async function PATCH(request: Request) {
  const admin = await requireRole([Role.ADMIN]);
  if (!admin) {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = patchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Некоректні параметри сторінки" }, { status: 400 });
    }

    const content = parsePortalPageContent(parsed.data.slug, parsed.data.content);
    const key = getPortalPageSettingKey(parsed.data.slug);
    const existing = await prisma.appSetting.findUnique({
      where: { key }
    });

    await prisma.appSetting.upsert({
      where: { key },
      update: {
        value: JSON.parse(JSON.stringify(content)) as Prisma.InputJsonValue
      },
      create: {
        key,
        value: JSON.parse(JSON.stringify(content)) as Prisma.InputJsonValue
      }
    });

    await createAdminAuditLog({
      actorId: admin.id,
      action: "portal-page.update",
      targetType: "portal-page",
      targetId: parsed.data.slug,
      targetLabel: content.title,
      summary: `Оновлено сторінку порталу «${content.title}»`,
      ipAddress: getRequestIpAddress(request),
      details: {
        key,
        cardsCount: content.cards.length,
        hadPreviousVersion: Boolean(existing)
      }
    });

    return NextResponse.json({ content });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Не вдалося зберегти сторінку" }, { status: 500 });
  }
}
