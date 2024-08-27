import { CustomError } from "@powerconnect/shared";

export class AuthNotExist extends CustomError {
  readonly statusCode: number = 401;
  readonly reason: string = 'The auth does not exists';

  constructor() {
    super('The auth does not exists');

    Object.setPrototypeOf(this, AuthNotExist.prototype);
  }

  serializeErrors(): { message: string }[] {
    return [{ message: this.reason }];
  }
}
