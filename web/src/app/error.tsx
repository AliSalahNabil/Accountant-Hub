"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page py-16">
      <EmptyState
        icon={<AlertTriangle className="h-6 w-6" />}
        title="Something went wrong"
        description={
          error.message ||
          "An unexpected error occurred. Please try again — if it persists, contact support."
        }
        action={
          <Button onClick={reset} variant="outline">
            Try again
          </Button>
        }
      />
    </div>
  );
}
