import Link from "next/link";

export function ForgotPasswordForm() {
  return (
    <div className="auth-form">
      <p className="auth-message auth-message--info">
        Зверніться до адміністратора порталу або керівника вашого відділу. Повідомте email, з яким ви входите на сайт.
      </p>
      <p className="auth-inline-note">
        Адміністратор видасть новий пароль або одноразове посилання для зміни пароля. Автоматичне надсилання листів зараз не використовується.
      </p>
      <Link href="/login" className="auth-submit focus-ring inline-flex items-center justify-center">
        Повернутися до входу
      </Link>
    </div>
  );
}
