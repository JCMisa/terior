import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadFromBlob(blob: Blob, name: string) {
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const res = await cloudinary.uploader.upload(
    `data:${blob.type};base64,${buffer.toString("base64")}`,
    { resource_type: "image", public_id: name, overwrite: true }
  );
  return res.secure_url; // https://res.cloudinary.com/...
}
