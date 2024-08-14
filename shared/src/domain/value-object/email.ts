import { InvalidArgumentError } from './invalid-argument-error';
import { StringValueObject } from './string-value-object';

export class Email extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.ensureIsThanValidEmail(value);
  }

  private ensureIsThanValidEmail(value: string): void {
    if (/^[^\s@]+@[^\s@]]+\.[^\s@]+$/.test(value)) {
      throw new InvalidArgumentError(`The email <${value}> is invalid`);
    }
  }
}
