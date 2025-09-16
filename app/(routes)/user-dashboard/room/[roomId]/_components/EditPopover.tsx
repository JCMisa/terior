"use client";

import { useState } from "react";
import { LoaderCircleIcon, PenSquareIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { updateRoomDescription } from "@/lib/actions/rooms"; // new server action
import { toast } from "sonner";
import { showConfetti } from "@/lib/utils";

export default function EditPopover({
  field,
  roomId,
  defaultValue,
}: {
  field: "originalRoomDescription" | "redesignedRoomDescription";
  roomId: number;
  defaultValue: string;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(defaultValue);
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    try {
      const res = await updateRoomDescription(roomId, field, text.trim());
      if (res.success) {
        toast.success("Updated Successfully");
        showConfetti();
        setOpen(false);
      } else {
        toast.success("Failed to update");
      }
    } catch (error) {
      console.log("update room description error: ", error);
      toast.error("Internal error occured");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <PenSquareIcon className="size-4 cursor-pointer text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100" />
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-md border border-neutral-400 bg-transparent
                     px-2 py-1.5 text-sm focus:outline-none focus:ring-0
                     dark:border-neutral-600 custom-scrollbar"
          rows={7}
        />
        <div className="mt-2 flex justify-end gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setOpen(false)}
            className="cursor-pointer"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={save}
            disabled={loading}
            className="cursor-pointer text-white"
          >
            {loading ? (
              <LoaderCircleIcon className="size-4 animate-spin" />
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
