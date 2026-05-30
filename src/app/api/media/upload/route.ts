import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/app/actions/auth";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // Verify that the user is an authenticated administrator
        const adminSession = await getAdminSession();
        if (!adminSession) {
          throw new Error("Unauthorized. Admin session required.");
        }

        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "video/mp4",
            "video/quicktime",
            "video/webm",
            "video/x-m4v"
          ],
          tokenPayload: JSON.stringify({
            username: adminSession,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // This is triggered on the server after upload finishes.
        console.log(`Blob upload completed successfully: ${blob.url}`);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred during upload authorization" },
      { status: 400 }
    );
  }
}
