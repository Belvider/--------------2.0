import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

type BrandMarkProps = {
  href?: Route;
  className?: string;
  imageClassName?: string;
  size?: "sm" | "md" | "lg" | "xl";
};

const sizeMap = {
  sm: { width: 180, height: 64, className: "h-14 w-auto" },
  md: { width: 220, height: 76, className: "h-16 w-auto sm:h-[72px]" },
  lg: { width: 260, height: 90, className: "h-[72px] w-auto sm:h-[84px]" },
  xl: { width: 357, height: 124, className: "h-[92px] w-auto sm:h-[106px] lg:h-[118px]" }
} as const;

export function BrandMark({ href = "/dashboard", className = "", imageClassName = "", size = "md" }: BrandMarkProps) {
  const config = sizeMap[size];

  return (
    <Link
      href={href}
      className={`focus-ring inline-flex shrink-0 items-center justify-center rounded-[24px] px-3 py-2 ${className}`.trim()}
      aria-label="PineApple"
    >
      <Image
        src="/branding/pineapple-logo.png"
        alt="PineApple"
        width={config.width}
        height={config.height}
        sizes={`${config.width}px`}
        priority
        unoptimized
        className={`${config.className} block object-contain object-center ${imageClassName}`.trim()}
      />
    </Link>
  );
}
