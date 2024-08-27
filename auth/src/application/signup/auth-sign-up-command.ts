import { Command } from '@powerconnect/shared';

type Params = {
  authUserId: string;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
};

export class AuthSignUpCommand extends Command {
  public readonly authUserId: string;
  public readonly name: string;
  public readonly email: string;
  public readonly phoneNumber: string;
  public readonly password: string;

  constructor({ authUserId, name, email, phoneNumber, password }: Params) {
    super();
    this.authUserId = authUserId;
    this.name = name;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.password = password;
  }
}
