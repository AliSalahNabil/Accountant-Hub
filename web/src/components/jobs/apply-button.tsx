"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2, Lock } from "lucide-react";

import { BidForm } from "@/components/jobs/bid-form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { jobsApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { ApiJob } from "@/lib/types";

export function ApplyButton({ job }: { job: ApiJob }) {
  const { status } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [hasMyBid, setHasMyBid] = useState<boolean>(Boolean(job.has_my_bid));

  // Server-rendered detail didn't have a token, so refetch with credentials to learn
  // whether the current user already submitted a bid on this job.
  useEffect(() => {
    if (status !== "authenticated") {
      setHasMyBid(false);
      return;
    }
    let cancelled = false;
    jobsApi
      .get(job.slug)
      .then((res) => {
        if (!cancelled) setHasMyBid(Boolean(res.data.has_my_bid));
      })
      .catch(() => {
        // Ignore — fall back to server value
      });
    return () => {
      cancelled = true;
    };
  }, [job.slug, status]);

  if (!job.is_open) {
    return (
      <div className="rounded-lg border border-border bg-stone-50 p-4 text-sm text-muted-foreground">
        This job is closed and is no longer accepting bids.
      </div>
    );
  }

  if (hasMyBid) {
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-3 rounded-lg border border-brand-200 bg-brand-50 p-4 text-sm text-brand-800">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-medium">You’ve already bid on this job.</p>
            <p className="text-brand-700">Only one bid per accountant is allowed.</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full"
          size="lg"
          onClick={() => router.push("/dashboard")}
        >
          View my bid in dashboard
        </Button>
      </div>
    );
  }

  if (status === "loading") {
    return <div className="h-12 w-full animate-pulse rounded-md bg-stone-100" />;
  }

  if (status === "unauthenticated") {
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-3 rounded-lg border border-border bg-stone-50 p-4 text-sm text-stone-700">
          <Lock className="h-5 w-5 flex-shrink-0 text-stone-500" />
          <div>
            <p className="font-medium text-ink">Sign in to apply</p>
            <p className="text-muted-foreground">You need an accountant account to submit a bid.</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href={`/login?next=/jobs/${job.slug}`}
            className="inline-flex h-12 w-full items-center justify-center rounded-md bg-brand px-6 text-sm font-semibold text-white shadow-sm hover:bg-brand-600"
          >
            Sign in
          </Link>
          <Link
            href={`/register?next=/jobs/${job.slug}`}
            className="inline-flex h-12 w-full items-center justify-center rounded-md border border-border bg-white px-6 text-sm font-semibold text-ink hover:bg-muted"
          >
            Create account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Button className="w-full" size="lg" onClick={() => setOpen(true)}>
        Apply / Submit bid
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Submit your bid"
        description={`for "${job.title}"`}
        size="lg"
      >
        <BidForm
          job={job}
          onClose={() => setOpen(false)}
          onSubmitted={() => setHasMyBid(true)}
        />
      </Modal>
    </>
  );
}
