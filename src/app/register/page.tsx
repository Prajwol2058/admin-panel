import { RegisterForm } from "@/components/auth/register-form";
import React from "react";

function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <RegisterForm />
    </div>
  );
}

export default RegisterPage;
