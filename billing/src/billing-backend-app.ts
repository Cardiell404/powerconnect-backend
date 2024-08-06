import { IncomingMessage, Server as HttpServer, ServerResponse } from 'http';
import { Server } from './server';

export class BillingBackendApp {
  server?: Server;

  async start(): Promise<void> {
    const port = process.env.PORT || '3000';
    this.server = new Server(port);
    return this.server.listen();
  }

  get httpServer(): HttpServer<typeof IncomingMessage, typeof ServerResponse> | undefined {
    return this.server?.getHTTPServer();
  }

  async stop(): Promise<void> {
    return this.server?.stop();
  }
}
