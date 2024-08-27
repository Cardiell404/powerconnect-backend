import { CustomerId, Email, FullName, PhoneNumber, UserId } from '@powerconnect/shared';
import { User } from '../../../domain/user';
import { UserRepository } from '../../../domain/user-repository';
import { FiltersMapping } from '../../../utils/FiltersMapping';

type Params = {
  customerId: CustomerId;
  userId: UserId;
  email: Email;
  fullName: FullName;
  phoneNumber: PhoneNumber;
};

export class CustomerUserCreationService {
  constructor(private repository: UserRepository) {}

  async run({ userId, customerId, email, fullName, phoneNumber }: Params): Promise<void> {
    const existingUser = await this.repository.getUserByFilters(FiltersMapping.email(email.value));
    const user = !existingUser
      ? User.create({
          userId,
          customerId,
          email,
          fullName,
          phoneNumber
        })
      : User.update(existingUser, {
          customerId
        });
    await this.repository.saveUser(user);
  }
}
