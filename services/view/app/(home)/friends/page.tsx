import Result from "@/components/friends/result";
import SearchForm from "@/components/friends/search-form";

type Props = {
  searchParams: { q?: string | undefined };
};

export default async function FriendsPage({ searchParams }: Props) {
  return (
    <>
      <div>Search for friends</div>
      <SearchForm />
      <div className="flex flex-col items-center mt-4">
        <Result username={searchParams.q} />
      </div>
    </>
  );
}
