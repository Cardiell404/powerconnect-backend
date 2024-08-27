import { JwtConfig } from '@powerconnect/shared';
import config from '../config';

export class JwtConfigFactory {
  static createConfig(): JwtConfig {
    return config.get('jwt')
  }
}
