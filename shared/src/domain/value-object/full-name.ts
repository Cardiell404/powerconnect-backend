import { InvalidArgumentError } from './invalid-argument-error';
import { StringValueObject } from './string-value-object';

export class FullName extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.ensureIsThanValidFullName(value);
  }

  private ensureIsThanValidFullName(value: string): void {
    if (!/^[a-zA-ZÀ-ÿ'-]+\s[a-zA-ZÀ-ÿ'-]+(\s[a-zA-ZÀ-ÿ'-]+)*$/.test(value)) {
      throw new InvalidArgumentError(`The full name <${value}> is invalid`);
    }
  }
}
