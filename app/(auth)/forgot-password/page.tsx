import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { AuthShell } from "@/components/auth/AuthShell";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Відновлення пароля"
      subtitle="Доступ відновлює адміністратор порталу."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
