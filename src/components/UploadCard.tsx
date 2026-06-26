import { AlertCircle, ImageIcon } from "lucide-react";
import type { UploadStatus } from "../types";
import { useDropzone } from "react-dropzone";
import { cn } from "../lib/utils";
import { useState } from "react";
import { uploadImageToCloudinary } from "../cloudinary/upload-direct";
import { UploadWidget } from "../cloudinary/UploadWidget";

interface UploadCardProps {
  uploadStatus: UploadStatus;
  uploadError: string | null;
  onUploadStart: () => void;
  onUploadError: (error: Error) => void;
  onUploadSuccess: (result: any) => void;
}

const ACCEPT = {
  "image/jpeg": [".jpeg", ".jpg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

function UploadCard({
  uploadStatus,
  uploadError,
  onUploadStart,
  onUploadError,
  onUploadSuccess,
}: UploadCardProps) {
  const [progress, setProgress] = useState(0);
  const uploadFile = async (file: File) => {
    onUploadStart();
    setProgress(0);
    try {
      const result = await uploadImageToCloudinary(file, setProgress);
      onUploadSuccess(result);
    } catch (error) {
      onUploadError(new Error("Upload failed. Please try again."));
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      onUploadError(
        new Error("Please upload a valid image file (JPG, PNG, or WEBP)."),
      );
      return;
    }
    uploadFile(acceptedFiles[0]);
    console.log("Accepted files:", acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPT,
    maxFiles: 1,
    multiple: false,
    disabled: uploadStatus === "uploading",
    onDragEnter: undefined,
    onDragOver: undefined,
    onDragLeave: undefined,
  });

  const isUploading = uploadStatus === "uploading";

  return (
    <section id="upload" className="px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-2 text-center text-2xl font-semibold">
          Upload Your Selfie
        </h2>
        <p className="mb-8 text-center text-white/60">
          Drag, drop or click to upload your photo
        </p>
        <div
          {...getRootProps()}
          className={cn(
            "glass-card relative flex cursor-pointer flex-col items-center gap-6 p-10 transition",
            isDragActive && "border-indogo-500/50 bg-indigo-500/10",
            isUploading && "pointer-events-none opacity-80",
          )}
        >
          <input {...getInputProps()} />
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400">
            <ImageIcon className="h-10 w-10" />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium">Drag and drop your photo here</p>
            <p className="mt-1 text-sm text-white/50">
              or click to browse | JPG, PNG or WEBP
            </p>
          </div>
          {isUploading && (
            <div>
              <div>
                <div></div>
              </div>
              <p>
                Uploading... {progress > 0 ? `${Math.round(progress)}%` : ""}
              </p>
            </div>
          )}

          <div
            className="flex items-center gap-3"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <UploadWidget
              onUploadSuccess={onUploadSuccess}
              onUploadError={onUploadError}
              buttonText="Browse files"
              className={cn(
                "inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white",
                "transition hover:bg-indigo-500 disabled:cursor-wait disabled:opacity-70",
              )}
            />
          </div>
        </div>
        {uploadError && (
          <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {uploadError}
          </div>
        )}
      </div>
    </section>
  );
}

export default UploadCard;
