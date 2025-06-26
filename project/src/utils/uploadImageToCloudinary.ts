export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "avatars"); // ← preset dùng chung

  const cloudName = "dhcb4jyua";

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Upload failed");

  return data.secure_url;
};
