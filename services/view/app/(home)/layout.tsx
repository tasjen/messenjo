import FriendButton from "@/components/add-friend-button";
import SignOutButton from "@/components/sign-out-button";
import ContactListServer from "@/components/contact-list-server";
import { Suspense } from "react";
import ContactListSkeleton from "@/components/skeletons/contact-list";
import { getContacts, getUserInfo } from "@/lib/stores/server-store";
import Streaming from "@/components/streaming";
import ReconnectButton from "@/components/reconnect-button";
import NewUsernameDialog from "@/components/new-username-dialog";
import NoSSR from "@/components/no-ssr";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ClientStoreProvider from "@/lib/stores/client-store";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // start prefetching and caching data asynchronously before rendering children components
  getUserInfo();
  getContacts();

  return (
    <ClientStoreProvider>
      <div className="flex h-screen p-4 gap-4">
        <NoSSR>
          <NewUsernameDialog />
        </NoSSR>
        <Streaming />
        <aside className="flex-none w-64 flex flex-col justify-between p-4 rounded-2xl space-y-4 border">
          <Suspense fallback={<ContactListSkeleton />}>
            <ContactListServer />
          </Suspense>
          <ReconnectButton />
          <div className="flex justify-around">
            <Link href="/">
              <Button size="icon" variant="secondary">
                <Home />
              </Button>
            </Link>
            <FriendButton />
            <SignOutButton />
          </div>
        </aside>
        <main className="flex-1 p-4 rounded-2xl border">{children}</main>
      </div>
    </ClientStoreProvider>
  );
}
