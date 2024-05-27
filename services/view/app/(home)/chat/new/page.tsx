import FriendSearchResult from "@/components/chat/friend-search-result";
import FriendSearchForm from "@/components/chat/friend-search-form";
import CreateGroupForm from "@/components/chat/create-group-form";

type Props = {
  searchParams: { q?: string | undefined };
};

export default function NewContactPage({ searchParams }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-4">
        <div className="text-lg font-bold">Add a friend</div>
        <FriendSearchForm />
        <div className="flex flex-col items-center mt-4">
          <FriendSearchResult username={searchParams.q} />
        </div>
      </div>
      <div className="flex-1 space-y-4">
        <div className="text-lg font-bold">Create a group</div>
        <CreateGroupForm />
      </div>
    </div>
  );
}
