import { SendHorizonal } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function ChatFormSkeleton() {
  return (
    <form>
      <div className="flex gap-4">
        <Input disabled />
        <Button type="submit" disabled>
          <SendHorizonal />
        </Button>
      </div>
    </form>
  );
}
