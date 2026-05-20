import Link from "next/link";

import { Logo } from "@/components/layout/logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-ink text-stone-300">
      <div className="container-page py-12 grid gap-10 md:grid-cols-3">
        <div>
          <div className="text-white">
            <Logo className="text-white" />
          </div>
          <p className="mt-3 text-sm text-stone-400 max-w-xs">
            The hub where talented accountants find serious accounting work and clients find the right experts.
          </p>
        </div>

        <div className="grid gap-2 text-sm">
          <p className="text-stone-500 uppercase text-xs tracking-wider mb-1">For Accountants</p>
          <Link href="/jobs" className="hover:text-white">
            Browse jobs
          </Link>
          <Link href="/register" className="hover:text-white">
            Create an account
          </Link>
          <Link href="/dashboard" className="hover:text-white">
            My dashboard
          </Link>
        </div>

        <div className="grid gap-2 text-sm">
          <p className="text-stone-500 uppercase text-xs tracking-wider mb-1">Legal</p>
          <span className="text-stone-400">Terms of Service</span>
          <span className="text-stone-400">Privacy Policy</span>
          <span className="text-stone-400">Cookie Policy</span>
        </div>
      </div>
      <div className="border-t border-stone-800">
        <div className="container-page py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500">
          <span>© {new Date().getFullYear()} Accountant Hub. All rights reserved.</span>
          <span>Built as a demo project.</span>
        </div>
      </div>
    </footer>
  );
}
