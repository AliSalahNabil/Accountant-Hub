import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
        Welcome back
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sign in to your accountant profile to bid on jobs and track your pipeline.
      </p>

      <div className="mt-6 rounded-xl border border-brand-200 bg-brand-50/60 p-4 text-sm">
        <p className="font-medium text-brand-800">Demo credentials</p>
        <p className="mt-1 text-brand-800/80">
          <span className="font-mono">accountant@demo.com</span> /{" "}
          <span className="font-mono">password123</span>
        </p>
      </div>

      <div className="mt-6">
        <LoginFormWrapper searchParams={searchParams} />
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        New to Accountant Hub?{" "}
        <Link href="/register" className="font-medium text-brand-700 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

async function LoginFormWrapper({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  const resolved = (await searchParams) ?? {};
  return <LoginForm next={resolved.next} />;
}
