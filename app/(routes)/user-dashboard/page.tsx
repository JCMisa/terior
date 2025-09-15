"use client";

import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { Compare } from "@/components/ui/compare";
import { api, getAxiosError } from "@/lib/axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { uploadToCloudinary } from "@/lib/cloudinary-browser";
import { createRoom } from "@/lib/actions/rooms";
import { showConfetti } from "@/lib/utils";
import { useRouter } from "next/navigation";

type Status =
  | "idle"
  | "uploading"
  | "checking"
  | "describing"
  | "redesigning"
  | "diffusing"
  | "uploading-final"
  | "done";

const STATUS_LABEL: Record<Status, string> = {
  idle: "",
  uploading: "Uploading image…",
  checking: "Verifying room type…",
  describing: "Analysing room details…",
  redesigning: "Creating redesign prompt…",
  diffusing: "Generating new image (SD3)…",
  "uploading-final": "Saving final image…",
  done: "",
};

export default function UserDashboard() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [roomName, setRoomName] = useState("");
  const [userPrompt, setUserPrompt] = useState("");

  const [origUrl, setOrigUrl] = useState("");
  const [redesignedUrl, setRedesignedUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  /* ---------- file drop / pick ---------- */
  const handleFileUpload = (files: File[]) => {
    if (!files.length) return;
    const f = files[0];
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  /* ---------- redesign flow with status ---------- */
  const handleRedesign = async () => {
    if (!file || !roomName.trim()) return toast.error("Room name required");
    setStatus("uploading");
    try {
      const imageUrl = await uploadToCloudinary(file);
      setStatus("checking");
      const { data } = await api.post("/redesign", {
        imageUrl,
        roomName,
        userPrompt,
      });
      if (!data.ok && data.error === "NOT_A_ROOM") {
        toast.error("Uploaded image is not a room");
        setStatus("idle");
        return;
      }
      setOrigUrl(data.originalUrl);
      setRedesignedUrl(data.redesignedUrl);

      const saveToDb = await createRoom(
        roomName,
        userPrompt,
        data.originalUrl,
        data.description,
        data.redesignedUrl,
        data.redesigned
      );
      if (saveToDb?.success) {
        toast.success(`${saveToDb.data} saved successfully!`);
        showConfetti();
        router.push(`/user-dashboard/room/${saveToDb.roomId}`);
      }
      setStatus("done");
      toast.success("Redesign complete!");
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error(getAxiosError(e as any));
      setStatus("idle");
    } finally {
      setStatus("idle");
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* LEFT – upload */}
        <div className="w-full lg:w-1/2">
          <FileUpload onChange={handleFileUpload} />
        </div>

        {/* RIGHT – info + form */}
        <div className="w-full lg:w-1/2 space-y-4">
          {file && (
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Uploaded: <span className="font-semibold">{file.name}</span> (
                {(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
              {preview && (
                <Image
                  width={1000}
                  height={1000}
                  src={preview}
                  alt="preview"
                  className="mt-2 max-h-52 rounded object-cover"
                />
              )}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRedesign();
            }}
            className="space-y-3"
          >
            <label className="block text-sm font-medium">Room name</label>
            <input
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2"
              placeholder="e.g. My living-room"
              required
            />

            <label className="block text-sm font-medium">
              Redesign idea (optional)
            </label>
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2"
              placeholder="Scandinavian, minimal, industrial..."
            />

            <button
              type="submit"
              disabled={status !== "idle" || !file}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium disabled:opacity-50 cursor-pointer text-white"
            >
              {status === "idle" ? (
                "Redesign"
              ) : (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {status !== "idle" && STATUS_LABEL[status]}
            </button>
          </form>
        </div>
      </div>

      {/* COMPARE SLIDER */}
      {origUrl && redesignedUrl && status === "done" && (
        <div className="mt-6 w-full max-w-5xl mx-auto">
          <h2 className="text-center mb-4 text-lg font-semibold">
            Before vs After
          </h2>
          <div className="w-full rounded-2xl border border-neutral-200 bg-neutral-100 p-2 dark:border-neutral-800 dark:bg-neutral-900">
            <Compare
              firstImage={origUrl}
              secondImage={redesignedUrl}
              firstImageClassName="object-cover w-full h-full"
              secondImageClassname="object-cover w-full h-full"
              className="w-full h-[480px] rounded-xl"
              slideMode="drag"
              autoplay={false}
              showHandlebar
            />
          </div>
        </div>
      )}
    </div>
  );
}
