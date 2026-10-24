import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, PencilLine, ShieldCheck } from "lucide-react";
import { LearningProfile } from "@/components/profile/LearningProfile";
import { requireAdminPageUser } from "@/lib/guards";
import { getProfileData } from "@/lib/queries";

export const metadata: Metadata = { title: "Навчальний профіль | Адміністрування" };

export default async function AdminLearningProfilePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPageUser();
  const { id } = await params;
  const profile = await getProfileData(id);
  if (!profile.user) notFound();

  return <>
    <section className="card flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm sm:px-5" aria-label="Перегляд профілю адміністратором">
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/admin/users" className="focus-ring inline-flex items-center gap-2 rounded-lg text-slate-300 hover:text-white"><ArrowLeft className="size-4" aria-hidden="true" />До користувачів</Link>
        <span className="inline-flex items-center gap-2 text-xs text-[#b6a0df]"><ShieldCheck className="size-3.5" aria-hidden="true" />Перегляд для аналізу</span>
      </div>
      <Link href={`/admin/users/${id}#profile-data`} className="focus-ring inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/5"><PencilLine className="size-3.5" aria-hidden="true" />Редагувати дані</Link>
    </section>
    <LearningProfile profile={profile} isOwnProfile={false} />
  </>;
}
