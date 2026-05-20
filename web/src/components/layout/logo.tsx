import Link from "next/link";
import { Calculator } from "lucide-react";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/jobs"
      className={cn(
        "inline-flex items-center gap-2 text-ink font-semibold tracking-tight",
        className,
      )}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white shadow-sm">
        <Calculator className="h-5 w-5" />
      </span>
      <span className="text-lg">
        Accountant<span className="text-brand">Hub</span>
      </span>
    </Link>
  );
}
