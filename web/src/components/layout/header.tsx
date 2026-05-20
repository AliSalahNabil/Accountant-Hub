"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Menu, User as UserIcon, X } from "lucide-react";
import { toast } from "sonner";

import { Logo } from "@/components/layout/logo";
import { useAuth } from "@/lib/auth-context";
import { cn, initials } from "@/lib/utils";

const navLinks = [
  { href: "/jobs", label: "Browse Jobs" },
  { href: "/dashboard", label: "My Dashboard", requiresAuth: true },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, status, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out successfully");
    setMenuOpen(false);
    router.push("/jobs");
  };

  const visibleLinks = navLinks.filter((l) => !l.requiresAuth || status === "authenticated");

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-white/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden md:flex items-center gap-1">
            {visibleLinks.map((link) => {
              const active = pathname === link.href || pathname?.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-muted-foreground hover:bg-muted hover:text-ink",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {status === "loading" ? (
            <div className="h-9 w-24 animate-pulse rounded-md bg-stone-100" />
          ) : status === "authenticated" && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-border bg-white px-2 py-1.5 text-sm hover:bg-muted"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
                  {initials(user.name)}
                </span>
                <span className="hidden sm:inline pr-1 font-medium text-ink">{user.name.split(" ")[0]}</span>
              </button>
              {menuOpen ? (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(false)}
                    aria-label="Close menu"
                  />
                  <div className="absolute right-0 z-20 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-white shadow-lg">
                    <div className="border-b border-border p-3">
                      <p className="text-sm font-semibold text-ink">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-muted"
                    >
                      <UserIcon className="h-4 w-4" />
                      My Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 border-t border-border px-3 py-2.5 text-sm text-danger hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-ink hover:bg-muted"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="inline-flex h-9 items-center rounded-md bg-brand px-4 text-sm font-medium text-white shadow-sm hover:bg-brand-600"
              >
                Get started
              </Link>
            </div>
          )}

          <button
            type="button"
            className="inline-flex md:hidden h-10 w-10 items-center justify-center rounded-md border border-border bg-white"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="md:hidden border-t border-border bg-white">
          <nav className="container-page py-3 flex flex-col gap-1">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-medium",
                  pathname?.startsWith(link.href)
                    ? "bg-brand-50 text-brand-700"
                    : "text-ink hover:bg-muted",
                )}
              >
                {link.label}
              </Link>
            ))}
            {status === "unauthenticated" ? (
              <div className="mt-2 flex gap-2 border-t border-border pt-3">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex h-10 flex-1 items-center justify-center rounded-md border border-border bg-white text-sm font-medium text-ink"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="flex h-10 flex-1 items-center justify-center rounded-md bg-brand text-sm font-medium text-white"
                >
                  Get started
                </Link>
              </div>
            ) : null}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
