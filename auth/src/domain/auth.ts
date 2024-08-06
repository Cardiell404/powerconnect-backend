import { AuthPassword } from './value-objects/auth-password';
import { AuthEmail } from './value-objects/auth-email';
import { AuthId, AggregateRoot } from '@powerConnect/shared';
import { UserName } from './user-name';

export class Auth extends AggregateRoot {
  readonly id: AuthId;
  readonly email: AuthEmail;
  readonly password: AuthPassword;
  readonly username: UserName;

  constructor(id: AuthId, email: AuthEmail, password: AuthPassword, username: UserName) {
    super();
    this.email = email;
    this.password = password;
    this.id = id;
    this.username = username;
  }

  static create(id: AuthId, email: AuthEmail, password: AuthPassword, username: UserName): Auth {
    return new Auth(id, email, password, username);
  }

  static fromPrimitives(plainData: { id: string; email: string; password: string; username: string }): Auth {
    return new Auth(
      new AuthId(plainData.id),
      new AuthEmail(plainData.email),
      new AuthPassword(plainData.password),
      new UserName(plainData.username)
    );
  }

  toPrimitives(): { id: string; email: string; password: string; username: string } {
    return {
      id: this.id.toString(),
      email: this.email.toString(),
      password: this.password.toString(),
      username: this.username.toString()
    };
  }
}
