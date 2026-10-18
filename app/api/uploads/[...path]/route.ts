import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getStoredUpload } from "@/lib/upload-storage";

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }

  const { path } = await context.params;
  const uploadKey = path.join("/");

  const file = await getStoredUpload(uploadKey);
  if (!file) {
    return NextResponse.json({ error: "Файл не знайдено" }, { status: 404 });
  }

  return new NextResponse(file.data, {
    status: 200,
    headers: {
      "content-type": file.contentType,
      "cache-control": "private, no-store",
      "x-content-type-options": "nosniff",
      "content-security-policy": "default-src 'none'; sandbox"
    }
  });
}
