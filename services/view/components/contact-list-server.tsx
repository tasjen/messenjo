import { fetchContacts, fetchUserData } from "@/lib/data";
import ContactListClient from "./contact-list-client";
import { serverStore } from "@/lib/stores/server-store";

export default async function ContactListServer() {
  const [user, contacts] = await Promise.all([
    fetchUserData(),
    fetchContacts(),
  ]);
  serverStore.setState({ user, contacts });

  return <ContactListClient user={user} contacts={contacts} />;
}
