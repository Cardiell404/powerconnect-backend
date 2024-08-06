/* eslint-disable @typescript-eslint/no-floating-promises */
import amqplib, { ConsumeMessage } from 'amqplib';
import { ConnectionSettings } from './connection-settings';
import { RabbitMQExchangeNameFormatter } from './rabbit-mq-exchange-name-formatter';

export class RabbitMQConnection {
  private connectionSettings: ConnectionSettings;
  private channel?: amqplib.ConfirmChannel;
  private connection?: amqplib.Connection;

  constructor(params: { connectionSettings: ConnectionSettings }) {
    this.connectionSettings = params.connectionSettings;
  }

  async connect(): Promise<void> {
    this.connection = await this.amqpConnect();
    this.channel = await this.amqpChannel();
  }

  async exchange(params: { name: string }): Promise<amqplib.Replies.AssertExchange | undefined> {
    return await this.channel?.assertExchange(params.name, 'topic', { durable: true });
  }

  async queue(params: {
    exchange: string;
    name: string;
    routingKeys: string[];
    deadLetterExchange?: string;
    deadLetterQueue?: string;
    messageTtl?: number;
  }) {
    const durable = true;
    const exclusive = false;
    const autoDelete = false;
    const args = this.getQueueArguments(params);

    await this.channel?.assertQueue(params.name, {
      exclusive,
      durable,
      autoDelete,
      arguments: args
    });
    for (const routingKey of params.routingKeys) {
      await this.channel!.bindQueue(params.name, params.exchange, routingKey);
    }
  }

  private getQueueArguments(params: {
    exchange: string;
    name: string;
    routingKeys: string[];
    deadLetterExchange?: string;
    deadLetterQueue?: string;
    messageTtl?: number;
  }): any {
    let args: any = {};
    if (params.deadLetterExchange) {
      args = { ...args, 'x-dead-letter-exchange': params.deadLetterExchange };
    }
    if (params.deadLetterQueue) {
      args = { ...args, 'x-dead-letter-routing-key': params.deadLetterQueue };
    }
    if (params.messageTtl) {
      args = { ...args, 'x-message-ttl': params.messageTtl };
    }

    return args;
  }

  async deleteQueue(queue: string): Promise<amqplib.Replies.DeleteQueue> {
    return await this.channel!.deleteQueue(queue);
  }

  private async amqpConnect(): Promise<amqplib.Connection> {
    const { hostname, port, secure } = this.connectionSettings.connection;
    const { username, password, vhost } = this.connectionSettings;
    const protocol = secure ? 'amqps' : 'amqp';

    const connection = await amqplib.connect({
      protocol,
      hostname,
      port,
      username,
      password,
      vhost
    });

    connection.on('error', (err: any) => {
      Promise.reject(err);
    });

    return connection;
  }

  private async amqpChannel(): Promise<amqplib.ConfirmChannel> {
    const channel = await this.connection!.createConfirmChannel();
    await channel.prefetch(1);

    return channel;
  }

  async publish(params: {
    exchange: string;
    routingKey: string;
    content: Buffer;
    options: { messageId: string; contentType: string; contentEncoding: string; priority?: number; headers?: any };
  }) {
    const { routingKey, content, options, exchange } = params;

    return new Promise((resolve: Function, reject: Function) => {
      this.channel!.publish(exchange, routingKey, content, options, (error: any) =>
        error ? reject(error) : resolve()
      );
    });
  }

  async close(): Promise<void | undefined> {
    await this.channel?.close();
    return await this.connection?.close();
  }

  async consume(queue: string, onMessage: (message: ConsumeMessage) => {}): Promise<void> {
    await this.channel!.consume(queue, (message: ConsumeMessage | null) => {
      if (!message) {
        return;
      }
      onMessage(message);
    });
  }

  ack(message: ConsumeMessage): void {
    this.channel!.ack(message);
  }

  async retry(message: ConsumeMessage, queue: string, exchange: string) {
    const retryExchange = RabbitMQExchangeNameFormatter.retry(exchange);
    const options = this.getMessageOptions(message);

    return await this.publish({ exchange: retryExchange, routingKey: queue, content: message.content, options });
  }

  async deadLetter(message: ConsumeMessage, queue: string, exchange: string) {
    const deadLetterExchange = RabbitMQExchangeNameFormatter.deadLetter(exchange);
    const options = this.getMessageOptions(message);

    return await this.publish({ exchange: deadLetterExchange, routingKey: queue, content: message.content, options });
  }

  private getMessageOptions(message: ConsumeMessage) {
    const { messageId, contentType, contentEncoding, priority } = message.properties;
    const options = {
      messageId,
      headers: this.incrementRedeliveryCount(message),
      contentType,
      contentEncoding,
      priority
    };
    return options;
  }

  private incrementRedeliveryCount(message: ConsumeMessage): amqplib.MessagePropertyHeaders {
    if (this.hasBeenRedelivered(message)) {
      const count = parseInt(message.properties.headers['redelivery_count']);
      message.properties.headers['redelivery_count'] = count + 1;
    } else {
      message.properties.headers['redelivery_count'] = 1;
    }

    return message.properties.headers;
  }

  private hasBeenRedelivered(message: ConsumeMessage): boolean {
    return message.properties.headers['redelivery_count'] !== undefined;
  }
}
