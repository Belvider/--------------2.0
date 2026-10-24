import Link from "next/link";
import { PencilLine } from "lucide-react";
import { LearningProfile } from "@/components/profile/LearningProfile";
import { PortalShell } from "@/components/PortalShell";
import { requireAuthPageUser } from "@/lib/guards";
import { getProfileData } from "@/lib/queries";

export default async function ProfilePage() {
  const currentUser = await requireAuthPageUser();
  const profile = await getProfileData(currentUser.id);
  if (!profile.user) return null;

  return <PortalShell user={currentUser}>
    {currentUser.role === "ADMIN" && <div className="flex flex-wrap justify-end gap-2">
      <Link href="/admin/users" className="focus-ring inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5">Профілі користувачів</Link>
      <Link href={`/admin/users/${currentUser.id}#profile-data`} className="focus-ring inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/5"><PencilLine className="size-3.5" aria-hidden="true" />Редагувати мої дані</Link>
    </div>}
    <LearningProfile profile={profile} />
  </PortalShell>;
}
