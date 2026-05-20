import type { Metadata } from "next";
import { Briefcase } from "lucide-react";

import { JobCard } from "@/components/jobs/job-card";
import { JobFilters } from "@/components/jobs/job-filters";
import { Pagination } from "@/components/jobs/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { categoriesApi, jobsApi } from "@/lib/api";
import type { JobFilters as JobFiltersType } from "@/lib/types";

export const metadata: Metadata = {
  title: "Browse jobs",
  description:
    "Browse open accounting jobs — bookkeeping, tax, audit, payroll and advisory work. Filter by category, budget, and deadline.",
};

type SearchParams = {
  search?: string;
  category?: string;
  budget_min?: string;
  budget_max?: string;
  status?: string;
  sort?: string;
  page?: string;
  per_page?: string;
};

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = (await searchParams) ?? {};

  const filters: JobFiltersType = {
    search: params.search,
    category: params.category,
    budget_min: params.budget_min ? Number(params.budget_min) : undefined,
    budget_max: params.budget_max ? Number(params.budget_max) : undefined,
    status: (params.status as JobFiltersType["status"]) ?? "open",
    sort: (params.sort as JobFiltersType["sort"]) ?? "newest",
    page: params.page ? Number(params.page) : 1,
    per_page: params.per_page ? Number(params.per_page) : 9,
  };

  const [jobsResponse, categoriesResponse] = await Promise.all([
    jobsApi.list(filters).catch(() => null),
    categoriesApi.list().catch(() => ({ data: [] })),
  ]);

  const categories = categoriesResponse?.data ?? [];

  if (!jobsResponse) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={<Briefcase className="h-6 w-6" />}
          title="Couldn’t reach the server"
          description="We weren’t able to load jobs right now. Make sure the API is running, then refresh."
        />
      </div>
    );
  }

  const jobs = jobsResponse.data;

  return (
    <div className="flex flex-col">
      <section className="border-b border-border bg-gradient-to-b from-stone-50 to-white">
        <div className="container-page py-10 sm:py-12">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink">
              Accounting jobs
            </h1>
            <p className="mt-2 text-muted-foreground">
              Browse open accounting jobs from companies around the world. Filter by category, budget, and timeline.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-8">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <JobFilters categories={categories} totalResults={jobsResponse.meta.total} />
        </div>

        <div className="mt-8">
          {jobs.length === 0 ? (
            <EmptyState
              icon={<Briefcase className="h-6 w-6" />}
              title="No jobs match your filters"
              description="Try widening your search, clearing some filters, or browsing all categories."
            />
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              <div className="mt-10">
                <Pagination
                  currentPage={jobsResponse.meta.current_page}
                  lastPage={jobsResponse.meta.last_page}
                />
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
