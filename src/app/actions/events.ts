"use server";

import db from "@/lib/db";
import { getAdminSession } from "./auth";
import { uploadFile } from "@/lib/storage";
import { sseBroker } from "@/lib/sse";
import { revalidatePath } from "next/cache";

export type CreateEventResult = {
  success: boolean;
  error?: string;
};

/**
 * Server action to create a new event with attachments.
 */
export async function createEventAction(formData: FormData): Promise<CreateEventResult> {
  // 1. Verify admin session
  const adminSession = await getAdminSession();
  if (!adminSession) {
    return { success: false, error: "Unauthorized. Admin session required." };
  }

  // 2. Extract fields
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const dateStr = formData.get("date") as string;

  if (!title || !description || !dateStr) {
    return { success: false, error: "Title, description, and date are required." };
  }

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return { success: false, error: "Invalid date format." };
    }

    // 3. Extract media files (either pre-uploaded Vercel Blob URLs or raw Form Files)
    const uploadedUrlsJson = formData.get("uploadedUrls") as string | null;
    const uploadedMedia: { url: string; type: string }[] = [];

    if (uploadedUrlsJson) {
      try {
        const preUploaded: { url: string; type: "IMAGE" | "VIDEO" }[] = JSON.parse(uploadedUrlsJson);
        for (const item of preUploaded) {
          uploadedMedia.push({
            url: item.url,
            type: item.type,
          });
        }
      } catch (err) {
        return { success: false, error: "Failed to parse pre-uploaded media links." };
      }
    } else {
      // Fall back to standard server-side raw file uploads (local filesystem dev fallback)
      const mediaFiles = formData.getAll("media") as File[];

      // Whitelists of secure web-safe extensions to prevent stored XSS (excluding .svg, .html, etc.)
      const ALLOWED_IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
      const ALLOWED_VIDEO_EXTENSIONS = [".mp4", ".mov", ".webm", ".m4v"];

      for (const file of mediaFiles) {
        // Filter out empty entries (sometimes empty files get submitted in forms)
        if (file.size === 0 || !file.name) continue;

        // Determine file type
        const isVideo = file.type.startsWith("video/");
        const isImage = file.type.startsWith("image/");

        if (!isImage && !isVideo) {
          return { success: false, error: `Unsupported file type: ${file.name}. Only images and videos are allowed.` };
        }

        // Verify file extension strictly to protect against MIME-type spoofing and stored script injections
        const dotIndex = file.name.lastIndexOf(".");
        const fileExt = dotIndex !== -1 ? file.name.slice(dotIndex).toLowerCase() : "";

        const isAllowedImage = isImage && ALLOWED_IMAGE_EXTENSIONS.includes(fileExt);
        const isAllowedVideo = isVideo && ALLOWED_VIDEO_EXTENSIONS.includes(fileExt);

        if (!isAllowedImage && !isAllowedVideo) {
          return { 
            success: false, 
            error: `Security Check Failed: The file "${file.name}" has an invalid extension or content-type mismatch. Only standard web images (.png, .jpg, .jpeg, .webp, .gif) and videos (.mp4, .mov, .webm, .m4v) are allowed.` 
          };
        }

        // Upload file using our dynamic storage engine
        const fileUrl = await uploadFile(file);
        uploadedMedia.push({
          url: fileUrl,
          type: isVideo ? "VIDEO" : "IMAGE",
        });
      }
    }

    // 4. Save Event and Media in a transaction
    await db.event.create({
      data: {
        title,
        description,
        date,
        media: {
          create: uploadedMedia,
        },
      },
    });

    // 5. Broadcast to all listening Server-Sent Events (SSE) clients
    sseBroker.publish("update", {
      timestamp: Date.now(),
      message: `New event "${title}" posted!`,
    });

    // 6. Trigger page cache refresh
    revalidatePath("/events");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to create event:", error);
    return { success: false, error: error.message || "An error occurred while creating the event." };
  }
}

/**
 * Server action to delete an event.
 */
export async function deleteEventAction(id: string): Promise<CreateEventResult> {
  // 1. Verify session
  const adminSession = await getAdminSession();
  if (!adminSession) {
    return { success: false, error: "Unauthorized. Admin session required." };
  }

  try {
    // 2. Fetch event to get media files for cleanup (optional, prisma handles cascade DB delete)
    const event = await db.event.findUnique({
      where: { id },
      include: { media: true },
    });

    if (!event) {
      return { success: false, error: "Event not found." };
    }

    // 3. Delete event (Prisma cascade delete will remove media table rows automatically)
    await db.event.delete({
      where: { id },
    });

    // 4. Broadcast the change to clients
    sseBroker.publish("update", {
      timestamp: Date.now(),
      message: `Event "${event.title}" has been deleted.`,
    });

    // 5. Trigger cache refresh
    revalidatePath("/events");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete event:", error);
    return { success: false, error: error.message || "An error occurred while deleting the event." };
  }
}

/**
 * Fetch all events with their corresponding media.
 */
export async function getEvents() {
  try {
    return await db.event.findMany({
      include: {
        media: true,
      },
      orderBy: {
        date: "desc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }
}

/**
 * Helper server action to check if Vercel Blob storage is configured in the environment.
 * If true, the client-side component uploads files directly to bypass Vercel request body limits.
 */
export async function isBlobConfiguredAction(): Promise<boolean> {
  return typeof process.env.BLOB_READ_WRITE_TOKEN === "string" && process.env.BLOB_READ_WRITE_TOKEN.length > 0;
}
