import config from '../../config';
import { DynamoDBConfig } from '@powerconnect/shared';

export class DynamoConfigFactory {
  static createConfig(): DynamoDBConfig {
    return config.get('dynamodb');
  }
}
