import { Skeleton } from "@/components/ui/skeleton";

export default function UserProfile() {
  return (
    <div className="mt-auto space-y-6 flex flex-col items-center">
      <Skeleton className="rounded-full h-28 w-28" />
      <Skeleton className="h-7 w-16" />
      <Skeleton className="rounded-full h-4 w-40" />
    </div>
  );
}
