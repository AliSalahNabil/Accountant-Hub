"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { ApiCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  categories: ApiCategory[];
  totalResults?: number;
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "budget_high", label: "Highest budget" },
  { value: "budget_low", label: "Lowest budget" },
  { value: "deadline", label: "Deadline soonest" },
] as const;

const BUDGET_PRESETS = [
  { label: "Any", min: "", max: "" },
  { label: "Under $1k", min: "", max: "1000" },
  { label: "$1k – $3k", min: "1000", max: "3000" },
  { label: "$3k – $7k", min: "3000", max: "7000" },
  { label: "$7k+", min: "7000", max: "" },
];

const STATUS_OPTIONS = ["open", "closed", "all"] as const;

export function JobFilters({ categories, totalResults }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") ?? "";
  const currentCategory = searchParams.get("category") ?? "";
  const currentSort = searchParams.get("sort") ?? "newest";
  const currentStatus = searchParams.get("status") ?? "open";
  const currentBudgetMin = searchParams.get("budget_min") ?? "";
  const currentBudgetMax = searchParams.get("budget_max") ?? "";

  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pushParams = useCallback(
    (next: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParamsString);
      for (const [key, value] of Object.entries(next)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      params.delete("page");
      startTransition(() => {
        router.push(`/jobs?${params.toString()}`);
      });
    },
    [router, searchParamsString],
  );

  // Sync state when the URL changes externally (Back/Forward, Clear button).
  // The new React 19 lint rule flags setState-in-effect, but here the external system
  // we're syncing with is the URL — exactly the use case the docs allow.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  // Debounce: push the search term into the URL after the user stops typing.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (currentSearch !== searchTerm) {
        pushParams({ search: searchTerm || null });
      }
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchTerm, currentSearch, pushParams]);

  const activeFiltersCount =
    (currentCategory ? 1 : 0) +
    (currentBudgetMin || currentBudgetMax ? 1 : 0) +
    (currentStatus !== "open" ? 1 : 0) +
    (searchTerm ? 1 : 0);

  const clearAll = () => {
    setSearchTerm("");
    startTransition(() => router.push("/jobs"));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" aria-hidden />
          <Input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search jobs by title, company, or keyword…"
            className="h-11 pl-9"
            aria-label="Search jobs"
          />
          {searchTerm ? (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-stone-400 hover:bg-muted hover:text-ink"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:w-auto">
          <Select
            value={currentCategory}
            onChange={(event) => pushParams({ category: event.target.value || null })}
            className="h-11 min-w-44"
            aria-label="Filter by category"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </Select>
          <Select
            value={currentSort}
            onChange={(event) => pushParams({ sort: event.target.value })}
            className="h-11 min-w-40"
            aria-label="Sort by"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filter by budget range"
        >
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Budget:</span>
          {BUDGET_PRESETS.map((preset) => {
            const active =
              (preset.min || "") === currentBudgetMin &&
              (preset.max || "") === currentBudgetMax;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() =>
                  pushParams({
                    budget_min: preset.min || null,
                    budget_max: preset.max || null,
                  })
                }
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  active
                    ? "border-brand bg-brand-50 text-brand-700"
                    : "border-border bg-white text-muted-foreground hover:border-brand-300 hover:text-ink",
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-1 text-xs text-muted-foreground"
            role="group"
            aria-label="Filter by status"
          >
            <span className="hidden sm:inline">Status:</span>
            <div className="flex overflow-hidden rounded-md border border-border">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => pushParams({ status: opt === "open" ? null : opt })}
                  aria-pressed={currentStatus === opt}
                  className={cn(
                    "px-2.5 py-1 text-xs font-medium capitalize",
                    currentStatus === opt
                      ? "bg-ink text-white"
                      : "bg-white text-muted-foreground hover:bg-muted",
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {activeFiltersCount > 0 ? (
            <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs">
              Clear ({activeFiltersCount})
            </Button>
          ) : null}
        </div>
      </div>

      {typeof totalResults === "number" ? (
        <p
          className="text-sm text-muted-foreground"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {isPending
            ? "Updating…"
            : `Showing ${totalResults} ${totalResults === 1 ? "job" : "jobs"}`}
        </p>
      ) : null}
    </div>
  );
}
