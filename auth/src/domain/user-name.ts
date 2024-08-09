import { StringValueObject, InvalidArgumentError } from '@powerconnect/shared';

export class UserName extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.ensureLengthIsLessThan30Characters(value);
  }

  private ensureLengthIsLessThan30Characters(value: string): void {
    if (value.length > 30) {
      throw new InvalidArgumentError(`The User name <${value}> has more than 30 characters`);
    }
  }
}
