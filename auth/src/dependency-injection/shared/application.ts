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
  AuthMiddleware,
  CryptoFactory,
  RabbitMQConnection,
  RabbitMQqueueFormatter,
  RabbitMQConfigurer,
  DomainEventFailoverPublisher
} from '@powerconnect/shared';
import { JwtConfigFactory } from '../../infrastructure/jwt/jwt-config-factory';
import { S3ConfigFactory } from '../../infrastructure/bucket/s3/s3-config-factory';
import { DynamoConfigFactory } from '../../infrastructure/persistence/dynamo/dynamo-config-factory';
import { RabbitMQConfigFactory } from '../../infrastructure/rabbitmq/rabbit-mq-config-factory';
import { RabbitMQEventBusFactory } from '../../infrastructure/rabbitmq/rabbit-mq-event-bus-factory';
import { DynamoAuthRepository } from '../../infrastructure/persistence/dynamo/dynamo-auth-repository';
import { AuthService } from '../../application/login/auth-service';
import { AuthRefreshToken } from '../../application/refresh-token/auth-refresh-token';
import AuthRefreshTokenQueryHandler from '../../application/refresh-token/auth-refresh-token-query-handler';
import { AuthSignUp } from '../../application/signup/auth-sign-up';
import { AuthSignUpCommandHandler } from '../../application/signup/auth-sign-up-command-handler';
import { AuthLogoutCommandHandler } from '../../application/logout/auth-logout-command-handler';
import { AuthLogout } from '../../application/logout/auth-logout';

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
  createDefinition({ object: AuthMiddleware, args: [sharedContainer.get('Shared.JwtManager')] })
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

sharedContainer.register('Auth.AuthService', AuthService, [
  sharedContainer.get('Auth.AuthRepository'),
  sharedContainer.get('Shared.JwtManager'),
  sharedContainer.get('Shared.Crypto')
]);

sharedContainer.register('Auth.AuthSignUp', AuthSignUp, [
  sharedContainer.get('Auth.AuthRepository'),
  sharedContainer.get('Shared.domain.EventBus'),
  sharedContainer.get('Shared.Crypto')
]);

sharedContainer.register('Auth.AuthRefreshToken', AuthRefreshToken, [
  sharedContainer.get('Auth.AuthRepository'),
  sharedContainer.get('Shared.JwtManager')
]);

sharedContainer.register('Auth.AuthLogout', AuthLogout, [
  sharedContainer.get('Auth.AuthRepository')
]);

sharedContainer
  .register('Auth.AuthSignUpCommandHandler', AuthSignUpCommandHandler, [sharedContainer.get('Auth.AuthSignUp')])
  .addTag('commandHandler');

sharedContainer
  .register('Auth.AuthCurrentUserQueryHandler', AuthRefreshTokenQueryHandler, [
    sharedContainer.get('Auth.AuthRefreshToken')
  ])
  .addTag('queryHandler');

sharedContainer
.register('Auth.AuthLogoutCommandHandler', AuthLogoutCommandHandler, [sharedContainer.get('Auth.AuthLogout')])
.addTag('commandHandler');

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
