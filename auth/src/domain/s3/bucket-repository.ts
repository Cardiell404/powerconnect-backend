import { Nullable, UserAvatar } from '@powerconnect/shared';

export interface BucketRepository {
  getAvatar(key: string): Promise<Nullable<UserAvatar>>;
}
