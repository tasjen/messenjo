import FriendSearchResult from "@/components/chat/friend-search-result";
import FriendSearchForm from "@/components/chat/friend-search-form";
import CreateGroupForm from "@/components/chat/create-group-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  searchParams: { q?: string | undefined };
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
          <div className="space-y-4">
            <div className="text-lg font-bold">Add a friend</div>
            <FriendSearchForm />
            <div className="flex flex-col items-center mt-4">
              <FriendSearchResult username={searchParams.q} />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="group">
          <CreateGroupForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
