import { CustomError } from '@powerconnect/shared';

export class UserNotExist extends CustomError {
  statusCode = 404;

  constructor() {
    super('Not found');

    Object.setPrototypeOf(this, UserNotExist.prototype);
  }

  serializeErrors(): { message: string }[] {
    return [{ message: 'Not found' }];
  }
}
