import { NextResponse } from "next/server";
import { getStoredUpload } from "@/lib/upload-storage";

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
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
      "cache-control": "public, max-age=31536000, immutable",
      "x-content-type-options": "nosniff",
      "content-security-policy": "default-src 'none'; sandbox"
    }
  });
}
