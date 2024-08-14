import { InvalidArgumentError, EnumValueObject } from '@powerconnect/shared';

export class PaymentTerms extends EnumValueObject<string> {
  constructor(value: string) {
    super(value, ['Net 30', 'Net 60', 'Cash On Delivery', 'End of Month', 'Cash in Advance', '2/10 Net']);
  }

  protected throwErrorForInvalidValue(value: string): void {
    throw new InvalidArgumentError(`The value ${value} is not valid for a payment terms`);
  }

  equals(other: EnumValueObject<string>): boolean {
    return other.constructor.name === this.constructor.name && other.value === this.value;
  }
}
