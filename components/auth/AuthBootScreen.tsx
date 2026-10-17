import { BrandMark } from "@/components/BrandMark";

type AuthBootScreenProps = {
  eyebrow?: string;
  title?: string;
  text?: string;
};

export function AuthBootScreen({
  eyebrow = "PineApple Portal",
  title = "Запускаємо навчальний портал",
  text = "Готуємо безпечний вхід, брендований простір навчання і ваш персональний маршрут усередині системи."
}: AuthBootScreenProps) {
  return (
    <main className="auth-boot-screen">
      <div className="auth-boot-orb auth-boot-orb--left" aria-hidden="true" />
      <div className="auth-boot-orb auth-boot-orb--right" aria-hidden="true" />

      <section className="auth-boot-panel card">
        <div className="auth-boot-brand">
          <BrandMark href="/login" size="lg" className="auth-brand-link" />
        </div>

        <div className="auth-boot-copy">
          <span className="portal-chip auth-boot-eyebrow">{eyebrow}</span>
          <h1 className="auth-boot-title">{title}</h1>
          <p className="auth-boot-text">{text}</p>
        </div>

        <div className="auth-boot-loader" aria-label="Завантаження">
          <span className="auth-boot-loader-dot" />
          <span className="auth-boot-loader-dot" />
          <span className="auth-boot-loader-dot" />
        </div>
      </section>
    </main>
  );
}
