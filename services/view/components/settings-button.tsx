"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Settings } from "lucide-react";
import SettingsDialog from "./settings-dialog";

export default function SettingsButton() {
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setIsSettingsDialogOpen(true)}>
        <Settings />
      </Button>
      <SettingsDialog
        isOpen={isSettingsDialogOpen}
        setIsOpen={setIsSettingsDialogOpen}
      />
    </>
  );
}
