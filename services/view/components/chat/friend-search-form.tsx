"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function FriendSearchForm() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [term, setTerm] = useState("");

  function handleSubmit(event: FormEvent): void {
    event.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (term) params.set("q", term);
    else params.delete("q");

    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <form className="flex place-items-center" onSubmit={handleSubmit}>
      <Input
        type="search"
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
