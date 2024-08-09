import { Nullable, DynamoDBRepository, Filters } from '@powerconnect/shared';
import { AuthRepository } from '../../../domain/auth-repository';
import { Auth } from '../../../domain/auth';
import { IAuth } from '../../../domain/i-auth';

export class DynamoAuthRepository extends DynamoDBRepository<Auth> implements AuthRepository {
  protected tableName = 'Auth';

  public async currentuser(_id: string): Promise<Nullable<Auth>> {
    const auth = await this.getItemById<IAuth>(_id);
    return auth
      ? Auth.fromPrimitives({
          email: auth.email,
          username: auth.username,
          password: auth.password,
          id: auth.id
        })
      : null;
  }

  public async login(filters: Filters): Promise<Nullable<Auth>> {
    const auth = await this.scanByFilters<IAuth>(filters);
    return auth
      ? Auth.fromPrimitives({
          email: auth.email,
          username: auth.username,
          password: auth.password,
          id: auth.id
        })
      : null;
  }

  public async save(auth: Auth) {
    await this.persist(auth);
  }
}
