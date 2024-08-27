import { AuthHashedPassword } from '../value-objects/auth-hashed-password';
import { Email, FullName, PhoneNumber, AuthUserId } from '@powerconnect/shared';

export type AuthCreateData = {
  authUserId: AuthUserId;
  email: Email;
  hashedPassword: AuthHashedPassword;
  name: FullName;
  phoneNumber: PhoneNumber;
};
