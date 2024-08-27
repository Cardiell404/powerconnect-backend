import { IncomingMessage, Server as HttpServer, ServerResponse } from 'http';
import { Server } from './server';
import container from './dependency-injection';
import { RabbitMQConnection } from '@powerconnect/shared';

export class CustomerBackendApp {
  server?: Server;

  async start(): Promise<void> {
    const port = process.env.PORT || '3000';
    this.server = new Server(port);
    await this.configureEventBus();

    return this.server.listen();
  }

  get httpServer(): HttpServer<typeof IncomingMessage, typeof ServerResponse> | undefined {
    return this.server?.getHTTPServer();
  }

  async stop(): Promise<void> {
    const rabbitMQConnection = container.get<RabbitMQConnection>('Shared.RabbitMQConnection');
    await rabbitMQConnection.close();
    return this.server?.stop();
  }

  private async configureEventBus(): Promise<void> {
    const rabbitMQConnection = container.get<RabbitMQConnection>('Shared.RabbitMQConnection');
    await rabbitMQConnection.connect();
  }
}
