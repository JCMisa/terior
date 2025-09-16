"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { updateRoomName } from "@/lib/actions/rooms";
import { showConfetti } from "@/lib/utils";
import { LoaderCircleIcon, PenSquareIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface EditRoomNameProps {
  roomId: number;
  currentName: string;
}

const EditRoomName = ({ roomId, currentName }: EditRoomNameProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || name.trim() === currentName) {
      toast.error("No changes detected.");
      return;
    }

    setLoading(true);
    const res = await updateRoomName(roomId, name.trim());
    setLoading(false);

    if (res.success) {
      toast.success("Room name updated.");
      showConfetti();
      setOpen(false);
    } else {
      toast.error("Could not update name.");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <PenSquareIcon className="size-5 cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent align="end" className="flex flex-col space-y-2">
        <label
          htmlFor="roomName"
          className="block text-gray-800 dark:text-gray-200 font-semibold text-sm"
        >
          Room Name
        </label>
        <div className="mt-2">
          <input
            type="text"
            id="roomName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full rounded-md border border-neutral-400 bg-transparent
            px-2 py-1.5 text-neutral-900 placeholder:text-neutral-500
            focus:outline-none focus:ring-0
            dark:border-neutral-600 dark:text-neutral-100"
          />
        </div>
        <label className="pt-1 block text-muted-foreground text-xs">
          Enter desired room name.
        </label>
        <Button
          onClick={handleSave}
          disabled={loading}
          size={"sm"}
          className="text-white cursor-pointer"
        >
          {loading ? (
            <LoaderCircleIcon className="size-4 animate-spin" />
          ) : (
            "Save"
          )}
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default EditRoomName;
