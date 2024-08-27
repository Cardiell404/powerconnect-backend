import { Nullable, DynamoDBRepository, Filters, UserId } from '@powerconnect/shared';
import { IUser } from '../../../domain/i-user';
import { User } from '../../../domain/user';
import { UserRepository } from '../../../domain/user-repository';

export class DynamoUserRepository extends DynamoDBRepository<User> implements UserRepository {
  protected tableName = 'User';

  public async getUsers(): Promise<Array<User>> {
    const users = await this.scan<IUser>();
    return users.map(user =>
      User.fromPrimitives({
        userId: user.userId,
        fullName: user.fullName,
        authUserId: user.authUserId,
        email: user.email,
        phoneNumber: user.phoneNumber,
        createdAt: user.createdAt,
        customerId: user.customerId,
        lastUpdated: user.lastUpdated,
        status: user.status
      })
    );
  }

  public async getUserByFilters(filters: Filters): Promise<Nullable<User>> {
    const user = await this.scanByFilters<IUser>(filters);
    return user
      ? User.fromPrimitives({
          userId: user.userId,
          authUserId: user.authUserId,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          createdAt: user.createdAt,
          customerId: user.customerId,
          lastUpdated: user.lastUpdated,
          status: user.status
        })
      : null;
  }

  public async deleteUser(user: User): Promise<void> {
    const userId = user.userId.value;
    return await this.updateItemById({ userId }, user);
  }

  public async updateUser(user: User): Promise<void> {
    return await this.persist(user);
  }

  public async saveUser(user: User): Promise<void> {
    await this.persist(user);
  }

  public async getUserById(userId: UserId): Promise<Nullable<User>> {
    const user = await this.getItemById<IUser>({ userId: userId.value });
    return user
      ? User.fromPrimitives({
          userId: user.userId,
          authUserId: user.authUserId,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          createdAt: user.createdAt,
          customerId: user.customerId,
          lastUpdated: user.lastUpdated,
          status: user.status
        })
      : null;
  }

}
