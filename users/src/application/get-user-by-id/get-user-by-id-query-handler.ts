import { Query, QueryHandler, UserId } from '@powerconnect/shared';
import { UserResponse } from './user-response';
import { GetUserById } from './get-user-by-id';
import { GetUserByIdQuery } from './get-user-by-id-query';

export class GetUserByIdQueryHandler implements QueryHandler<GetUserByIdQuery, UserResponse> {
  constructor(private getUserById: GetUserById) {}

  subscribedTo(): Query {
    return GetUserByIdQuery;
  }

  handle(query: GetUserByIdQuery): Promise<UserResponse> {
    console.log(query);
    const userId = new UserId(query.userId);
    return this.getUserById.run(userId);
  }
}
