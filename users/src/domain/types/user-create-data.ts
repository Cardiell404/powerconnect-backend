import { AuthUserId, CustomerId, Email, FullName, PhoneNumber, UserId } from '@powerconnect/shared';

export type UserCreateData = {
  userId: UserId,
  fullName: FullName;
  email: Email;
  phoneNumber: PhoneNumber;
  customerId?: CustomerId;
  authUserId?: AuthUserId;
};
