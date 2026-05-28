import { sseBroker } from "@/lib/sse";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const clientId = `client_${Math.random().toString(36).substring(2, 9)}`;
  const encoder = new TextEncoder();
  let heartbeatInterval: NodeJS.Timeout;

  const stream = new ReadableStream({
    start(controller) {
      // Register this client streaming channel
      sseBroker.addClient(clientId, controller);

      // Send immediate connection acknowledgment
      try {
        controller.enqueue(
          encoder.encode(`event: connected\ndata: ${JSON.stringify({ id: clientId })}\n\n`)
        );
      } catch (err) {
        console.error("Failed to send initial SSE payload", err);
        sseBroker.removeClient(clientId);
        return;
      }

      // Heartbeat pulse every 25 seconds to keep serverless & browser tunnels open
      heartbeatInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode("event: ping\ndata: {}\n\n"));
        } catch {
          clearInterval(heartbeatInterval);
          sseBroker.removeClient(clientId);
        }
      }, 25000);

      // Clean up if connection is terminated
      req.signal.addEventListener("abort", () => {
        clearInterval(heartbeatInterval);
        sseBroker.removeClient(clientId);
      });
    },
    cancel() {
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      sseBroker.removeClient(clientId);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no", // Bypass NGINX buffering (great for deployment)
    },
  });
}
