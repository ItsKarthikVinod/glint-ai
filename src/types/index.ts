import type { CloudinaryImage } from "@cloudinary/url-gen/assets/CloudinaryImage";

export type UploadStatus = "idle" | "uploading" | "success" | "error";

export type PresetCategory = "style"

export type ExportFormat = "jpg" | "png" | "webp"

export interface HeadshotPreset {
    id: string;
    name: string;
    description: string;
    category: PresetCategory;
    transformationChain: string;
    build: (publicId: string) => CloudinaryImage
}