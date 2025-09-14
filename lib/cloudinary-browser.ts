export async function uploadToCloudinary(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", "jcm-terior");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: fd }
  );

  if (!res.ok) {
    const body = await res.text(); // Cloudinary returns JSON + short message
    throw new Error(`Cloudinary upload failed: ${body}`);
  }
  const data = await res.json();
  return data.secure_url;
}
