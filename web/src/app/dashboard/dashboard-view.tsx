"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  ExternalLink,
  Loader2,
  ListChecks,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError, bidsApi, dashboardApi } from "@/lib/api";
import type { ApiBid, DashboardStats } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { formatCurrency } from "@/lib/utils";

type State =
  | { kind: "loading" }
  | { kind: "loaded"; bids: ApiBid[]; stats: DashboardStats; lastPage: number; page: number }
  | { kind: "error"; message: string };

export function DashboardView() {
  const router = useRouter();
  const { status, user } = useAuth();
  const [state, setState] = useState<State>({ kind: "loading" });
  const [page, setPage] = useState(1);
  const [withdrawing, setWithdrawing] = useState<number | null>(null);
  const [confirmBid, setConfirmBid] = useState<ApiBid | null>(null);

  const load = useCallback(
    async (nextPage = page) => {
      try {
        const [bidsResp, statsResp] = await Promise.all([
          bidsApi.myBids({ page: nextPage, per_page: 10 }),
          dashboardApi.stats(),
        ]);
        setState({
          kind: "loaded",
          bids: bidsResp.data,
          stats: statsResp.stats,
          lastPage: bidsResp.meta.last_page,
          page: bidsResp.meta.current_page,
        });
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          router.replace("/login?next=/dashboard");
          return;
        }
        const message =
          error instanceof ApiError ? error.message : "Failed to load your dashboard.";
        setState({ kind: "error", message });
      }
    },
    [page, router],
  );

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.replace("/login?next=/dashboard");
      return;
    }
    // Sync state from the API (external system) after auth resolves / page changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load(page);
  }, [status, load, page, router]);

  const handleWithdraw = async (bid: ApiBid) => {
    setWithdrawing(bid.id);
    try {
      await bidsApi.withdraw(bid.id);
      toast.success("Bid withdrawn.");
      setConfirmBid(null);
      await load();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Could not withdraw.";
      toast.error(message);
    } finally {
      setWithdrawing(null);
    }
  };

  if (status === "loading" || state.kind === "loading") {
    return (
      <div className="container-page py-10 space-y-8">
        <header className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <div className="grid gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  if (state.kind === "error") {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={<XCircle className="h-6 w-6" />}
          title="Couldn’t load your dashboard"
          description={state.message}
          action={
            <Button onClick={() => load()} variant="outline">
              Try again
            </Button>
          }
        />
      </div>
    );
  }

  const { bids, stats, page: currentPage, lastPage } = state;

  return (
    <div className="container-page py-10 space-y-8">
      <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Track your active bids and pipeline of accounting opportunities.
          </p>
        </div>
        <Link
          href="/jobs"
          className="inline-flex h-10 items-center rounded-md bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-600"
        >
          Find more jobs
        </Link>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<ListChecks className="h-4 w-4" />}
          label="Total bids"
          value={stats.total_bids}
          accent="default"
        />
        <StatCard
          icon={<Clock className="h-4 w-4" />}
          label="Pending"
          value={stats.pending_bids}
          accent="warning"
        />
        <StatCard
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="Accepted"
          value={stats.accepted_bids}
          accent="brand"
        />
        <StatCard
          icon={<XCircle className="h-4 w-4" />}
          label="Rejected"
          value={stats.rejected_bids}
          accent="danger"
        />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">My bids</h2>
          {bids.length > 0 ? (
            <p className="text-sm text-muted-foreground">
              Showing page {currentPage} of {lastPage}
            </p>
          ) : null}
        </div>

        {bids.length === 0 ? (
          <EmptyState
            icon={<Briefcase className="h-6 w-6" />}
            title="No bids yet"
            description="When you submit a bid on a job, it will show up here so you can track its status."
            action={
              <Link
                href="/jobs"
                className="inline-flex h-10 items-center rounded-md bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-600"
              >
                Browse open jobs
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {bids.map((bid) => (
              <BidRow
                key={bid.id}
                bid={bid}
                onWithdraw={() => setConfirmBid(bid)}
                withdrawing={withdrawing === bid.id}
              />
            ))}
          </div>
        )}

        {lastPage > 1 ? (
          <div className="mt-6 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentPage} / {lastPage}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === lastPage}
              onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
            >
              Next
            </Button>
          </div>
        ) : null}
      </section>

      <ConfirmDialog
        open={confirmBid !== null}
        onClose={() => {
          if (!withdrawing) setConfirmBid(null);
        }}
        onConfirm={async () => {
          if (confirmBid) await handleWithdraw(confirmBid);
        }}
        title="Withdraw this bid?"
        description="The client will no longer see your proposal. This cannot be undone."
        confirmLabel="Yes, withdraw"
        cancelLabel="Keep bid"
        loading={withdrawing !== null}
      />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent: "default" | "warning" | "brand" | "danger";
}) {
  const accents = {
    default: "bg-stone-100 text-stone-700",
    brand: "bg-brand-50 text-brand-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-red-700",
  };
  return (
    <Card>
      <CardBody className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-bold text-ink">{value}</p>
        </div>
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${accents[accent]}`}
        >
          {icon}
        </span>
      </CardBody>
    </Card>
  );
}

function BidRow({
  bid,
  onWithdraw,
  withdrawing,
}: {
  bid: ApiBid;
  onWithdraw: () => void;
  withdrawing: boolean;
}) {
  const statusVariants = {
    pending: { variant: "warning" as const, label: "Pending" },
    accepted: { variant: "brand" as const, label: "Accepted" },
    rejected: { variant: "danger" as const, label: "Rejected" },
    withdrawn: { variant: "muted" as const, label: "Withdrawn" },
  };
  const statusInfo = statusVariants[bid.status];

  return (
    <Card className="overflow-hidden">
      <CardBody className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="space-y-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
            {bid.job?.category ? (
              <Badge variant="outline">{bid.job.category.name}</Badge>
            ) : null}
            <span className="text-xs text-muted-foreground">{bid.submitted_human}</span>
          </div>
          {bid.job ? (
            <Link
              href={`/jobs/${bid.job.slug}`}
              className="block font-semibold text-ink hover:text-brand-700 line-clamp-1"
            >
              {bid.job.title}
            </Link>
          ) : null}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {bid.cover_letter}
          </p>
        </div>
        <div className="flex flex-row gap-6 sm:flex-col sm:items-end sm:gap-2 sm:text-right">
          <div>
            <p className="text-xs uppercase tracking-wider text-stone-500">Your bid</p>
            <p className="text-lg font-bold text-ink">
              {formatCurrency(bid.proposed_price, bid.job?.budget.currency ?? "USD")}
            </p>
            <p className="text-xs text-muted-foreground">
              in {bid.delivery_days} days
            </p>
          </div>
          <div className="flex gap-2">
            {bid.job ? (
              <Link
                href={`/jobs/${bid.job.slug}`}
                className="inline-flex h-8 items-center gap-1 rounded-md border border-border bg-white px-3 text-xs font-medium hover:bg-muted"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                View
              </Link>
            ) : null}
            {bid.status === "pending" ? (
              <button
                type="button"
                onClick={onWithdraw}
                disabled={withdrawing}
                className="inline-flex h-8 items-center gap-1 rounded-md border border-red-200 bg-red-50 px-3 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
              >
                {withdrawing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                Withdraw
              </button>
            ) : null}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
