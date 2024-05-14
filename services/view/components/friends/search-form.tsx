"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Input } from "../ui/input";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { useClientStore } from "@/lib/stores/client-store";

export default function SearchForm() {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const [term, setTerm] = useState("");
  const store = useClientStore();

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (term) params.set("q", term);
    else params.delete("q");

    const contact = store.contacts?.find((e) => e.name === term);
    if (!contact) {
      replace(`${pathname}?${params.toString()}`);
      return;
    }
    replace(`/chat/${contact.groupId}`);
  }

  return (
    <form className="flex place-items-center" onSubmit={handleSearch}>
      <Input
        type="text"
        onChange={(e) => setTerm(e.target.value)}
        value={term}
        placeholder="username"
      />
      <button className="p-4">
        <Image src="/search.svg" alt="search icon" width={20} height={20} />
      </button>
    </form>
  );
}
