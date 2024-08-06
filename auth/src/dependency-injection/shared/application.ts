/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ContainerBuilder, Definition } from 'node-dependency-injection';
import {
  DynamoDBClientFactory,
  S3ClientFactory,
  WinstonLogger,
  CommandHandlers,
  InMemoryCommandBus,
  QueryHandlers,
  InMemoryQueryBus,
  JwtFactory,
  JwtMiddleware,
  CryptoFactory,
  RabbitMQConnection,
  RabbitMQqueueFormatter,
  RabbitMQConfigurer,
  DomainEventFailoverPublisher
} from '@powerConnect/shared';
import { JwtConfigFactory } from '../../infrastructure/jwt/jwt-config-factory';
import { S3ConfigFactory } from '../../infrastructure/bucket/s3/s3-config-factory';
import { DynamoConfigFactory } from '../../infrastructure/persistence/dynamo/dynamo-config-factory';
import { RabbitMQConfigFactory } from '../../infrastructure/rabbitmq/rabbit-mq-config-factory';
import { RabbitMQEventBusFactory } from '../../infrastructure/rabbitmq/rabbit-mq-event-bus-factory';
import { DynamoAuthRepository } from '../../infrastructure/persistence/dynamo/dynamo-auth-repository';
import { AuthLogin } from '../../application/login/auth-login';
import { AuthCurrentUser } from '../../application/current-user/auth-current-user';
import AuthCurrentUserQueryHandler from '../../application/current-user/auth-current-user-query-handler';
import { AuthQueryHandler } from '../../application/login/auth-query-handler';

const sharedContainer = new ContainerBuilder();
sharedContainer.setDefinition(
  'Shared.JwtConfig',
  createDefinition({ object: JwtConfigFactory, method: 'createConfig' })
);
sharedContainer.setDefinition(
  'Shared.JwtManager',
  createDefinition({ object: JwtFactory, args: [sharedContainer.get('Shared.JwtConfig')] })
);

sharedContainer.setDefinition('Shared.S3Config', createDefinition({ object: S3ConfigFactory, method: 'createConfig' }));
sharedContainer.setDefinition(
  'Shared.DynamoConfig',
  createDefinition({ object: DynamoConfigFactory, method: 'createConfig' })
);
sharedContainer.setDefinition(
  'Shared.RabbitMQConfig',
  createDefinition({ object: RabbitMQConfigFactory, method: 'createConfig' })
);
sharedContainer.setDefinition(
  'Shared.ConnectionManager',
  createDefinition({
    object: DynamoDBClientFactory,
    method: 'createClient',
    args: [sharedContainer.get('Shared.DynamoConfig'), 'Auth']
  })
);
sharedContainer.setDefinition(
  'Shared.BucketManager',
  createDefinition({
    object: S3ClientFactory,
    method: 'createClient',
    args: ['us-west-1', sharedContainer.get('Shared.S3Config')]
  })
);

sharedContainer.setDefinition('Shared.Logger', createDefinition({ object: WinstonLogger }));

sharedContainer.setDefinition(
  'Shared.JwtMiddleware',
  createDefinition({ object: JwtMiddleware, args: [sharedContainer.get('Shared.JwtManager')] })
);

sharedContainer.setDefinition('Shared.Crypto', createDefinition({ object: CryptoFactory }));

sharedContainer.setDefinition(
  'Shared.RabbitMQConnection',
  createDefinition({ object: RabbitMQConnection, args: [sharedContainer.get('Shared.RabbitMQConfig')] })
);

sharedContainer.setDefinition(
  'Shared.RabbitMQqueueFormatter',
  createDefinition({ object: RabbitMQqueueFormatter, args: ['mooc'] })
);

sharedContainer.setDefinition(
  'Shared.RabbitMQConfigurer',
  createDefinition({
    object: RabbitMQConfigurer,
    args: [sharedContainer.get('Shared.RabbitMQConnection'), sharedContainer.get('Shared.RabbitMQqueueFormatter')]
  })
);

sharedContainer.setDefinition(
  'Shared.DomainEventFailoverPublisher',
  createDefinition({ object: DomainEventFailoverPublisher, args: [sharedContainer.get('Shared.ConnectionManager')] })
);

sharedContainer.setDefinition(
  'Shared.domain.EventBus',
  createDefinition({
    object: RabbitMQEventBusFactory,
    method: 'create',
    args: [
      sharedContainer.get('Shared.DomainEventFailoverPublisher'),
      sharedContainer.get('Shared.RabbitMQConnection'),
      sharedContainer.get('Shared.RabbitMQqueueFormatter'),
      sharedContainer.get('Shared.RabbitMQConfig')
    ]
  })
);

// ------------------------------------------------------------------------------------------------------------

sharedContainer.register('Auth.AuthRepository', DynamoAuthRepository, [
  sharedContainer.get('Shared.ConnectionManager')
]);

sharedContainer.register('Auth.AuthLogin', AuthLogin, [
  sharedContainer.get('Auth.AuthRepository'),
  sharedContainer.get('Shared.JwtManager')
]);

sharedContainer.register('Auth.AuthCurrentUser', AuthCurrentUser, [sharedContainer.get('Auth.AuthRepository')]);

sharedContainer
  .register('Auth.AuthCurrentUserQueryHandler', AuthCurrentUserQueryHandler, [
    sharedContainer.get('Auth.AuthCurrentUser')
  ])
  .addTag('queryHandler');

sharedContainer
  .register('Auth.AuthQueryHandler', AuthQueryHandler, [sharedContainer.get('Auth.AuthLogin')])
  .addTag('queryHandler');

// ------------------------------------------------------------------------------------------------------------
sharedContainer.setDefinition(
  'Shared.CommandHandlers',
  createDefinition({ object: CommandHandlers, args: [getDefinitionByTag('commandHandler')] })
);
sharedContainer.setDefinition(
  'Shared.CommandBus',
  createDefinition({ object: InMemoryCommandBus, args: [sharedContainer.get('Shared.CommandHandlers')] })
);

sharedContainer.setDefinition(
  'Shared.QueryHandlers',
  createDefinition({ object: QueryHandlers, args: [getDefinitionByTag('queryHandler')] })
);
sharedContainer.setDefinition(
  'Shared.QueryBus',
  createDefinition({ object: InMemoryQueryBus, args: [sharedContainer.get('Shared.QueryHandlers')] })
);

function createDefinition({
  object,
  method,
  args = []
}: {
  object: any;
  method?: string;
  args?: Array<any>;
}): Definition {
  const definition = new Definition(object, args);
  if (method) {
    definition.setFactory(object, method);
  }
  return definition;
}

function getDefinitionByTag(taggs: string) {
  const definitions = [];
  const taggedServices = sharedContainer.findTaggedServiceIds(taggs);
  for (const { id } of taggedServices) {
    definitions.push(sharedContainer.get(id));
  }
  return definitions;
}

export default sharedContainer;
