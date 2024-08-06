import { DomainEvent } from '../../../domain/domain-event';
import { DomainEventSubscriber } from '../../../domain/domain-event-subscriber';
import { DomainEventDeserializer } from '../domain-event-deserializer';
import { RabbitMQConnection } from './rabbit-mq-connection';
import { RabbitMQConsumer } from './rabbit-mq-consumer';

export class RabbitMQConsumerFactory {
  constructor(
    private deserializer: DomainEventDeserializer,
    private connection: RabbitMQConnection,
    private maxRetries: number
  ) {}

  build(subscriber: DomainEventSubscriber<DomainEvent>, exchange: string, queueName: string): RabbitMQConsumer {
    return new RabbitMQConsumer({
      subscriber,
      deserializer: this.deserializer,
      connection: this.connection,
      queueName,
      exchange,
      maxRetries: this.maxRetries
    });
  }
}
