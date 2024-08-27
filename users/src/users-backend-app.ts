import { IncomingMessage, Server as HttpServer, ServerResponse } from 'http';
import { Server } from './server';
import { DomainEventSubscribers, EventBus, RabbitMQConnection } from '@powerconnect/shared';
import container from './dependency-injection';

export class UsersBackendApp {
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
    const eventBus = container.get<EventBus>('Shared.domain.EventBus');
    const rabbitMQConnection = container.get<RabbitMQConnection>('Shared.RabbitMQConnection');
    await rabbitMQConnection.connect();
    eventBus.addSubscribers(DomainEventSubscribers.from(container));
  }
}
