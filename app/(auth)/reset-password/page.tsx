import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthShell title="Новий пароль" subtitle="Оновіть доступ до акаунта і поверніться до роботи в навчальному просторі.">
      <Suspense fallback={<div className="skeleton h-28 rounded-xl" />}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
