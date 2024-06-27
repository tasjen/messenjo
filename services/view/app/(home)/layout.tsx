import AddContactButton from "@/components/add-contact-button";
import SignOutButton from "@/components/sign-out-button";
import ContactListServer from "@/components/contact-list-server";
import { Suspense } from "react";
import ContactListSkeleton from "@/components/skeletons/contact-list";
import { getContacts, getUserInfo } from "@/lib/store/server";
import NewUsernameDialog from "@/components/new-username-dialog";
import StoreProvider from "@/lib/store/client";
import SettingsButton from "@/components/settings-button";
import HomeButton from "@/components/home-button";
import { isNewUser } from "@/lib/data";
import Streaming from "@/components/streaming";

export default function Layout({ children }: { children: React.ReactNode }) {
  // start prefetching and caching data asynchronously before rendering children components
  getUserInfo();
  getContacts();

  return (
    <StoreProvider>
      <Streaming />
      {isNewUser() && <NewUsernameDialog />}
      <div className="flex h-screen p-4 gap-4">
        <aside className="flex-none w-96 flex flex-col justify-between p-4 rounded-2xl space-y-4 border">
          <Suspense fallback={<ContactListSkeleton />}>
            <ContactListServer />
          </Suspense>
          <div className="flex justify-around">
            <HomeButton />
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
