import { InvalidArgumentError, EnumValueObject } from '@powerconnect/shared';

export class MethodType extends EnumValueObject<string> {
  constructor(value: string) {
    super(value, ['Credit Card', 'Bank Transfer', 'PayPal', 'Cash', 'Check']);
  }

  protected throwErrorForInvalidValue(value: string): void {
    throw new InvalidArgumentError(`The value ${value} is not valid for a payment terms`);
  }

  equals(other: EnumValueObject<string>): boolean {
    return other.constructor.name === this.constructor.name && other.value === this.value;
  }
}
