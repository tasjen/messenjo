import AddContactButton from "@/components/add-contact-button";
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
import StoreProvider from "@/lib/stores/client-store";
import SettingsButton from "@/components/settings-button";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // start prefetching and caching data asynchronously before rendering children components
  getUserInfo();
  getContacts();

  return (
    <StoreProvider>
      <div className="flex h-screen p-4 gap-4">
        <NoSSR>
          <NewUsernameDialog isNewUser={true} />
          <Streaming />
        </NoSSR>
        <aside className="flex-none w-80 flex flex-col justify-between p-4 rounded-2xl space-y-4 border">
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
            <AddContactButton />
            <SettingsButton />
            <SignOutButton />
          </div>
        </aside>
        <main className="flex-1 p-4 rounded-2xl border">{children}</main>
      </div>
    </StoreProvider>
  );
}
