import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const baseField =
  "block w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-ink placeholder:text-stone-400 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:opacity-50";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, type = "text", ...props }, ref) {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(baseField, "h-10", className)}
        {...props}
      />
    );
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, rows = 5, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={cn(baseField, "py-2.5 resize-y", className)}
        {...props}
      />
    );
  },
);

type FieldProps = {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function Field({ label, htmlFor, hint, error, required, children, className }: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
        {label}
        {required ? <span className="text-danger ml-0.5">*</span> : null}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
