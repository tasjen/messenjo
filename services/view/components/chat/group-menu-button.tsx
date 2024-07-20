"use client";

import { useState } from "react";
import { ChevronDown, DoorOpen, Settings, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GroupSettingsDialog from "./group-settings-dialog";
import AddMembersDialog from "./add-members-dialog";
import RemoveContactDialog from "./remove-contact-dialog";
import { toast } from "sonner";

type Props = {
  className: string;
};

export default function GroupMenuButton({ className }: Props) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddMembersOpen, setIsAddMembersOpen] = useState(false);
  const [isLeaveGroupOpen, setIsLeaveGroupOpen] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className}>
        <ChevronDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => toast("This feature is not yet available")}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          <span>Add members</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
          <Settings className="h-4 w-4 mr-2" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setIsLeaveGroupOpen(true)}>
          <DoorOpen className="h-4 w-4 mr-2" />
          <span>Leave group</span>
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
      <RemoveContactDialog
        isOpen={isLeaveGroupOpen}
        setIsOpen={setIsLeaveGroupOpen}
      />
    </DropdownMenu>
  );
}
