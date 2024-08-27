import { AuthUserId, Email, FullName, PhoneNumber, UserId } from '@powerconnect/shared';
import { User } from '../../../domain/user';
import { UserRepository } from '../../../domain/user-repository';
import { FiltersMapping } from '../../../utils/FiltersMapping';

type Params = {
  userId: UserId;
  authUserId: AuthUserId;
  email: Email;
  fullName: FullName;
  phoneNumber: PhoneNumber;
};

export class AuthUserCreationService {
  constructor(private repository: UserRepository) {}

  async run({ userId, authUserId, email, fullName, phoneNumber }: Params): Promise<void> {
    const existingUser = await this.repository.getUserByFilters(FiltersMapping.email(email.value));
    const user = !existingUser
      ? User.create({
          userId,
          authUserId,
          email,
          fullName,
          phoneNumber
        })
      : User.update(existingUser, {
          authUserId,
          email,
          phoneNumber,
          fullName
        });
    await this.repository.saveUser(user);
  }
}
