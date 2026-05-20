import Link from "next/link";
import { Briefcase, CalendarClock, Clock, MapPin, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { ApiJob } from "@/lib/types";
import { formatBudgetRange, formatDate, pluralize, truncate } from "@/lib/utils";

export function JobCard({ job }: { job: ApiJob }) {
  return (
    <Link
      href={`/jobs/${job.slug}`}
      className="group flex h-full flex-col rounded-xl border border-border bg-white p-5 transition-all hover:border-brand-300 hover:shadow-md focus-visible:border-brand"
      aria-label={`View details for ${job.title}`}
    >
      <div className="flex items-start justify-between gap-2">
        <Badge variant={job.is_open ? "brand" : "muted"}>
          {job.is_open ? "Open" : "Closed"}
        </Badge>
        <time
          dateTime={job.posted_at}
          title={formatDate(job.posted_at, { month: "long", day: "numeric", year: "numeric" })}
          className="text-xs text-muted-foreground"
        >
          Posted {job.posted_human}
        </time>
      </div>

      <h3 className="mt-3 line-clamp-2 text-base font-semibold text-ink group-hover:text-brand-700">
        {job.title}
      </h3>

      <p className="mt-1.5 text-sm text-muted-foreground">
        <span className="font-medium text-ink">{job.company.name}</span>
        {job.company.location ? (
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <span className="mx-1.5 text-stone-300">•</span>
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {job.company.location}
          </span>
        ) : null}
      </p>

      <p className="mt-3 line-clamp-2 text-sm text-stone-600">
        {truncate(job.short_description, 140)}
      </p>

      {job.required_skills.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {job.required_skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-700"
            >
              {skill}
            </span>
          ))}
          {job.required_skills.length > 4 ? (
            <span className="rounded-md px-2 py-0.5 text-xs text-muted-foreground">
              +{job.required_skills.length - 4} more
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5 flex flex-1 flex-col justify-end border-t border-border pt-4">
        <dl className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="inline-flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5" aria-hidden />
            <dt className="sr-only">Category</dt>
            <dd>{job.category.name}</dd>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" aria-hidden />
            <dt className="sr-only">Bids</dt>
            <dd>
              {job.bids_count} {pluralize(job.bids_count, "bid")}
            </dd>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            <dt className="sr-only">Delivery</dt>
            <dd>{job.delivery_days} days</dd>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <CalendarClock className="h-3.5 w-3.5" aria-hidden />
            <dt className="sr-only">Deadline</dt>
            <dd>
              Due{" "}
              <time dateTime={job.deadline}>
                {formatDate(job.deadline, { month: "short", day: "numeric", year: "numeric" })}
              </time>
            </dd>
          </div>
        </dl>
        <p className="mt-3 text-sm font-semibold text-ink">
          {formatBudgetRange(job.budget.min, job.budget.max, job.budget.currency)}
        </p>
      </div>
    </Link>
  );
}
