"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-2xl",
    xl: "max-w-3xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      <div
        className={cn(
          "relative z-10 w-full rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl border border-border",
          "max-h-[92vh] overflow-y-auto",
          sizes[size],
        )}
      >
        {title ? (
          <div className="flex items-start justify-between gap-4 border-b border-border p-5 sm:p-6">
            <div>
              <h2 className="text-lg font-semibold text-ink">{title}</h2>
              {description ? (
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1.5 text-stone-500 hover:bg-muted hover:text-ink"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : null}
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
