import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { Input } from "../ui/input";

// don't remove the style attribute of the first div element

export default function ContactListSkeleton() {
  return (
    <>
      <div className="flex items-center gap-2" style={{ margin: 0 }}>
        <Search className="absolute pl-2" />
        <Input className="h-7 pl-8 rounded-full" disabled />
      </div>
      <div className="flex flex-col overflow-auto h-full">
        {[...Array(8)].map((_, i) => (
          <>
            <div key={i} className="flex gap-2 p-2 rounded-lg">
              <Skeleton className="rounded-full h-10 w-10 self-center" />
              <div className="space-y-2 self-center py-1">
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-24 h-3" />
              </div>
            </div>
          </>
        ))}
      </div>
    </>
  );
}
