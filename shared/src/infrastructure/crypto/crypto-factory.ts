import { CryptoImplement } from '../../domain/crypto-implement';
import CryptoJS from 'crypto-js';

export class CryptoFactory implements CryptoImplement {
  constructor() {}

  encryptPassword(message: string): string {
    return CryptoJS.SHA512(message).toString();
  }
}
