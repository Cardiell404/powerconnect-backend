import { DomainEvent } from '../domain-event';

type CreateAuthDomainEventBody = {
  readonly eventName: string;
  readonly authUserId: string;
  readonly email: string;
  readonly name: string;
  readonly phoneNumber: string;
};

export class AuthCreatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'auth.created';

  readonly authUserId: string;
  readonly email: string;
  readonly name: string;
  readonly phoneNumber: string;

  constructor({
    aggregateId,
    authUserId,
    email,
    name,
    phoneNumber,
    eventId,
    occurredOn
  }: {
    aggregateId: string;
    authUserId: string;
    email: string;
    name: string;
    phoneNumber: string;
    eventId?: string;
    occurredOn?: Date;
  }) {
    super({ eventName: AuthCreatedDomainEvent.EVENT_NAME, aggregateId, eventId, occurredOn });
    this.email = email;
    this.authUserId = authUserId;
    this.name = name;
    this.phoneNumber = phoneNumber;
  }

  toPrimitives(): CreateAuthDomainEventBody {
    const { email, authUserId, name, phoneNumber } = this;
    return {
      email,
      authUserId,
      name,
      phoneNumber,
      eventName: AuthCreatedDomainEvent.EVENT_NAME
    };
  }

  static fromPrimitives(params: {
    aggregateId: string;
    attributes: CreateAuthDomainEventBody;
    eventId: string;
    occurredOn: Date;
  }): DomainEvent {
    const { aggregateId, attributes, occurredOn, eventId } = params;
    return new AuthCreatedDomainEvent({
      aggregateId,
      email: attributes.email,
      authUserId: attributes.authUserId,
      name: attributes.name,
      phoneNumber: attributes.phoneNumber,
      eventId,
      occurredOn
    });
  }
}
