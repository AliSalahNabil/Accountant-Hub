import Link from "next/link";
import { Compass } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <div className="container-page py-20">
      <EmptyState
        icon={<Compass className="h-6 w-6" />}
        title="Page not found"
        description="The page you're looking for doesn't exist or has been moved."
        action={
          <Link
            href="/jobs"
            className="inline-flex h-10 items-center rounded-md bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Back to jobs
          </Link>
        }
      />
    </div>
  );
}
