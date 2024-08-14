import { InvalidArgumentError } from './invalid-argument-error';
import { StringValueObject } from './string-value-object';

export class ZipCode extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.ensureIsThanValidZipCode(value);
  }

  private ensureIsThanValidZipCode(value: string): void {
    if (!/^\d{5}$/.test(value)) {
      throw new InvalidArgumentError(`The zip code <${value}> is invalid`);
    }
  }
}
