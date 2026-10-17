import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { createAdminAuditLog, getRequestIpAddress } from "@/lib/admin-audit";
import { deleteAdminMedia, listAdminMedia, saveAdminMedia } from "@/lib/admin-media";
import { adminMediaFolderValues, isAdminMediaFolder } from "@/lib/admin-media-config";

const deleteSchema = z.object({
  url: z.string().min(1)
});

export async function GET(request: Request) {
  const user = await requireRole([Role.ADMIN]);
  if (!user) {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const rawFolder = searchParams.get("folder");
    const folder = rawFolder === "all" || !rawFolder ? "all" : rawFolder;

    if (folder !== "all" && !isAdminMediaFolder(folder)) {
      return NextResponse.json({ error: "Некоректна папка" }, { status: 400 });
    }

    const items = await listAdminMedia(folder);

    return NextResponse.json({
      items,
      folders: adminMediaFolderValues
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Не вдалося завантажити медіафайли" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await requireRole([Role.ADMIN]);
  if (!user) {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Невірний формат запиту" }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const rawFolder = String(formData.get("folder") ?? "general");
    const folder = isAdminMediaFolder(rawFolder) ? rawFolder : "general";

    if (!file || typeof file !== "object" || !("arrayBuffer" in file) || !("type" in file) || !("size" in file)) {
      return NextResponse.json({ error: "Файл не вибрано" }, { status: 400 });
    }

    const item = await saveAdminMedia(file as File, folder);

    await createAdminAuditLog({
      actorId: user.id,
      action: "media.upload",
      targetType: "media",
      targetId: item.url,
      targetLabel: item.name,
      summary: `Завантажено файл «${item.name}» у папку ${item.folder}`,
      ipAddress: getRequestIpAddress(request),
      details: {
        folder: item.folder,
        size: item.size,
        url: item.url
      }
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Не вдалося завантажити файл" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const user = await requireRole([Role.ADMIN]);
  if (!user) {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = deleteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Некоректний файл для видалення" }, { status: 400 });
    }

    await deleteAdminMedia(parsed.data.url);

    await createAdminAuditLog({
      actorId: user.id,
      action: "media.delete",
      targetType: "media",
      targetId: parsed.data.url,
      targetLabel: parsed.data.url.split("/").pop() ?? parsed.data.url,
      summary: `Видалено медіафайл «${parsed.data.url.split("/").pop() ?? parsed.data.url}»`,
      ipAddress: getRequestIpAddress(request),
      details: {
        url: parsed.data.url
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Не вдалося видалити файл" },
      { status: 500 }
    );
  }
}
