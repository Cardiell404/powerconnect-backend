import {
  DomainEventClass,
  DomainEventSubscriber,
  Email,
  FullName,
  PhoneNumber,
  AuthCreatedDomainEvent,
  UserId
} from '@powerconnect/shared';
import { AuthUserCreationService } from './auth-user-creation-service';

export class CreateUserOnAuthCreated implements DomainEventSubscriber<AuthCreatedDomainEvent> {
  constructor(private creator: AuthUserCreationService) {}

  subscribedTo(): DomainEventClass[] {
    return [AuthCreatedDomainEvent];
  }

  async on(domainEvent: AuthCreatedDomainEvent): Promise<void> {
    const { aggregateId, authUserId, email, name, phoneNumber } = domainEvent;
    this.creator.run({
      userId: new UserId(aggregateId),
      authUserId: new UserId(authUserId),
      email: new Email(email),
      fullName: new FullName(name),
      phoneNumber: new PhoneNumber(phoneNumber)
    });
  }
}
