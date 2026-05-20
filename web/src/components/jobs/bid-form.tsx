"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, DollarSign, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { ApiError, bidsApi } from "@/lib/api";
import { formatBudgetRange } from "@/lib/utils";
import type { ApiJob } from "@/lib/types";

const schema = z.object({
  proposed_price: z
    .number({ message: "Enter a numeric amount" })
    .min(1, "Price must be at least 1")
    .max(1_000_000, "Price is too high"),
  delivery_days: z
    .number({ message: "Enter a numeric value" })
    .int("Use whole days")
    .min(1, "At least 1 day")
    .max(365, "Maximum 365 days"),
  cover_letter: z
    .string()
    .min(30, "Cover letter must be at least 30 characters")
    .max(5000, "Cover letter is too long"),
  experience_summary: z.string().max(2000, "Too long").optional(),
});

type FormValues = z.infer<typeof schema>;

export function BidForm({
  job,
  onClose,
  onSubmitted,
}: {
  job: ApiJob;
  onClose?: () => void;
  onSubmitted?: () => void;
}) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      proposed_price: Math.round((job.budget.min + job.budget.max) / 2),
      delivery_days: job.delivery_days,
      cover_letter: "",
      experience_summary: "",
    },
  });

  const coverLetter = watch("cover_letter") ?? "";

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await bidsApi.submit(job.slug, values);
      toast.success("Bid submitted! The client will be in touch.");
      setSubmitted(true);
      onSubmitted?.();
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        if (Object.keys(error.errors).length > 0) {
          for (const [key, messages] of Object.entries(error.errors)) {
            setError(key as keyof FormValues, { message: messages[0] });
          }
        } else {
          setServerError(error.message);
        }
      } else {
        setServerError("Something went wrong while submitting your bid.");
      }
    }
  };

  if (submitted) {
    return (
      <div className="space-y-4 text-center py-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-700">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-ink">Bid submitted!</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Your proposal has been sent. You can track its status in your dashboard.
          </p>
        </div>
        <div className="flex flex-col gap-2 pt-2">
          <Button onClick={() => router.push("/dashboard")} size="lg">
            View my bids
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="rounded-lg border border-brand-200 bg-brand-50/60 p-3.5 text-sm">
        <p className="font-medium text-brand-800 flex items-center gap-1.5">
          <Sparkles className="h-4 w-4" />
          Client budget range
        </p>
        <p className="text-brand-700 mt-0.5">
          {formatBudgetRange(job.budget.min, job.budget.max, job.budget.currency)} · suggested delivery {job.delivery_days} days
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          label="Proposed price"
          htmlFor="proposed_price"
          required
          error={errors.proposed_price?.message}
          hint={`In ${job.budget.currency}`}
        >
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <Input
              id="proposed_price"
              type="number"
              step="1"
              min={1}
              className="pl-8"
              placeholder="e.g. 1200"
              {...register("proposed_price", { valueAsNumber: true })}
            />
          </div>
        </Field>

        <Field
          label="Estimated delivery"
          htmlFor="delivery_days"
          required
          error={errors.delivery_days?.message}
          hint="In days"
        >
          <Input
            id="delivery_days"
            type="number"
            step="1"
            min={1}
            placeholder="e.g. 14"
            {...register("delivery_days", { valueAsNumber: true })}
          />
        </Field>
      </div>

      <Field
        label="Cover letter"
        htmlFor="cover_letter"
        required
        error={errors.cover_letter?.message}
        hint={`${coverLetter.length} / 5000 characters · 30 minimum`}
      >
        <Textarea
          id="cover_letter"
          rows={6}
          placeholder="Introduce yourself, explain your approach, and why you're the right fit for this job…"
          {...register("cover_letter")}
        />
      </Field>

      <Field
        label="Relevant experience"
        htmlFor="experience_summary"
        hint="Optional · briefly list past similar work"
        error={errors.experience_summary?.message}
      >
        <Textarea
          id="experience_summary"
          rows={4}
          placeholder="e.g. 5 years bookkeeping for SaaS companies, QuickBooks ProAdvisor since 2019…"
          {...register("experience_summary")}
        />
      </Field>

      {serverError ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {serverError}
        </div>
      ) : null}

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 pt-2 border-t border-border">
        {onClose ? (
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" loading={isSubmitting} size="lg">
          Submit bid
        </Button>
      </div>
    </form>
  );
}
