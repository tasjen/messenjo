import { Skeleton } from "../ui/skeleton";

export default function ContactListSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-gray-200 rounded-md p-2">
          <Skeleton className="w-20 h-5 bg-gray-400 mb-2" />
          <Skeleton className="w-24 h-4 bg-gray-400" />
        </div>
      ))}
    </div>
  );
}
