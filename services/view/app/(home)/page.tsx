import { Suspense } from "react";
import Link from "next/link";
import UserProfileServer from "@/components/user-profile-server";
import UserProfileSkeleton from "@/components/skeletons/user-profile";
import { Icons } from "@/components/ui/icon";

export default async function HomePage() {
  return (
    <div className="flex flex-col h-full">
      <Suspense fallback={<UserProfileSkeleton />}>
        <UserProfileServer />
      </Suspense>
      <div className="ml-auto mt-auto p-2">
        Messenjo v0.0.1
        <Link href="https://github.com/tasjen/messenjo">
          <Icons.gitHub className="inline w-4 h-4 mb-1 ml-2" />
        </Link>
      </div>
    </div>
  );
}
