import {
  CryptoImplement,
  Email,
  EventBus,
  FullName,
  PhoneNumber,
  AuthUserId
} from '@powerconnect/shared';
import { FiltersMapping } from '../../utils/FiltersMapping';
import { AuthRepository } from '../../domain/auth-repository';
import { Auth } from '../../domain/auth';
import { AuthAlreadyExists } from '../../domain/errors/auth-already-exists';
import { AuthPassword } from '../../domain/value-objects/auth-password';
import { AuthHashedPassword } from '../../domain/value-objects/auth-hashed-password';

type Params = {
  authUserId: AuthUserId;
  name: FullName;
  phoneNumber: PhoneNumber;
  email: Email;
  password: AuthPassword;
};

export class AuthSignUp {
  constructor(
    private repository: AuthRepository,
    private bus: EventBus,
    private crypto: CryptoImplement
  ) {
    this.repository = repository;
  }

  async run({ authUserId, name, email, phoneNumber, password }: Params): Promise<void> {
    const hashedPassword = new AuthHashedPassword(this.crypto.hashMessage(password.value));
    const existingAuth = await this.repository.getAuthByFilters(FiltersMapping.email(email.value));
    if (existingAuth) {
      throw new AuthAlreadyExists(existingAuth.authUserId.value);
    }
    const auth = Auth.create({
      authUserId,
      name,
      email,
      phoneNumber,
      hashedPassword,
    });
    await this.repository.signup(auth);
    await this.bus.publish(auth.pullDomainEvents());
  }
}
