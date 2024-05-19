"use client";

import { useTheme } from "next-themes";
import { Switch } from "./ui/switch";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  return (
    <Switch
      defaultChecked={theme === "dark"}
      onCheckedChange={() => setTheme(theme === "light" ? "dark" : "light")}
    />
  );
}
