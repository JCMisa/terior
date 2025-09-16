"use client";

import { useOptimistic, useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { setPublicAction } from "@/lib/actions/rooms";

export default function TogglePublic({
  roomId,
  initial,
}: {
  roomId: number;
  initial: boolean;
}) {
  // 👇 tell TS the state is a boolean
  const [optimistic, setOptimistic] = useOptimistic<boolean, boolean>(
    initial,
    (_, next) => next
  );

  const [isPending, startTransition] = useTransition();

  async function toggle(checked: boolean) {
    startTransition(async () => {
      setOptimistic(checked);
      await setPublicAction(roomId, checked);
    });
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2 dark:border-neutral-800">
      <span className="text-sm">
        {initial ? "Make this room private" : "Make this room public"}
      </span>
      <Switch
        disabled={isPending}
        checked={optimistic}
        onCheckedChange={toggle}
        className="cursor-pointer"
      />
    </div>
  );
}
