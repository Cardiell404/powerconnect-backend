import { CustomerId } from '../value-objects/customer-id';
import { CustomerIdentificationNumber } from '../value-objects/customer-identification-number';
import {
  CreatedAt,
  CreatedBy,
  DateOfBirth,
  Email,
  FirstName,
  LastName,
  LastUpdated,
  PhoneNumber
} from '@powerconnect/shared';
import { CustomerType } from '../value-objects/customer-type';
import { BillingInfo } from '../value-objects/billing-info';
import { Location } from '../value-objects/location';
import { CustomerStatus } from '../value-objects/customer-status';

export type CustomerCreateData = {
  customerId: CustomerId;
  identificationNumber: CustomerIdentificationNumber;
  status: CustomerStatus;
  firstName: FirstName;
  lastName: LastName;
  email: Email;
  phoneNumber: PhoneNumber;
  dateOfBirth: DateOfBirth;
  type: CustomerType;
  billingInfo: BillingInfo;
  locations: Array<Location>;
  createdBy: CreatedBy;
  lastUpdated: LastUpdated;
  createdAt: CreatedAt;
};
