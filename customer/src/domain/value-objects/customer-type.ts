import { InvalidArgumentError, EnumValueObject } from '@powerconnect/shared';

export class CustomerType extends EnumValueObject<string> {
  constructor(value: string) {
    super(value, ['corporate', 'residential', 'education', 'government']);
  }

  protected throwErrorForInvalidValue(value: string): void {
    throw new InvalidArgumentError(`The value ${value} is not valid for a customer type`);
  }
}
