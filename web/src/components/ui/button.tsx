import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg" | "icon";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-brand text-white hover:bg-brand-600 active:bg-brand-700 shadow-sm",
  secondary:
    "bg-ink text-white hover:bg-ink-soft active:bg-black",
  outline:
    "bg-white text-ink border border-border hover:bg-muted",
  ghost:
    "bg-transparent text-ink hover:bg-muted",
  destructive:
    "bg-danger text-white hover:bg-red-700",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10 p-0",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", loading, disabled, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium",
        "transition-colors duration-150",
        "disabled:opacity-50 disabled:pointer-events-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
});
