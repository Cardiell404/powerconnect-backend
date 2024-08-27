import { Query } from '@powerconnect/shared';

export class GetUserByIdQuery implements Query {
  readonly userId: string;
  constructor(userId: string) {
    this.userId = userId;
  }
}
