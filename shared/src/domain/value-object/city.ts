import { InvalidArgumentError } from './invalid-argument-error';
import { StringValueObject } from './string-value-object';

export class City extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.ensureLengthIsLessThan50Characters(value);
  }

  private ensureLengthIsLessThan50Characters(value: string): void {
    if (value.length > 50) {
      throw new InvalidArgumentError(`The city <${value}> has more than 50 characters`);
    }
  }
}
