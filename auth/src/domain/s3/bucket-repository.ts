import { Nullable, UserAvatar } from '@powerConnect/shared';

export interface BucketRepository {
  getAvatar(key: string): Promise<Nullable<UserAvatar>>;
}
