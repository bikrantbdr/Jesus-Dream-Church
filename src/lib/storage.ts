import { put } from "@vercel/blob";
import fs from "fs";
import path from "path";

/**
 * Uploads a file to the active storage system.
 * If BLOB_READ_WRITE_TOKEN is defined in the environment, it uses Vercel Blob.
 * Otherwise, it stores the file locally in the `public/uploads` directory.
 * 
 * @param file The file object to upload
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // If Vercel Blob token is provided, upload directly to Vercel Blob for cloud hosting.
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(file.name, file, {
        access: "public",
      });
      return blob.url;
    } catch (error) {
      console.error("Vercel Blob upload failed, falling back to local filesystem:", error);
    }
  }

  // Local filesystem fallback (Ideal for offline/development running).
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  
  // Ensure the directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Create a unique filename to avoid namespace collisions
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const uniqueFilename = `${Date.now()}-${cleanFileName}`;
  const filepath = path.join(uploadsDir, uniqueFilename);
  
  fs.writeFileSync(filepath, buffer);

  // Return the web-accessible relative path
  return `/uploads/${uniqueFilename}`;
}
