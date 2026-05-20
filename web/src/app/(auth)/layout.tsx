import Link from "next/link";

import { Logo } from "@/components/layout/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex min-h-[calc(100vh-4rem)]">
      <aside className="hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col justify-between bg-ink text-white p-12">
        <div>
          <div className="text-white">
            <Logo className="text-white" />
          </div>
        </div>
        <div className="space-y-6 max-w-md">
          <blockquote className="text-2xl xl:text-3xl font-medium leading-tight text-balance">
            “Within a week of joining Accountant Hub, I landed a recurring
            bookkeeping client. The platform makes serious accounting work
            actually findable.”
          </blockquote>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand font-semibold">
              MR
            </span>
            <div>
              <p className="font-semibold">Mariam Rashed</p>
              <p className="text-sm text-stone-400">Senior Bookkeeper</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-stone-500">
          © {new Date().getFullYear()} Accountant Hub
        </p>
      </aside>

      <section className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-gradient-to-b from-stone-50 to-white">
        <div className="w-full max-w-md">
          {children}
          <p className="mt-8 text-center text-xs text-muted-foreground">
            By continuing you agree to our{" "}
            <Link href="#" className="underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
