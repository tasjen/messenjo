import { Icons } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col h-full">
      <div className="mt-auto space-y-6 flex flex-col items-center">
        <Skeleton className="rounded-full h-28 w-28" />
        <Skeleton className="h-7 w-16" />
        <Skeleton className="rounded-full h-4 w-40" />
      </div>
      <div className="ml-auto mt-auto p-2">
        Messenjo v0.0.1
        <a href="https://github.com/tasjen/messenjo">
          <Icons.gitHub className="inline w-4 h-4 mb-1 ml-2" />
        </a>
      </div>
    </div>
  );
}
