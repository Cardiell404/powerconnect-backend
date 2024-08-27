import { AuthUserId, Filters, Nullable } from '@powerconnect/shared';
import { Auth } from './auth';

export interface AuthRepository {
  login(filters: Filters): Promise<Nullable<Auth>>;
  getAuthByFilters(filters: Filters): Promise<Nullable<Auth>>;
  signup(auth: Auth): Promise<void>;
  logout(auth: Auth): Promise<void>;
  updateAuth(auth: Auth): Promise<void>;
  getAuthById(authUserId: AuthUserId): Promise<Nullable<Auth>>
}
