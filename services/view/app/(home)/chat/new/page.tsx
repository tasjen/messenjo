import FriendSearchResultServer from "@/components/chat/friend-search-result-server";
import FriendSearchForm from "@/components/chat/friend-search-form";
import CreateGroupForm from "@/components/chat/create-group-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

type Props = {
  searchParams: { q?: string };
};

export default async function NewContactPage({ searchParams }: Props) {
  return (
    <div className="flex justify-center">
      <Tabs defaultValue="friend" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-16 px-1.5">
          <TabsTrigger value="friend" className="font-bold text-lg p-3">
            Add a friend
          </TabsTrigger>
          <TabsTrigger value="group" className="font-bold text-lg p-3">
            Create a group
          </TabsTrigger>
        </TabsList>
        <TabsContent value="friend">
          <div className="font-bold mt-8 mb-2">Search by username</div>
          <div className="space-y-8 flex flex-col">
            <FriendSearchForm />
            <Suspense
              fallback={
                <Loader2 className="animate-spin h-20 w-20 self-center" />
              }
            >
              <FriendSearchResultServer username={searchParams.q} />
            </Suspense>
          </div>
        </TabsContent>
        <TabsContent value="group">
          <div className="mt-8">
            <CreateGroupForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
