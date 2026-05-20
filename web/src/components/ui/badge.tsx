import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Variant = "default" | "brand" | "outline" | "success" | "warning" | "danger" | "muted";

const variants: Record<Variant, string> = {
  default: "bg-stone-100 text-ink",
  brand: "bg-brand-50 text-brand-700 border border-brand-200",
  outline: "border border-border text-muted-foreground",
  success: "bg-green-50 text-green-700 border border-green-200",
  warning: "bg-amber-50 text-amber-700 border border-amber-200",
  danger: "bg-red-50 text-red-700 border border-red-200",
  muted: "bg-stone-100 text-stone-600",
};

export function Badge({
  children,
  variant = "default",
  className,
  icon,
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
