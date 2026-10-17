import { ImagePlus } from "lucide-react";
import { AdminMediaLibrary } from "@/components/admin/AdminMediaLibrary";
import { requireAdminPageUser } from "@/lib/guards";

export default async function AdminMediaPage() {
  const user = await requireAdminPageUser();

  return (
    <>
      <section className="card relative overflow-hidden px-5 py-6 sm:px-6 sm:py-7 xl:px-8 xl:py-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(40,178,158,0.16),transparent_28%),linear-gradient(145deg,rgba(255,255,255,0.04),transparent_52%)]" />
        <div className="relative flex flex-wrap items-start justify-between gap-5">
          <div>
            <span className="portal-chip">Адмін-інструменти</span>
            <h1 className="portal-page-title mt-4">Медіабібліотека</h1>
            <p className="portal-subtitle mt-3 max-w-3xl">
              Єдина точка для завантаження, перегляду та повторного використання зображень у брендах, модулях і сторінках порталу.
            </p>
          </div>
          <div className="inline-flex size-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
            <ImagePlus className="size-6 text-[color:var(--brand-strong)]" aria-hidden="true" />
          </div>
        </div>
      </section>

      <AdminMediaLibrary />
    </>
  );
}
