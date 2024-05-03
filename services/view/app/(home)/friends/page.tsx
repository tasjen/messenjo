import Result from "@/components/friends/result";
import SearchForm from "@/components/friends/search-form";

type Props = {
  searchParams: { q?: string | undefined };
};

export default async function FriendsPage({ searchParams }: Props) {
  return (
    <>
      <SearchForm />
      <Result username={searchParams.q} />
    </>
  );
}
