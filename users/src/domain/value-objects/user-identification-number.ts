import { StringValueObject, InvalidArgumentError } from '@powerconnect/shared';

export class UserIdentificationNumber extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.ensureIsThanValidIdentificationNumber(value);
  }

  private ensureIsThanValidIdentificationNumber(value: string): void {
    if (!/^[A-Z]{4}\d{6}[HM][A-Z]{2}[A-Z]{3}\d{2}$/.test(value)) {
      throw new InvalidArgumentError(`The user identification number <${value}> is invalid`);
    }
  }
}
