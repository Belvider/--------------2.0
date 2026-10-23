import Image from "next/image";

type UserAvatarProps = {
  name: string;
  avatarUrl?: string | null;
  className?: string;
  imageClassName?: string;
  initialsClassName?: string;
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: "h-11 w-11",
  md: "h-16 w-16",
  lg: "h-24 w-24"
} as const;

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function UserAvatar({
  name,
  avatarUrl,
  className = "",
  imageClassName = "",
  initialsClassName = "",
  size = "md"
}: UserAvatarProps) {
  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))] ${sizeMap[size]} ${className}`.trim()}
    >
      {avatarUrl ? (
        <Image src={avatarUrl} alt={name} fill sizes="96px" unoptimized={avatarUrl.startsWith("/uploads/") || avatarUrl.startsWith("/api/uploads/")} className={`object-cover ${imageClassName}`.trim()} />
      ) : (
        <span
          className={`font-[var(--font-heading)] text-sm font-semibold uppercase tracking-[0.08em] text-white/88 ${initialsClassName}`.trim()}
        >
          {getInitials(name)}
        </span>
      )}
    </div>
  );
}
