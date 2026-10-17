import type { ReactNode } from "react";
import { BrandMark } from "@/components/BrandMark";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  showTitleBlock?: boolean;
  centeredKicker?: string | null;
  cardVariant?: "default" | "narrow";
};

export function AuthShell({
  title,
  subtitle,
  children,
  showTitleBlock = true,
  centeredKicker = null,
  cardVariant = "default"
}: AuthShellProps) {
  return (
    <main className="auth-shell px-4 py-10">
      <section className="auth-stage auth-stage--minimal">
        <section className="auth-showcase auth-showcase--logo-only" aria-label="PineApple">
          <BrandMark
            href="/login"
            size="xl"
            className="auth-brand-link auth-brand-link--hero !rounded-none !px-0 !py-0"
            imageClassName="translate-x-0"
          />
        </section>

        <section className={`card auth-card ${cardVariant === "narrow" ? "auth-card--narrow" : ""}`.trim()}>
          {centeredKicker ? (
            <div className="auth-card-head auth-card-head--compact auth-card-head--centered">
              <span className="portal-kicker auth-card-kicker-only">{centeredKicker}</span>
            </div>
          ) : null}

          {showTitleBlock ? (
            <div className="auth-card-head">
              <span className="portal-kicker">PineApple Portal</span>
              <h1 className="auth-card-title">{title}</h1>
              <p className="auth-card-subtitle">{subtitle}</p>
            </div>
          ) : null}

          <div className="auth-card-body">{children}</div>
        </section>
      </section>
    </main>
  );
}
