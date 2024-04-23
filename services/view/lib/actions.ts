"use server";

export type Message = {
  user_id: string;
  group_id: string;
  date: string;
};

export type State = {
  error?: string | null;
};

export async function sendMessage(message: Message) {
  console.log(JSON.stringify(message.date));
}
