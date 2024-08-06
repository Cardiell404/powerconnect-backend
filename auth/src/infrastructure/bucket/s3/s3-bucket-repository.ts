import { Nullable, UserAvatar, S3Repository } from '@powerConnect/shared';
import { BucketRepository } from '../../../domain/s3/bucket-repository';

export class S3BucketRepository extends S3Repository implements BucketRepository {
  protected bucketName = 'powerConnect/users';

  public async getAvatar(key: string): Promise<Nullable<UserAvatar>> {
    const avatar = await this.getObject(key);
    if (!avatar) {
      return null;
    }
    return new UserAvatar(avatar);
  }
}
