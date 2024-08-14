import { InvalidArgumentError } from '@powerconnect/shared';
import { MethodType } from './method-type';
import { ReferenceId } from './reference-id';

export class PaymentMethod {
  readonly methodType: MethodType;
  readonly referenceId: ReferenceId;
  // readonly cardNumber:
  // readonly expirationDate:

  constructor(methodType: MethodType, referenceId: ReferenceId) {
    if (!methodType || !referenceId) {
      throw new InvalidArgumentError('Invalid payment method: All components must be provided');
    }
    this.methodType = methodType;
    this.referenceId = referenceId;
    Object.freeze(this);
  }

  equals(other: PaymentMethod): boolean {
    if (!other) {
      return false;
    }
    return this.methodType.equals(other.methodType) && this.referenceId.equals(other.referenceId);
  }

  toString(): string {
    return `${this.methodType}, ${this.referenceId.value}}`;
  }
}
