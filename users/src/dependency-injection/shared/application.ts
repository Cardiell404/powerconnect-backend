/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ContainerBuilder, Definition } from 'node-dependency-injection';
import {
  DynamoDBClientFactory,
  WinstonLogger,
  CommandHandlers,
  InMemoryCommandBus,
  QueryHandlers,
  InMemoryQueryBus,
  RabbitMQConnection,
  RabbitMQqueueFormatter,
  RabbitMQConfigurer,
  DomainEventFailoverPublisher,
  JwtFactory,
  AuthMiddleware
} from '@powerconnect/shared';
import { DynamoConfigFactory } from '../../infrastructure/persistence/dynamo/dynamo-config-factory';
import { RabbitMQConfigFactory } from '../../infrastructure/rabbitmq/rabbit-mq-config-factory';
import { RabbitMQEventBusFactory } from '../../infrastructure/rabbitmq/rabbit-mq-event-bus-factory';
import { DynamoUserRepository } from '../../infrastructure/persistence/dynamo/dynamo-user-repository';
import { UserFinder } from '../../application/find/user-finder';
import { FindUserQueryHandler } from '../../application/find/find-user-query-handler';
import { UserByFilterSearcher } from '../../application/search-by-filters/user-by-filter-searcher';
import { SearchUserByFilterQueryHandler } from '../../application/search-by-filters/search-user-by-filter-query-handler';
import { CreateUserOnAuthCreated } from '../../application/events/created/create-user-on-auth-created';
import { AuthUserCreationService } from '../../application/events/created/auth-user-creation-service';
import { CustomerUserCreationService } from '../../application/events/created/customer-user-creation-service';
import { CreateUserOnCustomerCreated } from '../../application/events/created/create-user-on-customer-created';
import { JwtConfigFactory } from '../../infrastructure/jwt/jwt-config-factory';
import { GetUserByIdQueryHandler } from '../../application/get-user-by-id/get-user-by-id-query-handler';
import { GetUserById } from '../../application/get-user-by-id/get-user-by-id';

const sharedContainer = new ContainerBuilder();
sharedContainer.setDefinition(
  'Shared.JwtConfig',
  createDefinition({ object: JwtConfigFactory, method: 'createConfig' })
);
sharedContainer.setDefinition(
  'Shared.JwtManager',
  createDefinition({ object: JwtFactory, args: [sharedContainer.get('Shared.JwtConfig')] })
);

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
    args: [sharedContainer.get('Shared.DynamoConfig'), 'User']
  })
);

sharedContainer.setDefinition('Shared.Logger', createDefinition({ object: WinstonLogger }));

sharedContainer.setDefinition(
  'Shared.JwtMiddleware',
  createDefinition({ object: AuthMiddleware, args: [sharedContainer.get('Shared.JwtManager')] })
);

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
sharedContainer.register('User.UserRepository', DynamoUserRepository, [
  sharedContainer.get('Shared.ConnectionManager')
]);

sharedContainer.register('User.UserFinder', UserFinder, [sharedContainer.get('User.UserRepository')]);

sharedContainer.register('User.GetUserById', GetUserById, [sharedContainer.get('User.UserRepository')]);

sharedContainer
  .register('User.FindUserQueryHandler', FindUserQueryHandler, [sharedContainer.get('User.UserFinder')])
  .addTag('queryHandler');

sharedContainer.register('User.UserByFilterSearcher', UserByFilterSearcher, [
  sharedContainer.get('User.UserRepository')
]);

sharedContainer
  .register('User.SearchUserByFilterQueryHandler', SearchUserByFilterQueryHandler, [
    sharedContainer.get('User.UserByFilterSearcher')
  ])
  .addTag('queryHandler');

sharedContainer
.register('User.GetUserByIdQueryHandler', GetUserByIdQueryHandler, [
  sharedContainer.get('User.GetUserById')
])
.addTag('queryHandler');

sharedContainer.register('User.AuthUserCreationService', AuthUserCreationService, [
  sharedContainer.get('User.UserRepository')
]);

sharedContainer
  .register('User.CreateUserOnAuthCreated', CreateUserOnAuthCreated, [
    sharedContainer.get('User.AuthUserCreationService')
  ])
  .addTag('domainEventSubscriber');

sharedContainer.register('User.CustomerUserCreationService', CustomerUserCreationService, [
  sharedContainer.get('User.UserRepository')
]);

sharedContainer
  .register('User.CreateUserOnCustomerCreated', CreateUserOnCustomerCreated, [
    sharedContainer.get('User.CustomerUserCreationService')
  ])
  .addTag('domainEventSubscriber');

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
