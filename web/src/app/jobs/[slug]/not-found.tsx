import Link from "next/link";
import { Briefcase } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <div className="container-page py-20">
      <EmptyState
        icon={<Briefcase className="h-6 w-6" />}
        title="Job not found"
        description="The job you're looking for may have been closed or removed."
        action={
          <Link
            href="/jobs"
            className="inline-flex h-10 items-center rounded-md bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Browse all jobs
          </Link>
        }
      />
    </div>
  );
}
