import { AuthId, DomainEventClass, DomainEventSubscriber, UserCreatedDomainEvent } from '@powerconnect/shared';
import { AuthPassword } from '../../../domain/value-objects/auth-password';
import { AuthEmail } from '../../../domain/value-objects/auth-email';
import { AuthCreationService } from './auth-creation-service';

export class AuthOnUserCreatedListener implements DomainEventSubscriber<UserCreatedDomainEvent> {
  constructor(private creator: AuthCreationService) {}

  subscribedTo(): DomainEventClass[] {
    return [UserCreatedDomainEvent];
  }

  async on(domainEvent: UserCreatedDomainEvent): Promise<void> {
    const { aggregateId, email, password } = domainEvent;
    return this.creator.run({
      id: new AuthId(aggregateId),
      email: new AuthEmail(email),
      password: new AuthPassword(password),
    });
  }
}