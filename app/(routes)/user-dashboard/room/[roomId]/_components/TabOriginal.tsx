"use client";

import Image from "next/image";
import EditPopover from "./EditPopover";
import TogglePublic from "./TogglePublic";
import { DownloadIcon, Link2Icon } from "lucide-react";
import { toast } from "sonner";

function ImageActions({ url }: { url: string }) {
  const fileName = url.split("/").pop() || "image.jpg";

  const download = async () => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      toast.error("Download failed.");
    }
  };

  const copyLink = () =>
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success("Link copied to clipboard."))
      .catch(() => toast.error("Could not copy link."));

  return (
    <div className="absolute top-2 right-2 flex gap-2 rounded-lg bg-white/40 dark:bg-black/40 p-1 backdrop-blur-sm">
      <button
        onClick={download}
        className="rounded p-1.5  hover:bg-white/20"
        aria-label="Download image"
      >
        <DownloadIcon className="size-4" />
      </button>
      <button
        onClick={copyLink}
        className="rounded p-1.5  hover:bg-white/20"
        aria-label="Copy image URL"
      >
        <Link2Icon className="size-4" />
      </button>
    </div>
  );
}

export default function TabOriginal({
  room,
  canEdit,
}: {
  room: RoomType;
  canEdit: boolean;
}) {
  const src = room.originalImageUrl || "/not-designed.png";

  return (
    <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
      {/* editable title + popover */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Original description</h3>
        {canEdit && (
          <EditPopover
            field="originalRoomDescription"
            roomId={room.id}
            defaultValue={room.originalRoomDescription ?? ""}
          />
        )}
      </div>

      <p className="text-sm text-neutral-700 dark:text-neutral-300">
        {room.originalRoomDescription || "No description provided."}
      </p>

      {/* non-editable image */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
        <Image src={src} alt="Original room" fill className="object-cover" />
        <ImageActions url={src} />
      </div>

      {/* public toggle lives only once – put it wherever you want */}
      {canEdit && (
        <TogglePublic roomId={room.id} initial={room.public as boolean} />
      )}
    </div>
  );
}
