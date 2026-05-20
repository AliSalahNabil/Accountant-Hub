import Link from "next/link";
import { Briefcase, CalendarClock, Clock, MapPin, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { ApiJob } from "@/lib/types";
import { formatBudgetRange, pluralize, truncate } from "@/lib/utils";

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
        <span className="text-xs text-muted-foreground">{job.posted_human}</span>
      </div>

      <h3 className="mt-3 line-clamp-2 text-base font-semibold text-ink group-hover:text-brand-700">
        {job.title}
      </h3>

      <p className="mt-1.5 text-sm text-muted-foreground">
        <span className="font-medium text-ink">{job.company.name}</span>
        {job.company.location ? (
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <span className="mx-1.5 text-stone-300">•</span>
            <MapPin className="h-3.5 w-3.5" />
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
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5" />
            {job.category.name}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            {job.bids_count} {pluralize(job.bids_count, "bid")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {job.delivery_days} days
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarClock className="h-3.5 w-3.5" />
            Due {formatDate(job.deadline)}
          </span>
        </div>
        <p className="mt-3 text-sm font-semibold text-ink">
          {formatBudgetRange(job.budget.min, job.budget.max, job.budget.currency)}
        </p>
      </div>
    </Link>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
