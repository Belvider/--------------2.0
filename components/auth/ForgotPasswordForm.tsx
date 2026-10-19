import Link from "next/link";

export function ForgotPasswordForm() {
  const contact = process.env.PASSWORD_RESET_SUPPORT_CONTACT?.trim();

  return (
    <div className="auth-form">
      <p className="auth-message auth-message--info">
        Зверніться до адміністратора порталу або керівника вашого відділу. Повідомте email, з яким ви входите на сайт.
      </p>
      {contact ? <p className="auth-inline-note">Контакт для відновлення доступу: {contact}</p> : null}
      <p className="auth-inline-note">
        Адміністратор видасть новий пароль або одноразове посилання для зміни пароля. Автоматичне надсилання листів зараз не використовується.
      </p>
      <Link href="/login" className="auth-submit focus-ring inline-flex items-center justify-center">
        Повернутися до входу
      </Link>
    </div>
  );
}
