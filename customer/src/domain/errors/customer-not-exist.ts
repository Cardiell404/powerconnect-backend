import { CustomError } from '@powerconnect/shared';

export class CustomerNotExist extends CustomError {
  statusCode = 404;

  constructor() {
    super('Not found');

    Object.setPrototypeOf(this, CustomerNotExist.prototype);
  }

  serializeErrors(): { message: string }[] {
    return [{ message: 'Not found' }];
  }
}
