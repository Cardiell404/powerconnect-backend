import { Query } from '@powerConnect/shared';

export class AuthCurrentUserQuery extends Query {
  _id: string;

  constructor(_id: string) {
    super();
    this._id = _id;
  }
}
