import { InvalidArgumentError } from './invalid-argument-error';
import { StringValueObject } from './string-value-object';

export class FirstName extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.ensureIsThanValidName(value);
  }

  private ensureIsThanValidName(value: string): void {
    if (!/^[a-zA-ZÑñ]{3,30}$/.test(value)) {
      throw new InvalidArgumentError(`The name <${value}> is invalid`);
    }
  }
}
