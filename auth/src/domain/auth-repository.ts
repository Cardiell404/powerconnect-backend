import { Filters, Nullable } from '@powerConnect/shared';
import { Auth } from './auth';

export interface AuthRepository {
  login(filters: Filters): Promise<Nullable<Auth>>;
  currentuser(_id: string): Promise<Nullable<Auth>>;
}
