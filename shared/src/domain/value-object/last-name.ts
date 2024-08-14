import { InvalidArgumentError } from './invalid-argument-error';
import { StringValueObject } from './string-value-object';

export class LastName extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.ensureIsThanValidLastName(value);
  }

  private ensureIsThanValidLastName(value: string): void {
    if (!/^[a-zA-ZÑñ]{3,30}$/.test(value)) {
      throw new InvalidArgumentError(`The last name <${value}> is invalid`);
    }
  }
}
