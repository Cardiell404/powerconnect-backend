import { Nullable, DynamoDBRepository, Filters, AuthUserId } from '@powerconnect/shared';
import { AuthRepository } from '../../../domain/auth-repository';
import { Auth } from '../../../domain/auth';
import { IAuth } from '../../../domain/i-auth';

export class DynamoAuthRepository extends DynamoDBRepository<Auth> implements AuthRepository {
  protected tableName = 'Auth';

  public async getAuthByFilters(filters: Filters): Promise<Nullable<Auth>> {
    const auth = await this.scanByFilters<IAuth>(filters);
    return auth
      ? Auth.fromPrimitives({
          email: auth.email,
          hashedPassword: auth.hashedPassword,
          createdAt: auth.createdAt,
          authUserId: auth.authUserId,
          lastUpdated: auth.lastUpdated,
          refreshToken: auth.refreshToken,
          refreshTokenExpiresAt: auth.refreshTokenExpiresAt
        })
      : null;
  }

  public async getAuthById(authUserId: AuthUserId): Promise<Nullable<Auth>> {
    const auth = await this.getItemById<IAuth>({ authUserId: authUserId.value });
    return auth
      ? Auth.fromPrimitives({
          email: auth.email,
          hashedPassword: auth.hashedPassword,
          createdAt: auth.createdAt,
          authUserId: auth.authUserId,
          lastUpdated: auth.lastUpdated,
          refreshToken: auth.refreshToken,
          refreshTokenExpiresAt: auth.refreshTokenExpiresAt
        })
      : null;
  }
  public async signup(auth: Auth): Promise<void> {
    await this.persist(auth);
  }

  public async logout(auth: Auth): Promise<void> {
    await this.persist(auth);
  }

  public async login(filters: Filters): Promise<Nullable<Auth>> {
    const auth = await this.scanByFilters<IAuth>(filters);
    return auth
      ? Auth.fromPrimitives({
          email: auth.email,
          hashedPassword: auth.hashedPassword,
          createdAt: auth.createdAt,
          authUserId: auth.authUserId,
          lastUpdated: auth.lastUpdated,
          refreshToken: auth.refreshToken,
          refreshTokenExpiresAt: auth.refreshTokenExpiresAt
        })
      : null;
  }

  public async updateAuth(auth: Auth): Promise<void> {
    return await this.persist(auth);
  }
}
