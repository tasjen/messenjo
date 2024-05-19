"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { FormEvent, useState } from "react";
import { useClientStore } from "@/lib/stores/client-store";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

export default function SearchForm() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [term, setTerm] = useState("");
  const store = useClientStore();

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (term) params.set("q", term);
    else params.delete("q");

    const contact = store.contacts?.find((e) => e.name === term);
    if (!contact || contact.type === "group") {
      router.replace(`${pathname}?${params.toString()}`);
      return;
    }
    router.replace(`/chat/${contact.groupId}`);
  }

  return (
    <form className="flex place-items-center" onSubmit={handleSearch}>
      <Input
        type="text"
        onChange={(e) => setTerm(e.target.value)}
        value={term}
        placeholder="username"
      />
      <Button className="ml-2">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
}
