"use client";

import { useState } from "react";
import { ChevronDown, UserMinus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UnfriendDialog from "./unfriend-dialog";

type Props = {
  className: string;
};

export default function FriendMenuButton({ className }: Props) {
  const [isUnfriendOpen, setIsUnfriendOpen] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className}>
        <ChevronDown className="ring-0 focus-visible:ring-0 focus-visible:ring-transparent ring-transparent border-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setIsUnfriendOpen(true)}>
          <UserMinus className="h-4 w-4 mr-2" />
          <span>Unfriend</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
      <UnfriendDialog isOpen={isUnfriendOpen} setIsOpen={setIsUnfriendOpen} />
    </DropdownMenu>
  );
}
