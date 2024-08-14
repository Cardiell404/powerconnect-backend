import { InvalidArgumentError } from './invalid-argument-error';
import { StringValueObject } from './string-value-object';

export class DateOfBirth extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.ensureIsThanValidDateOfBirth(value);
  }

  private ensureIsThanValidDateOfBirth(value: string): void {
    if (!/^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/.test(value)) {
      throw new InvalidArgumentError(`The birthday <${value}> is invalid, please ingress the next format 'dd/mm/yyyy'`);
    }
  }
}
