import { CustomError } from '@powerconnect/shared';

export class UserAlreadyExists extends CustomError {
  statusCode = 409;

  constructor(public userId: string) {
    super('already exist');

    Object.setPrototypeOf(this, UserAlreadyExists.prototype);
  }

  serializeErrors(): { message: string }[] {
    return [{ message: `User number ${this.userId} already exists` }];
  }
}
