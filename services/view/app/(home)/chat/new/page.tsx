import FriendSearchResult from "@/components/chat/friend-search-result";
import FriendSearchForm from "@/components/chat/friend-search-form";
import CreateGroupForm from "@/components/chat/create-group-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  searchParams: { q?: string };
};

export default function NewContactPage({ searchParams }: Props) {
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
          <div className="space-y-2 mt-8">
            <div className="font-bold">Search by username</div>
            <FriendSearchForm />
            <div className="mt-4">
              <FriendSearchResult username={searchParams.q} />
            </div>
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
