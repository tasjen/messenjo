type Message = {
  from_username: string;
  content: string;
  sent_at: string;
};

type Props = {
  messages: Message[];
};

export default function ChatBoard({ messages }: Props) {
  return <div></div>;
}
