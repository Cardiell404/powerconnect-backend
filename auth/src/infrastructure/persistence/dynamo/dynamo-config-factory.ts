import config from '../../config';
import { DynamoDBConfig } from '@powerConnect/shared';

export class DynamoConfigFactory {
  static createConfig(): DynamoDBConfig {
    return config.get('dynamodb');
  }
}
