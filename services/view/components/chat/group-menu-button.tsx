"use client";

import { useState } from "react";
import { ChevronDown, Settings, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GroupSettingsDialog from "./group-settings-dialog";
import AddMembersDialog from "./add-members-dialog";

type Props = {
  className: string;
};

export default function GroupMenuButton({ className }: Props) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddMembersOpen, setIsAddMembersOpen] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className}>
        <ChevronDown className="ring-0 focus-visible:ring-0 focus-visible:ring-transparent ring-transparent border-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
          <Settings className="h-4 w-4 mr-2" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setIsAddMembersOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          <span>Add members</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
      <GroupSettingsDialog
        isOpen={isSettingsOpen}
        setIsOpen={setIsSettingsOpen}
      />
      <AddMembersDialog
        isOpen={isAddMembersOpen}
        setIsOpen={setIsAddMembersOpen}
      />
    </DropdownMenu>
  );
}
