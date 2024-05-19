import { Skeleton } from "../ui/skeleton";
import clsx from "clsx";

export default function ChatBoardSkeleton() {
  return (
    <>
      <Skeleton className="w-28 h-5 mb-4 mt-2" />
      <ul className="flex flex-col gap-2 overflow-auto h-full">
        {[...Array(10)].map((_, i) => (
          <Skeleton
            key={i}
            className={clsx(
              "rounded-xl  p-2 w-36 h-10",
              i % 2 === 0 && "ml-auto flex-row-reverse"
            )}
          />
        ))}
      </ul>
    </>
  );
}
