import {
  Command,
  CommandHandler,
  Email,
  FullName,
  PhoneNumber,
  AuthUserId
} from '@powerconnect/shared';
import { AuthSignUpCommand } from './auth-sign-up-command';
import { AuthSignUp } from './auth-sign-up';
import { AuthPassword } from '../../domain/value-objects/auth-password';

export class AuthSignUpCommandHandler implements CommandHandler<AuthSignUpCommand> {
  constructor(private authSignUp: AuthSignUp) {}

  subscribedTo(): Command {
    return AuthSignUpCommand;
  }

  async handle(command: AuthSignUpCommand): Promise<void> {
    const authUserId = new AuthUserId(command.authUserId);
    const name = new FullName(command.name);
    const email = new Email(command.email);
    const password = new AuthPassword(command.password);
    const phoneNumber = new PhoneNumber(command.phoneNumber);
    await this.authSignUp.run({
      authUserId,
      name,
      email,
      password,
      phoneNumber
    });
  }
}
