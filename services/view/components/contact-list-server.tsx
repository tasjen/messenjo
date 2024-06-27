import ContactListClient from "@/components/contact-list-client";
import { getUserInfo, getContacts } from "@/lib/store/server";

export default async function ContactListServer() {
  const [user, contacts] = await Promise.all([getUserInfo(), getContacts()]);

  return <ContactListClient user={user} contacts={contacts} />;
}
