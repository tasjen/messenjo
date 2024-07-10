"use client";

import { useState } from "react";
import { ChevronDown, UserMinus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import RemoveContactDialog from "./remove-contact-dialog";

type Props = {
  className: string;
};

export default function FriendMenuButton({ className }: Props) {
  const [isUnfriendOpen, setIsUnfriendOpen] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className}>
        <ChevronDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setIsUnfriendOpen(true)}>
          <UserMinus className="h-4 w-4 mr-2" />
          <span>Unfriend</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
      <RemoveContactDialog
        isOpen={isUnfriendOpen}
        setIsOpen={setIsUnfriendOpen}
      />
    </DropdownMenu>
  );
}
