import { Skeleton } from "@/components/ui/skeleton";

export default function ContactListSkeleton() {
  return (
    <div className="flex flex-col overflow-auto gap-2 h-full">
      {[...Array(8)].map((_, i) => (
        <div key={i} className=" rounded-md p-2">
          <Skeleton className="w-20 h-5  mb-2" />
          <Skeleton className="w-24 h-4 " />
        </div>
      ))}
    </div>
  );
}
