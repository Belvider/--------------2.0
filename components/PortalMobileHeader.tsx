"use client";

import type { Role } from "@prisma/client";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { UserAvatar } from "@/components/UserAvatar";
import { SearchTrigger } from "@/components/SearchTrigger";

type PortalMobileHeaderProps = {
  user: {
    name: string;
    avatarUrl?: string | null;
    role: Role;
  };
};

export function PortalMobileHeader({ user }: PortalMobileHeaderProps) {
  return (
    <header className="portal-mobile-topbar">
      <BrandMark
        size="sm"
        className="!rounded-none !border-0 !bg-transparent !px-0 !py-0"
        imageClassName="!h-9 !w-auto"
      />
      <div className="flex items-center gap-2">
      <SearchTrigger compact />
      <Link
        href="/profile"
        className="focus-ring portal-mobile-topbar-avatar"
        aria-label="Профіль"
      >
        <UserAvatar
          name={user.name}
          avatarUrl={user.avatarUrl}
          size="sm"
          className="portal-profile-avatar"
        />
      </Link>
      </div>
    </header>
  );
}
