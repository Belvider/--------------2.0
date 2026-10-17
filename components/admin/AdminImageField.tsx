"use client";

import { useState } from "react";
import clsx from "clsx";
import { ChevronDown, ChevronUp, ImagePlus } from "lucide-react";
import type { AdminMediaFolder } from "@/lib/admin-media-config";
import { AdminMediaLibrary } from "@/components/admin/AdminMediaLibrary";

type AdminImageFieldProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  folder: AdminMediaFolder;
  placeholder?: string;
  helperText?: string;
  previewClassName?: string;
};

export function AdminImageField({
  label,
  value,
  onChange,
  folder,
  placeholder = "URL зображення",
  helperText,
  previewClassName
}: AdminImageFieldProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-3">
      {label ? <p className="text-sm font-medium text-slate-200">{label}</p> : null}

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div className="space-y-3">
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="focus-ring rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500"
          />

          {value ? (
            <div className={clsx("overflow-hidden rounded-[20px] border border-white/10 bg-[rgba(8,10,18,0.22)]", previewClassName)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="Попередній перегляд" className="h-44 w-full object-cover" />
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-ink lg:w-auto"
        >
          <ImagePlus className="size-4" aria-hidden="true" />
          {isOpen ? "Сховати бібліотеку" : "Медіабібліотека"}
          {isOpen ? <ChevronUp className="size-4" aria-hidden="true" /> : <ChevronDown className="size-4" aria-hidden="true" />}
        </button>
      </div>

      {helperText ? <p className="text-xs leading-6 text-slate-500">{helperText}</p> : null}

      {isOpen ? (
        <AdminMediaLibrary
          compact
          fixedFolder={folder}
          selectedUrl={value}
          onSelect={(nextUrl) => {
            onChange(nextUrl);
            setIsOpen(false);
          }}
          title="Вибір зображення"
          description="Можна швидко завантажити новий файл або обрати вже наявний з бібліотеки."
        />
      ) : null}
    </div>
  );
}
