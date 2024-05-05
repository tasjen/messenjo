import "server-only";
import { cache } from "react";
import { fetchContacts, fetchUserInfo } from "@/lib/data";

export const getContacts = cache(fetchContacts);
export const getUserInfo = cache(fetchUserInfo);
