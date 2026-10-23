import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { deleteUploadByUrl, saveUploadFile, UploadStorageConfigurationError } from "@/lib/upload-storage";
import { AVATAR_MIME_TYPES, getAvatarFileError, MAX_AVATAR_FILE_SIZE } from "@/lib/avatar-upload";

export const runtime = "nodejs";

async function cleanupOldAvatar(avatarUrl: string | null | undefined) {
  if (!avatarUrl) {
    return;
  }

  try {
    await deleteUploadByUrl(avatarUrl);
  } catch {
    // A committed profile update remains successful if old-file cleanup fails.
    console.warn("Avatar file cleanup failed.");
  }
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

    const contentLength = Number(request.headers.get("content-length"));
    if (Number.isFinite(contentLength) && contentLength > MAX_AVATAR_FILE_SIZE + 64 * 1024) {
      return NextResponse.json({ error: "Максимальний розмір фото — 4 МБ." }, { status: 413 });
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json({ error: "Не вдалося прочитати фото. Виберіть файл ще раз." }, { status: 400 });
    }
    const file = formData.get("avatar");

    if (!file || typeof file !== "object" || !("arrayBuffer" in file) || typeof file.arrayBuffer !== "function" || !("type" in file) || !("size" in file)) {
      return NextResponse.json({ error: "Файл не вибрано" }, { status: 400 });
    }

    const validationError = getAvatarFileError(file as File);
    if (validationError) return NextResponse.json({ error: validationError }, { status: file.size > MAX_AVATAR_FILE_SIZE ? 413 : 400 });
    const extension = AVATAR_MIME_TYPES.get(file.type)!;

    const previous = await prisma.user.findUnique({
      where: { id: user.id },
      select: { avatarUrl: true }
    });

    const fileName = `${user.id}-${randomUUID()}.${extension}`;
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

    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { avatarUrl }
      });
    } catch (error) {
      await cleanupOldAvatar(avatarUrl);
      throw error;
    }

    await cleanupOldAvatar(previous?.avatarUrl);

    return NextResponse.json({ avatarUrl });
  } catch (error) {
    console.error("Avatar upload failed.", error instanceof Error ? error.name : "UnknownError");
    return NextResponse.json(
      {
        error: error instanceof UploadStorageConfigurationError
          ? "Завантаження фото тимчасово недоступне. Повідомте адміністратора."
          : "Не вдалося оновити фото. Спробуйте ще раз."
      },
      { status: error instanceof UploadStorageConfigurationError ? 503 : 500 }
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
    console.error("Avatar removal failed.", error instanceof Error ? error.name : "UnknownError");
    return NextResponse.json(
      {
        error: "Не вдалося видалити фото. Спробуйте ще раз."
      },
      { status: 500 }
    );
  }
}
