import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { deleteUploadByUrl, saveUploadFile } from "@/lib/upload-storage";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"]
]);

async function cleanupOldAvatar(avatarUrl: string | null | undefined) {
  if (!avatarUrl) {
    return;
  }

  await deleteUploadByUrl(avatarUrl);
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
    }

    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Невірний формат запиту" }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get("avatar");

    if (!file || typeof file !== "object" || !("arrayBuffer" in file) || !("type" in file) || !("size" in file)) {
      return NextResponse.json({ error: "Файл не вибрано" }, { status: 400 });
    }

    const extension = ALLOWED_TYPES.get(file.type as string);

    if (!extension) {
      return NextResponse.json({ error: "Підтримуються лише JPG, PNG, WEBP або AVIF" }, { status: 400 });
    }

    if ((file.size as number) > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Максимальний розмір фото — 5 МБ" }, { status: 400 });
    }

    const previous = await prisma.user.findUnique({
      where: { id: user.id },
      select: { avatarUrl: true }
    });

    const fileName = `${user.id}-${Date.now()}.${extension}`;
    const savedAvatar = await saveUploadFile({
      key: `avatars/${fileName}`,
      file: file as File,
      metadata: {
        kind: "avatar",
        size: file.size as number,
        updatedAt: new Date().toISOString(),
        originalName: "avatar"
      }
    });

    const avatarUrl = savedAvatar.url;

    await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl }
    });

    await cleanupOldAvatar(previous?.avatarUrl);

    return NextResponse.json({ avatarUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Не вдалося оновити фото",
        detail: process.env.NODE_ENV === "production" ? undefined : error instanceof Error ? error.message : "unknown"
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
    }

    const previous = await prisma.user.findUnique({
      where: { id: user.id },
      select: { avatarUrl: true }
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl: null }
    });

    await cleanupOldAvatar(previous?.avatarUrl);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Не вдалося видалити фото",
        detail: process.env.NODE_ENV === "production" ? undefined : error instanceof Error ? error.message : "unknown"
      },
      { status: 500 }
    );
  }
}
