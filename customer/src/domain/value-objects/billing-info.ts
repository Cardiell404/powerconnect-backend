import { Address, InvalidArgumentError } from '@powerconnect/shared';
import { PaymentMethod } from './payment-method';
import { PaymentTerms } from './payment-terms';
import { TaxIdentification } from './tax-identification';

export class BillingInfo {
  readonly billingAddress: Address;
  readonly paymentTerms: PaymentTerms;
  readonly paymentMethod: PaymentMethod;
  readonly taxIdentification: TaxIdentification;

  constructor(
    billingAddress: Address,
    paymentTerms: PaymentTerms,
    taxIdentification: TaxIdentification,
    paymentMethod: PaymentMethod
  ) {
    if (!billingAddress || !paymentTerms || !taxIdentification || !paymentMethod) {
      throw new InvalidArgumentError('Invalid billing info: All components must be provided');
    }
    this.billingAddress = billingAddress;
    this.paymentTerms = paymentTerms;
    this.taxIdentification = taxIdentification;
    this.paymentMethod = paymentMethod;
    Object.freeze(this);
  }

  equals(other: BillingInfo): boolean {
    if (!other) {
      return false;
    }
    return (
      this.billingAddress.equals(other.billingAddress) &&
      this.paymentTerms.equals(other.paymentTerms) &&
      this.taxIdentification.equals(other.taxIdentification) &&
      this.paymentMethod.equals(other.paymentMethod)
    );
  }

  toString(): string {
    return `${this.billingAddress}, ${this.paymentTerms.value}, ${this.taxIdentification.value}, ${this.paymentMethod}`;
  }

  toPrimitives() {
    return {
      billingAddress: {
        state: this.billingAddress.state.value,
        city: this.billingAddress.city.value,
        street: this.billingAddress.street.value,
        zipCode: this.billingAddress.zipCode.value
      },
      paymentTerms: this.paymentTerms.value,
      taxIdentification: this.taxIdentification.value,
      paymentMethod: {
        methodType: this.paymentMethod.methodType.value,
        referenceId: this.paymentMethod.referenceId.value
      }
    };
  }
}
