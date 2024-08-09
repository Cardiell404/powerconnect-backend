import { DomainEvent } from '../domain-event';

type CreateUserDomainEventBody = {
  readonly eventName: string;
  readonly id: string;
  readonly email: string;
  readonly password: string;
};

export class UserCreatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'user.created';

  readonly email: string;
  readonly password: string;

  constructor({
    aggregateId,
    email,
    password,
    eventId,
    occurredOn
  }: {
    aggregateId: string;
    email: string;
    password: string;
    eventId?: string;
    occurredOn?: Date;
  }) {
    super({ eventName: UserCreatedDomainEvent.EVENT_NAME, aggregateId, eventId, occurredOn });
    this.email = email;
    this.password = password;
  }

  toPrimitives(): CreateUserDomainEventBody {
    const { aggregateId, email, password } = this;
    return {
      email,
      password,
      eventName: UserCreatedDomainEvent.EVENT_NAME,
      id: aggregateId
    };
  }

  static fromPrimitives(params: {
    aggregateId: string;
    attributes: CreateUserDomainEventBody;
    eventId: string;
    occurredOn: Date;
  }): DomainEvent {
    const { aggregateId, attributes, occurredOn, eventId } = params;
    return new UserCreatedDomainEvent({
      aggregateId,
      email: attributes.email,
      password: attributes.password,
      eventId,
      occurredOn
    });
  }
}
