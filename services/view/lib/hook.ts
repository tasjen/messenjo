import { Option } from "@/components/ui/multi-select";
import { useStore } from "./store/client";

export function useMemberOptions(): Option[] {
  const store = useStore();
  return store.contacts
    .filter((contact) => contact.type === "friend")
    .map((contact) => ({
      img: contact.pfp,
      value: contact.userId,
      label: contact.name,
    }));
}
