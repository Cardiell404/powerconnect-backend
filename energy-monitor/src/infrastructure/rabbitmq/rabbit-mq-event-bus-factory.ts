import {
  RabbitMQqueueFormatter,
  RabbitMQEventBus,
  RabbitMQConnection,
  DomainEventFailoverPublisher
} from '@powerconnect/shared';
import { RabbitMQConfig } from './rabbit-mq-config-factory';

export class RabbitMQEventBusFactory {
  static create(
    failoverPublisher: DomainEventFailoverPublisher,
    connection: RabbitMQConnection,
    queueNameFormatter: RabbitMQqueueFormatter,
    config: RabbitMQConfig
  ): RabbitMQEventBus {
    return new RabbitMQEventBus({
      failoverPublisher,
      connection,
      exchange: config.exchangeSettings.name,
      queueNameFormatter: queueNameFormatter,
      maxRetries: config.maxRetries
    });
  }
}
