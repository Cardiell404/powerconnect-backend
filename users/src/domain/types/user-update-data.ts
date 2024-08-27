import { AuthUserId, CustomerId, Email, FullName, PhoneNumber } from '@powerconnect/shared';

export type UserUpdateData = {
  authUserId: AuthUserId;
  customerId: CustomerId;
  fullName: FullName;
  email: Email;
  phoneNumber: PhoneNumber;
};
