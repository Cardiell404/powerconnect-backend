import { CustomError } from '@powerconnect/shared';

export class AuthInvalidCredentials extends CustomError {
  readonly statusCode: number = 401;
  readonly reason: string = 'Invalid credentials';

  constructor() {
    super('Invalid credentials');

    Object.setPrototypeOf(this, AuthInvalidCredentials.prototype);
  }

  serializeErrors(): { message: string }[] {
    return [{ message: this.reason }];
  }
}
