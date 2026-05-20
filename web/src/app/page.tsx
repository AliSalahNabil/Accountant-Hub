import Link from "next/link";
import { ArrowRight, Briefcase, ShieldCheck, TrendingUp } from "lucide-react";

import { categoriesApi, jobsApi } from "@/lib/api";

export default async function HomePage() {
  const [jobsResponse, categoriesResponse] = await Promise.all([
    jobsApi.list({ per_page: 3, sort: "newest" }).catch(() => null),
    categoriesApi.list().catch(() => null),
  ]);

  const recentJobs = jobsResponse?.data ?? [];
  const categories = categoriesResponse?.data ?? [];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-stone-50 to-white">
        <div className="absolute inset-x-0 top-0 h-72 bg-dotted opacity-60" aria-hidden />
        <div className="container-page relative py-20 sm:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
              {jobsResponse?.meta?.total ?? 0} open accounting jobs right now
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink text-balance">
              The hub where accountants find{" "}
              <span className="gradient-text">serious work.</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl text-pretty">
              Browse bookkeeping, tax, audit and advisory jobs from real
              companies. Submit your bid in minutes and grow your accounting
              practice on your terms.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/jobs"
                className="inline-flex h-12 items-center gap-2 rounded-md bg-brand px-6 text-sm font-semibold text-white shadow-sm hover:bg-brand-600"
              >
                Browse open jobs
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/register"
                className="inline-flex h-12 items-center gap-2 rounded-md border border-border bg-white px-6 text-sm font-semibold text-ink hover:bg-muted"
              >
                Create accountant profile
              </Link>
            </div>

            <dl className="mt-12 grid grid-cols-3 gap-6 sm:gap-10 max-w-xl">
              <div>
                <dt className="text-2xl sm:text-3xl font-bold text-ink">
                  {jobsResponse?.meta?.total ?? 0}+
                </dt>
                <dd className="text-xs sm:text-sm text-muted-foreground">Open jobs</dd>
              </div>
              <div>
                <dt className="text-2xl sm:text-3xl font-bold text-ink">{categories.length}</dt>
                <dd className="text-xs sm:text-sm text-muted-foreground">Categories</dd>
              </div>
              <div>
                <dt className="text-2xl sm:text-3xl font-bold text-ink">100%</dt>
                <dd className="text-xs sm:text-sm text-muted-foreground">Accountant-focused</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Value */}
      <section className="border-b border-border">
        <div className="container-page py-16 grid gap-8 md:grid-cols-3">
          <Feature
            icon={<Briefcase className="h-5 w-5" />}
            title="Real accounting work"
            description="Bookkeeping, tax, audit, payroll, IFRS conversion and more — all curated for accountants."
          />
          <Feature
            icon={<ShieldCheck className="h-5 w-5" />}
            title="One bid per job"
            description="No spam. Every accountant gets one shot per posting — so quality matters more than volume."
          />
          <Feature
            icon={<TrendingUp className="h-5 w-5" />}
            title="Track your pipeline"
            description="Your dashboard tracks every bid you've sent and its status, so nothing falls through."
          />
        </div>
      </section>

      {/* Recent jobs preview */}
      {recentJobs.length > 0 ? (
        <section className="border-b border-border">
          <div className="container-page py-16">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-ink">
                  Latest opportunities
                </h2>
                <p className="mt-1 text-muted-foreground text-sm">
                  Hand-picked recent jobs from accounting firms and businesses.
                </p>
              </div>
              <Link
                href="/jobs"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800"
              >
                See all jobs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {recentJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.slug}`}
                  className="group rounded-xl border border-border bg-white p-5 hover:border-brand-300 hover:shadow-md transition-all"
                >
                  <p className="text-xs text-muted-foreground">
                    {job.category.name} · {job.posted_human}
                  </p>
                  <h3 className="mt-1.5 font-semibold text-ink line-clamp-2 group-hover:text-brand-700">
                    {job.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                    {job.short_description}
                  </p>
                  <p className="mt-4 text-sm font-medium text-ink">
                    ${job.budget.min.toLocaleString()} – ${job.budget.max.toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section className="bg-ink text-white">
        <div className="container-page py-16 sm:py-20 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Ready to land your next client?
            </h2>
            <p className="mt-2 text-stone-400 max-w-xl">
              Create your accountant profile in under a minute and start
              applying to curated accounting jobs today.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/register"
              className="inline-flex h-12 items-center rounded-md bg-brand px-6 text-sm font-semibold text-white hover:bg-brand-600"
            >
              Get started
            </Link>
            <Link
              href="/jobs"
              className="inline-flex h-12 items-center rounded-md border border-stone-700 px-6 text-sm font-semibold text-white hover:bg-stone-900"
            >
              Browse jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
        {icon}
      </span>
      <div>
        <h3 className="font-semibold text-ink">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
