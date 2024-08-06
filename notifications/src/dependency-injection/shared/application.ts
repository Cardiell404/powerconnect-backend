/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ContainerBuilder, Definition } from 'node-dependency-injection';
import {
  WinstonLogger,
  CommandHandlers,
  InMemoryCommandBus,
  QueryHandlers,
  InMemoryQueryBus,
  CryptoFactory
} from '@powerConnect/shared';

const sharedContainer = new ContainerBuilder();

sharedContainer.setDefinition('Shared.Logger', createDefinition({ object: WinstonLogger }));

sharedContainer.setDefinition('Shared.Crypto', createDefinition({ object: CryptoFactory }));

// ------------------------------------------------------------------------------------------------------------

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
