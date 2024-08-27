import { CustomError } from '@powerconnect/shared';

export class AuthAlreadyExists extends CustomError {
  statusCode = 409;

  constructor(public customerId: string) {
    super('already exist');

    Object.setPrototypeOf(this, AuthAlreadyExists.prototype);
  }

  serializeErrors(): { message: string }[] {
    return [{ message: `auth ${this.customerId} already exists` }];
  }
}
