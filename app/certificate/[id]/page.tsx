import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Award, CheckCircle2, GraduationCap, Printer, Share2, ShieldCheck } from "lucide-react";
import { CertificateActions } from "@/components/CertificateActions";
import { requireAuthPageUser } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/ui";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CertificatePage({ params }: PageProps) {
  const currentUser = await requireAuthPageUser();
  const { id } = await params;
  const certId = Number(id);

  if (!Number.isSafeInteger(certId) || certId <= 0 || certId > 2147483647) notFound();

  const certificate = await prisma.certificate.findFirst({
    where: { id: certId, userId: currentUser.id },
    include: {
      user: {
        select: {
          name: true,
          firstName: true,
          lastName: true,
          position: true,
          department: true
        }
      },
      module: {
        include: {
          category: {
            include: { brand: true }
          }
        }
      }
    }
  });

  if (!certificate) notFound();

  const displayName = certificate.user.firstName && certificate.user.lastName
    ? `${certificate.user.lastName} ${certificate.user.firstName}`
    : certificate.user.name;

  return (
    <div className="certificate-page min-h-screen bg-[var(--bg)] px-4 py-8 sm:px-6 sm:py-12">
      {/* Кнопка "Назад" */}
      <div className="mx-auto max-w-2xl print:hidden">
        <Link
          href="/profile"
          className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5 text-sm text-slate-600 transition hover:text-white"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          До профілю
        </Link>
      </div>

      {/* Сертифікат */}
      <div className="mx-auto mt-6 max-w-2xl">
        <div className="certificate-content overflow-hidden rounded-[20px] border border-[rgba(40,178,158,0.25)] bg-[rgba(15,11,23,0.96)] shadow-[0_24px_60px_rgba(0,0,0,0.4),0_0_0_1px_rgba(40,178,158,0.1)_inset]">

          {/* Верхня смуга */}
          <div className="h-1.5 bg-[linear-gradient(90deg,rgba(40,178,158,0.8),rgba(138,242,223,0.9),rgba(40,178,158,0.8))]" />

          <div className="px-8 py-10 sm:px-12 sm:py-14 text-center">

            {/* Логотип + мітка */}
            <div className="flex items-center justify-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-[12px] border border-[rgba(40,178,158,0.3)] bg-[rgba(40,178,158,0.12)]">
                <Award className="size-6 text-[color:var(--brand-strong)]" aria-hidden="true" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[color:var(--brand-strong)]">PineApple</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Learning Portal</p>
              </div>
            </div>

            {/* Заголовок */}
            <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
              Сертифікат про проходження
            </p>

            {/* Ім'я */}
            <h1 className="mt-4 font-[var(--font-heading)] text-[2.2rem] font-semibold leading-tight tracking-[-0.04em] text-white sm:text-[2.8rem]">
              {displayName}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {certificate.user.position}{certificate.user.department ? ` · ${certificate.user.department}` : ""}
            </p>

            {/* Роздільник */}
            <div className="my-8 flex items-center gap-4">
              <div className="flex-1 border-t border-white/[0.07]" />
              <GraduationCap className="size-5 text-[color:var(--brand-strong)]" aria-hidden="true" />
              <div className="flex-1 border-t border-white/[0.07]" />
            </div>

            {/* Модуль */}
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
              Успішно завершив(ла) модуль
            </p>
            <h2 className="mt-3 font-[var(--font-heading)] text-xl font-semibold tracking-[-0.02em] text-white sm:text-2xl">
              {certificate.module.title}
            </h2>
            <p className="mt-2 text-sm text-[color:var(--brand-strong)]">
              {certificate.module.category.brand.name} · {certificate.module.category.name}
            </p>

            {/* Дата */}
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-[rgba(40,178,158,0.2)] bg-[rgba(40,178,158,0.07)] px-5 py-2.5">
              <CheckCircle2 className="size-4 text-[color:var(--brand-strong)]" aria-hidden="true" />
              <p className="text-sm font-semibold text-white">
                {formatDate(certificate.issuedAt)}
              </p>
            </div>

            {/* Нижній роздільник */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex-1 border-t border-white/[0.07]" />
              <ShieldCheck className="size-4 text-slate-500" aria-hidden="true" />
              <div className="flex-1 border-t border-white/[0.07]" />
            </div>

            {/* Підпис */}
            <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-600">
              PineApple Retail · Внутрішній навчальний портал
            </p>
            <p className="mt-1 text-[10px] text-slate-600">
              Сертифікат #{certId.toString().padStart(6, "0")}
            </p>
          </div>

          {/* Нижня смуга */}
          <div className="h-1.5 bg-[linear-gradient(90deg,rgba(40,178,158,0.8),rgba(138,242,223,0.9),rgba(40,178,158,0.8))]" />
        </div>

        {/* Дії */}
        <div className="mt-6 flex flex-wrap justify-center gap-3 print:hidden">
          <Link
            href="/profile"
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.04]"
          >
            До профілю
          </Link>
          <CertificateActions certId={certId} title={certificate.module.title} />
          <Link
            href="/brands"
            className="focus-ring bg-ink inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
          >
            Продовжити навчання
            <ArrowLeft className="size-4 rotate-180" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
