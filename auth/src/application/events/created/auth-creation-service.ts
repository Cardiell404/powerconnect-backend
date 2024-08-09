import { AuthId } from '@powerconnect/shared';
import { Auth } from '../../../domain/auth';
import { AuthRepository } from '../../../domain/auth-repository';
import { UserName } from '../../../domain/user-name';
import { AuthEmail } from '../../../domain/value-objects/auth-email';
import { AuthPassword } from '../../../domain/value-objects/auth-password';

type Params = {
  id: AuthId,
  email: AuthEmail,
  password: AuthPassword
};

export class AuthCreationService {
  private repository: AuthRepository;

  constructor(repository: AuthRepository) {
    this.repository = repository;
  }

  async run({ id, email, password }: Params): Promise<void> {
    const auth = Auth.create(id, email, password, new UserName(''));
    await this.repository.save(auth);
  }
}
