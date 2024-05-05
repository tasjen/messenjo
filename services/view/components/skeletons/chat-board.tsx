import { Skeleton } from "../ui/skeleton";
import clsx from "clsx";

export default function ChatBoardSkeleton() {
  return (
    <>
      <Skeleton className="bg-gray-400 w-28 h-5 mb-4" />
      <ul className="flex flex-col gap-2 overflow-auto h-full">
        {[...Array(10)].map((_, i) => (
          <Skeleton
            key={i}
            className={clsx(
              "rounded-xl bg-gray-200 p-2 w-36 h-10",
              i % 2 === 0 && "ml-auto flex-row-reverse"
            )}
          />
        ))}
      </ul>
    </>
  );
}
