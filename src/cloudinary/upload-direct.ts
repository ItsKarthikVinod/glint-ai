import type { CloudinaryUploadResult } from "./UploadWidget";

export async function uploadImageToCloudinary(
  file: File,
  onProgress?: (percent: number) => void,
) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary cloud name or upload preset is not set.");
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        const percentComplete = (event.loaded / event.total) * 100;
        onProgress(percentComplete);
      }
    });
      
      xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
              try {
                  resolve(JSON.parse(xhr.responseText) as CloudinaryUploadResult);
              } catch (error) {
                  reject(new Error("Failed to parse upload response."));
              }
              return
          }
          try {
              const body = JSON.parse(xhr.responseText) as {
                  error?: { message?: string }
              }
              reject(
                  new Error(body.error?.message ?? "Upload failed with status " + xhr.status)
              )
          } catch {
              reject (new Error("Upload failed with status " + xhr.status))
          }
      })

      xhr.addEventListener("error", () => {
          reject ( new Error("Upload failed. Please check your network connection and try again.") )
      })
      xhr.addEventListener("abort", () => {
          reject ( new Error("Upload aborted. Please try again.") )
      })

      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);

      xhr.send(formData);
  });
}
