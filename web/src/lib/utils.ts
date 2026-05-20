import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: string = "USD",
  options: Intl.NumberFormatOptions = {},
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    ...options,
  }).format(amount);
}

export function formatBudgetRange(min: number, max: number, currency = "USD") {
  if (min === max) return formatCurrency(min, currency);
  return `${formatCurrency(min, currency)} – ${formatCurrency(max, currency)}`;
}

export function pluralize(n: number, singular: string, plural?: string) {
  return n === 1 ? singular : (plural ?? `${singular}s`);
}

export function truncate(text: string, n: number) {
  return text.length > n ? text.slice(0, n - 1).trimEnd() + "…" : text;
}

export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
