type SSEClient = {
  id: string;
  controller: ReadableStreamDefaultController;
};

class SSEBroker {
  private clients: Map<string, SSEClient> = new Map();

  /**
   * Register a new client streaming connection.
   */
  addClient(id: string, controller: ReadableStreamDefaultController) {
    this.clients.set(id, { id, controller });
  }

  /**
   * Deregister a client connection on close.
   */
  removeClient(id: string) {
    this.clients.delete(id);
  }

  /**
   * Broadcast an event to all connected clients.
   * @param event The event type identifier (e.g. 'event-update')
   * @param data Any JSON serializable payload
   */
  publish(event: string, data: any) {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    const encoder = new TextEncoder();
    const encoded = encoder.encode(payload);
    
    this.clients.forEach((client) => {
      try {
        client.controller.enqueue(encoded);
      } catch (err) {
        // Enqueue fail implies connection died. Clean it up.
        this.clients.delete(client.id);
      }
    });
  }

  /**
   * Check how many clients are active.
   */
  activeClientsCount(): number {
    return this.clients.size;
  }
}

declare const globalThis: {
  sseBrokerGlobal: SSEBroker;
} & typeof global;

// Safeguard instance recreation during Next.js live edits
export const sseBroker = globalThis.sseBrokerGlobal ?? new SSEBroker();

if (process.env.NODE_ENV !== "production") {
  globalThis.sseBrokerGlobal = sseBroker;
}
