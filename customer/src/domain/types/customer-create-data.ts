import { CustomerIdentificationNumber } from '../value-objects/customer-identification-number';
import { CustomerId, DateOfBirth, Email, FirstName, LastName, PhoneNumber } from '@powerconnect/shared';
import { CustomerType } from '../value-objects/customer-type';
import { BillingInfo } from '../value-objects/billing-info';
import { Location } from '../value-objects/location';

export type CustomerCreateData = {
  customerId: CustomerId;
  identificationNumber: CustomerIdentificationNumber;
  firstName: FirstName;
  lastName: LastName;
  email: Email;
  phoneNumber: PhoneNumber;
  dateOfBirth: DateOfBirth;
  type: CustomerType;
  billingInfo: BillingInfo;
  locations: Array<Location>;
};
