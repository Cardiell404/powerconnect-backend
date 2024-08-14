import { CustomError } from '@powerconnect/shared';

export class CustomerAlreadyExists extends CustomError {
  statusCode = 409;

  constructor(public customerId: string) {
    super('already exist');

    Object.setPrototypeOf(this, CustomerAlreadyExists.prototype);
  }

  serializeErrors(): { message: string }[] {
    return [{ message: `Customer number ${this.customerId} already exists` }];
  }
}
