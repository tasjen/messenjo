import { fetchContacts, fetchUserData } from "@/lib/data";
import ContactListClient from "./contact-list-client";
import { useStore } from "@/lib/zustand-provider";

export default async function ContactListServer() {
  const [user, contacts] = await Promise.all([
    fetchUserData(),
    fetchContacts(),
  ]);
  useStore.setState({ user, contacts });

  // console.log("renderContacts --------------------");

  return <ContactListClient user={user} contacts={contacts} />;
}
