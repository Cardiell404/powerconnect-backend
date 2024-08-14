import { InvalidArgumentError, EnumValueObject } from '@powerconnect/shared';

export class CustomerStatus extends EnumValueObject<string> {
  constructor(value: string) {
    super(value, ['active', 'inactive', 'suspended', 'cancelled', 'pending', 'closed', 'delinquent']);
  }

  protected throwErrorForInvalidValue(value: string): void {
    throw new InvalidArgumentError(`The value ${value} is not valid for a customer status`);
  }
}
