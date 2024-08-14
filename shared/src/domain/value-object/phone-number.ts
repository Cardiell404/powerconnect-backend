import { InvalidArgumentError } from './invalid-argument-error';
import { StringValueObject } from './string-value-object';

export class PhoneNumber extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.ensureIsThanValidPhoneNumber(value);
  }

  private ensureIsThanValidPhoneNumber(value: string): void {
    if (!/^\+?(\d{1,4})?\s?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(value)) {
      throw new InvalidArgumentError(`The phone number <${value}> is invalid`);
    }
  }
}
