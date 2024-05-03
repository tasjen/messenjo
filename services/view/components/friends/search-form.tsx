"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Input } from "../ui/input";
import Image from "next/image";
import { FormEvent, useState } from "react";

export default function SearchForm() {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const [term, setTerm] = useState("");

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    console.log(`Searching... ${term}`);
    const params = new URLSearchParams(searchParams);
    console.log(params);
    if (term) params.set("q", term);
    else params.delete("q");
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <form className="flex place-items-center" onSubmit={handleSearch}>
      <Input
        type="text"
        onChange={(e) => setTerm(e.target.value)}
        value={term}
      />
      <button className="p-4">
        <Image src="/search.svg" alt="search icon" width={20} height={20} />
      </button>
    </form>
  );
}
