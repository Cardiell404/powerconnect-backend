import {
  AggregateRoot,
  AuthUserId,
  CreatedAt,
  CustomerId,
  Email,
  FullName,
  LastUpdated,
  PhoneNumber,
  Status,
  UserId
} from '@powerconnect/shared';
import { UserCreateData } from './types/user-create-data';
import { UserUpdateData } from './types/user-update-data';

export class User extends AggregateRoot {
  readonly userId: UserId;
  readonly fullName: FullName;
  readonly email: Email;
  readonly phoneNumber: PhoneNumber;
  readonly status: Status;
  readonly createdAt: CreatedAt;
  readonly lastUpdated: LastUpdated;
  readonly customerId?: CustomerId;
  readonly authUserId?: AuthUserId;

  constructor({
    userId,
    fullName,
    email,
    phoneNumber,
    status,
    createdAt,
    lastUpdated,
    customerId,
    authUserId
  }: {
    userId: UserId;
    fullName: FullName;
    email: Email;
    phoneNumber: PhoneNumber;
    status: Status;
    createdAt: CreatedAt;
    lastUpdated: LastUpdated;
    customerId?: CustomerId;
    authUserId?: AuthUserId;
  }) {
    super();
    this.userId = userId;
    this.customerId = customerId;
    this.fullName = fullName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.createdAt = createdAt;
    this.status = status;
    this.lastUpdated = lastUpdated;
    this.authUserId = authUserId;
  }

  static create(userCreateData: UserCreateData): User {
    return new User({
      ...userCreateData,
      createdAt: CreatedAt.now(),
      lastUpdated: LastUpdated.now(),
      status: new Status('pending')
    });
  }

  static update(existingCustomer: User, updates: Partial<UserUpdateData>): User {
    const updatedProps = {
      ...existingCustomer,
      ...updates,
      lastUpdated: LastUpdated.now(),
      status: new Status('active')
    };
    return new User({ ...updatedProps });
  }

  static fromPrimitives(plainData: {
    userId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    status: string;
    createdAt: string;
    lastUpdated: string;
    customerId?: string;
    authUserId?: string;
  }): User {
    return new User({
      userId: new UserId(plainData.userId),
      customerId: plainData.customerId ? new CustomerId(plainData.customerId) : undefined,
      authUserId: plainData.authUserId ? new AuthUserId(plainData.authUserId) : undefined,
      fullName: new FullName(plainData.fullName),
      email: new Email(plainData.email),
      phoneNumber: new PhoneNumber(plainData.phoneNumber),
      status: new Status(plainData.status),
      createdAt: new CreatedAt(new Date(plainData.createdAt)),
      lastUpdated: new LastUpdated(new Date(plainData.lastUpdated))
    });
  }

  toPrimitives() {
    return {
      userId: this.userId.value,
      customerId: this.customerId?.value,
      authUserId: this.authUserId?.value,
      fullName: this.fullName.value,
      email: this.email.value,
      phoneNumber: this.phoneNumber.value,
      createdAt: this.createdAt.format(),
      lastUpdated: this.lastUpdated.format(),
      status: this.status.value
    };
  }
}
