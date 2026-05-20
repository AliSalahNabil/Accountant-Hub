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
        <PageControl
          href={currentPage === 1 ? null : buildHref(currentPage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </PageControl>

        <div className="hidden sm:flex items-center gap-1">
          {pages.map((p, i) =>
            p === "…" ? (
              <span key={`gap-${i}`} className="px-2 text-muted-foreground" aria-hidden>
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
                aria-label={`Go to page ${p}`}
              >
                {p}
              </Link>
            ),
          )}
        </div>

        <PageControl
          href={currentPage === lastPage ? null : buildHref(currentPage + 1)}
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </PageControl>
      </div>
    </nav>
  );
}

function PageControl({
  href,
  children,
  ...rest
}: {
  href: string | null;
  children: React.ReactNode;
} & Pick<React.HTMLAttributes<HTMLElement>, "aria-label">) {
  const className =
    "inline-flex h-9 items-center gap-1 rounded-md border border-border px-3 text-sm";

  if (href === null) {
    return (
      <button
        type="button"
        disabled
        className={cn(className, "bg-white text-stone-400 opacity-60")}
        {...rest}
      >
        {children}
      </button>
    );
  }

  return (
    <Link href={href} className={cn(className, "bg-white text-ink hover:bg-muted")} {...rest}>
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
