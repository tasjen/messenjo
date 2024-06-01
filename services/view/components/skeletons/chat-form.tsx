import { SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
