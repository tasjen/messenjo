import ContactListClient from "./contact-list-client";
import { getUserInfo, getContacts } from "../lib/stores/server-store";

export default async function ContactListServer() {
  const [user, contacts] = await Promise.all([getUserInfo(), getContacts()]);

  return <ContactListClient user={user} contacts={contacts} />;
}
