/* eslint-disable no-console */
import { ConfigureRabbitMQCommand } from './configure-rabbit-mq-command';

ConfigureRabbitMQCommand.run()
  .then(() => {
    console.log('RabbitMQ Configuration success');
    process.exit(0);
  })
  .catch(error => {
    console.log('RabbitMQ Configuration fail', error);
    process.exit(1);
  });
