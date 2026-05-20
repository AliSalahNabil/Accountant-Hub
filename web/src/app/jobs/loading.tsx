import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col">
      <section className="border-b border-border bg-gradient-to-b from-stone-50 to-white">
        <div className="container-page py-10 sm:py-12 space-y-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
      </section>
      <section className="container-page py-8">
        <Skeleton className="h-32 rounded-2xl" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      </section>
    </div>
  );
}
