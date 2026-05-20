import type { Metadata } from "next";
import Link from "next/link";

import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Create account",
};

export default function RegisterPage() {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
        Create your accountant profile
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        It only takes a minute. Start applying to accounting jobs today.
      </p>

      <div className="mt-6">
        <RegisterForm />
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand-700 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
