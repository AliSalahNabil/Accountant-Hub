"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  currentPage: number;
  lastPage: number;
};

export function Pagination({ currentPage, lastPage }: Props) {
  const searchParams = useSearchParams();
  if (lastPage <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) params.delete("page");
    else params.set("page", String(page));
    const qs = params.toString();
    return `/jobs${qs ? `?${qs}` : ""}`;
  };

  const pages = buildPageRange(currentPage, lastPage);

  return (
    <nav
      className="flex items-center justify-between border-t border-border pt-6"
      aria-label="Pagination"
    >
      <div className="text-sm text-muted-foreground">
        Page <span className="font-medium text-ink">{currentPage}</span> of {lastPage}
      </div>
      <div className="flex items-center gap-1">
        <PageLink
          href={buildHref(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </PageLink>

        <div className="hidden sm:flex items-center gap-1">
          {pages.map((p, i) =>
            p === "…" ? (
              <span key={`gap-${i}`} className="px-2 text-muted-foreground">
                …
              </span>
            ) : (
              <Link
                key={p}
                href={buildHref(p)}
                className={cn(
                  "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-sm",
                  p === currentPage
                    ? "border-brand bg-brand text-white"
                    : "border-border bg-white text-ink hover:bg-muted",
                )}
                aria-current={p === currentPage ? "page" : undefined}
              >
                {p}
              </Link>
            ),
          )}
        </div>

        <PageLink
          href={buildHref(Math.min(lastPage, currentPage + 1))}
          disabled={currentPage === lastPage}
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </PageLink>
      </div>
    </nav>
  );
}

function PageLink({
  href,
  disabled,
  children,
  ...rest
}: {
  href: string;
  disabled?: boolean;
  children: React.ReactNode;
} & React.ComponentProps<"a">) {
  if (disabled) {
    return (
      <span
        {...rest}
        className="inline-flex h-9 items-center gap-1 rounded-md border border-border bg-white px-3 text-sm text-stone-400 opacity-60"
      >
        {children}
      </span>
    );
  }
  return (
    <Link
      {...rest}
      href={href}
      className="inline-flex h-9 items-center gap-1 rounded-md border border-border bg-white px-3 text-sm text-ink hover:bg-muted"
    >
      {children}
    </Link>
  );
}

function buildPageRange(current: number, last: number): Array<number | "…"> {
  const pages: Array<number | "…"> = [];
  const window = 1;

  for (let i = 1; i <= last; i++) {
    if (
      i === 1 ||
      i === last ||
      (i >= current - window && i <= current + window)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }
  return pages;
}
