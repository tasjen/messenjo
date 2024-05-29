import { ChevronLeft } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import clsx from "clsx";
import Link from "next/link";

export default function ChatBoardSkeleton() {
  return (
    <>
      <div className="my-2.5 flex items-center">
        <Skeleton className="w-28 h-4 mr-auto" />
        <Link href="/" className="flex justify-center items-center w-20">
          <ChevronLeft className="h-6 w-6" />
        </Link>
      </div>
      <ul className="flex flex-col gap-2 overflow-auto mb-auto border-t pt-2">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={clsx(
              "flex gap-2",
              i % 2 === 0 && "ml-auto flex-row-reverse"
            )}
          >
            <Skeleton className="rounded-full h-10 w-10" />
            <Skeleton className="rounded-full p-2 w-36 h-10" />
          </div>
        ))}
      </ul>
    </>
  );
}
