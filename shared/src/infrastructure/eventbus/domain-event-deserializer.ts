import { DomainEvent, DomainEventClass } from '../../domain/domain-event';
import { DomainEventSubscribers } from './domain-event-subscribers';

type DomainEventJSON = {
  type: string;
  aggregateId: string;
  attributes: string;
  id: string;
  occurred_on: string;
};

export class DomainEventDeserializer extends Map<string, DomainEventClass> {
  static configure(subscribers: DomainEventSubscribers): DomainEventDeserializer {
    const mapping = new DomainEventDeserializer();
    subscribers.items.forEach(subscriber => {
      subscriber.subscribedTo().forEach(mapping.registerEvent.bind(mapping));
    });

    return mapping;
  }

  private registerEvent(domainEvent: DomainEventClass): void {
    const eventName = domainEvent.EVENT_NAME;
    this.set(eventName, domainEvent);
  }

  deserialize(event: string): DomainEvent {
    const eventData = JSON.parse(event).data as DomainEventJSON;
    const { type, aggregateId, attributes, id, occurred_on } = eventData;
    const eventClass = super.get(type);

    if (!eventClass) {
      throw Error(`DomainEvent mapping not found for event ${type}`);
    }

    return eventClass.fromPrimitives({
      aggregateId,
      attributes,
      occurredOn: new Date(occurred_on),
      eventId: id
    });
  }
}
