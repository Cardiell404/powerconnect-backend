import { StringValueObject, InvalidArgumentError } from '@powerconnect/shared';

export class TaxIdentification extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.ensureIsThanValidRFC(value);
  }

  private ensureIsThanValidRFC(value: string): void {
    if (!/^[A-Z]{4}\d{6}[A-Z0-9]{3}$/.test(value)) {
      throw new InvalidArgumentError(`The RFC <${value}> is invalid`);
    }
  }
}
