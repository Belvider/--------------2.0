import { RegisterForm } from "@/components/auth/RegisterForm";
import { AuthShell } from "@/components/auth/AuthShell";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Реєстрація"
      subtitle="Створіть профіль співробітника, щоб підключити його до магазину, відділу і маршруту навчання."
    >
      <RegisterForm />
    </AuthShell>
  );
}
