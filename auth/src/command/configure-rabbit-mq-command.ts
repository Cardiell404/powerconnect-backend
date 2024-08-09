import { RabbitMQConnection, RabbitMQConfigurer, DomainEventSubscribers } from '@powerconnect/shared';
import container from '../dependency-injection';
import { RabbitMQConfig } from '../infrastructure/rabbitmq/rabbit-mq-config-factory';

export class ConfigureRabbitMQCommand {
  static async run(): Promise<void> {
    const connection = container.get<RabbitMQConnection>('Shared.RabbitMQConnection');
    const { name: exchange } = container.get<RabbitMQConfig>('Shared.RabbitMQConfig').exchangeSettings;
    await connection.connect();
    const configurer = container.get<RabbitMQConfigurer>('Shared.RabbitMQConfigurer');
    const subscribers = DomainEventSubscribers.from(container).items;
    await configurer.configure({ exchange, subscribers });
    await connection.close();
  }
}
