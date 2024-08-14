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
  DomainEventFailoverPublisher
} from '@powerconnect/shared';
import { DynamoConfigFactory } from '../../infrastructure/persistence/dynamo/dynamo-config-factory';
import { RabbitMQConfigFactory } from '../../infrastructure/rabbitmq/rabbit-mq-config-factory';
import { RabbitMQEventBusFactory } from '../../infrastructure/rabbitmq/rabbit-mq-event-bus-factory';
import { DynamoCustomerRepository } from '../../infrastructure/persistence/dynamo/dynamo-customer-repository';
import { CustomerCreator } from '../../application/create/customer-creator';
import { CreateCustomerCommandHandler } from '../../application/create/create-customer-command-handler';
import { CustomerDeleter } from '../../application/delete/customer-deleter';
import { DeleteCustomerCommandHandler } from '../../application/delete/delete-customer-command-handler';
import { CustomerFinder } from '../../application/find/customer-finder';
import { FindCustomerQueryHandler } from '../../application/find/find-customer-query-handler';
import { CustomerByFilterSearcher } from '../../application/search-by-filters/customer-by-filter-searcher';
import { SearchCustomerByFilterQueryHandler } from '../../application/search-by-filters/search-customer-by-filter-query-handler';
import { CustomerUpdater } from '../../application/update/customer-updater';
import { UpdateCustomerCommandHandler } from '../../application/update/update-customer-command-handler';

const sharedContainer = new ContainerBuilder();

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

sharedContainer.setDefinition('Shared.Logger', createDefinition({ object: WinstonLogger }));

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
sharedContainer.register('Customer.CustomerRepository', DynamoCustomerRepository, [
  sharedContainer.get('Shared.ConnectionManager')
]);

sharedContainer.register('Customer.CustomerCreator', CustomerCreator, [
  sharedContainer.get('Customer.CustomerRepository'),
  sharedContainer.get('Shared.domain.EventBus')
]);

sharedContainer
  .register('Customer.CreateCustomerCommandHandler', CreateCustomerCommandHandler, [
    sharedContainer.get('Customer.CustomerCreator')
  ])
  .addTag('commandHandler');

sharedContainer.register('Customer.CustomerDeleter', CustomerDeleter, [
  sharedContainer.get('Customer.CustomerRepository'),
  sharedContainer.get('Shared.domain.EventBus')
]);

sharedContainer
  .register('Customer.DeleteCustomerCommandHandler', DeleteCustomerCommandHandler, [
    sharedContainer.get('Customer.CustomerDeleter')
  ])
  .addTag('commandHandler');

sharedContainer.register('Customer.CustomerFinder', CustomerFinder, [
  sharedContainer.get('Customer.CustomerRepository')
]);

sharedContainer
  .register('Customer.FindCustomerQueryHandler', FindCustomerQueryHandler, [
    sharedContainer.get('Customer.CustomerFinder')
  ])
  .addTag('queryHandler');

sharedContainer.register('Customer.CustomerByFilterSearcher', CustomerByFilterSearcher, [
  sharedContainer.get('Customer.CustomerRepository')
]);

sharedContainer
  .register('Customer.SearchCustomerByFilterQueryHandler', SearchCustomerByFilterQueryHandler, [
    sharedContainer.get('Customer.CustomerByFilterSearcher')
  ])
  .addTag('queryHandler');

sharedContainer.register('Customer.CustomerUpdater', CustomerUpdater, [
  sharedContainer.get('Customer.CustomerRepository')
]);

sharedContainer
  .register('Customer.UpdateCustomerCommandHandler', UpdateCustomerCommandHandler, [
    sharedContainer.get('Customer.CustomerUpdater')
  ])
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
