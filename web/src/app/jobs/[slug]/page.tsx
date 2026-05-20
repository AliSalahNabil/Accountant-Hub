import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  Clock,
  DollarSign,
  MapPin,
  Paperclip,
  Tag,
  Users,
} from "lucide-react";

import { ApplyButton } from "@/components/jobs/apply-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import { ApiError, jobsApi } from "@/lib/api";
import { formatBudgetRange, formatDate, pluralize } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { data: job } = await jobsApi.get(slug);
    return {
      title: job.title,
      description: job.short_description,
    };
  } catch {
    return { title: "Job not found" };
  }
}

export default async function JobDetailsPage({ params }: Props) {
  const { slug } = await params;

  let job;
  try {
    job = (await jobsApi.get(slug)).data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  return (
    <div className="flex flex-col">
      <section className="border-b border-border bg-gradient-to-b from-stone-50 to-white">
        <div className="container-page py-6">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to jobs
          </Link>
        </div>
      </section>

      <section className="container-page py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardBody className="space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={job.is_open ? "brand" : "muted"}>
                    {job.is_open ? "Open" : "Closed"}
                  </Badge>
                  <Badge variant="outline" icon={<Tag className="h-3 w-3" />}>
                    {job.category.name}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Posted {job.posted_human}
                  </span>
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink text-balance">
                    {job.title}
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    <span className="font-medium text-ink">{job.company.name}</span>
                    {job.company.location ? (
                      <>
                        <span className="mx-2 text-stone-300">•</span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {job.company.location}
                        </span>
                      </>
                    ) : null}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 border-y border-border py-5">
                  <Stat
                    icon={<DollarSign className="h-4 w-4" />}
                    label="Budget"
                    value={formatBudgetRange(job.budget.min, job.budget.max, job.budget.currency)}
                  />
                  <Stat
                    icon={<Clock className="h-4 w-4" />}
                    label="Delivery"
                    value={`${job.delivery_days} days`}
                  />
                  <Stat
                    icon={<CalendarClock className="h-4 w-4" />}
                    label="Deadline"
                    value={formatDate(job.deadline)}
                  />
                  <Stat
                    icon={<Users className="h-4 w-4" />}
                    label="Bids"
                    value={`${job.bids_count} ${pluralize(job.bids_count, "bid")}`}
                  />
                </div>

                <article className="prose-content">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-2">
                    Job description
                  </h2>
                  <div className="text-[15px] leading-relaxed text-stone-700 whitespace-pre-wrap">
                    {job.description}
                  </div>
                </article>

                {job.required_skills.length > 0 ? (
                  <div>
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-2">
                      Required skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {job.required_skills.map((skill) => (
                        <Badge key={skill} variant="default">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-2">
                    Attachments
                  </h2>
                  {job.attachments.length === 0 ? (
                    <p className="rounded-md border border-dashed border-border bg-muted/50 px-4 py-6 text-center text-sm text-muted-foreground">
                      <Paperclip className="inline h-4 w-4 mr-1.5" />
                      No attachments for this job.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {job.attachments.map((attachment) => (
                        <li
                          key={attachment.url}
                          className="flex items-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm"
                        >
                          <Paperclip className="h-4 w-4 text-stone-500" />
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-700 hover:underline"
                          >
                            {attachment.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <Card>
              <CardBody className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-stone-500">Budget</p>
                  <p className="mt-1 text-2xl font-bold text-ink">
                    {formatBudgetRange(job.budget.min, job.budget.max, job.budget.currency)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Delivery in {job.delivery_days} days · Deadline {formatDate(job.deadline)}
                  </p>
                </div>

                <ApplyButton job={job} />

                <p className="text-xs text-center text-muted-foreground">
                  By submitting, you agree to keep client communication on this platform.
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="space-y-3">
                <p className="text-xs uppercase tracking-wider text-stone-500">About the client</p>
                <p className="font-semibold text-ink">{job.company.name}</p>
                {job.company.location ? (
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {job.company.location}
                  </p>
                ) : null}
              </CardBody>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-stone-500">
        <span className="text-stone-400">{icon}</span>
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

