import { S3Config } from '@powerconnect/shared';
import config from '../../config';

export class S3ConfigFactory {
  static createConfig(): S3Config {
    return config.get('s3');
  }
}
