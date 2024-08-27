import { Nullable } from '@powerconnect/shared';
import { User } from '../../domain/user';

export class UserResponse {
  readonly user: Nullable<User>;

  constructor(user: User) {
    this.user = user;
  }

  public toResponse() {
    return {
      userId: this.user?.userId.value,
      customerId: this.user?.customerId?.value,
      fullName: this.user?.fullName.value,
      email: this.user?.email.value,
      phoneNumber: this.user?.phoneNumber.value,
      createdAt: this.user?.createdAt.value,
      lastUpdated: this.user?.lastUpdated.value,
      status: this.user?.status.value
    };
  }
}
