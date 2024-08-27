import {
  CustomerCreatedDomainEvent,
  CustomerId,
  DomainEventClass,
  DomainEventSubscriber,
  Email,
  FullName,
  PhoneNumber,
  UserId
} from '@powerconnect/shared';
import { CustomerUserCreationService } from './customer-user-creation-service';

export class CreateUserOnCustomerCreated implements DomainEventSubscriber<CustomerCreatedDomainEvent> {
  constructor(private creator: CustomerUserCreationService) {}

  subscribedTo(): DomainEventClass[] {
    return [CustomerCreatedDomainEvent];
  }

  async on(domainEvent: CustomerCreatedDomainEvent): Promise<void> {
    const { customerId, email, fullName, phoneNumber, aggregateId } = domainEvent;
    this.creator.run({
      userId: new UserId(aggregateId),
      customerId: new CustomerId(customerId),
      email: new Email(email),
      fullName: new FullName(fullName),
      phoneNumber: new PhoneNumber(phoneNumber)
    });
  }
}
