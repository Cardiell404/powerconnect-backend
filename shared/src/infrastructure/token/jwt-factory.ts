import { JwtImplement } from '../../domain/jwt-implement';
import { sign, verify, decode } from 'jsonwebtoken';
import { JwtConfig } from './jwt-config';
export class JwtFactory implements JwtImplement {
  private config: JwtConfig;

  constructor(config: JwtConfig) {
    this.config = config;
  }

  createToken(payload: any): string {
    return sign(payload, this.config.secretKey, { expiresIn: this.config.accessTokenExpiresIn });
  }

  verifyAccessToken(token: string): any {
    try {
      return verify(token, this.config.secretKey);
    } catch (e) {
      throw new Error('Invalid access token');
    }
  }

  createRefreshToken(payload: any): string {
    return sign(payload, this.config.secretKey, { expiresIn: this.config.refreshTokenExpiresIn });
  }

  getRefreshTokenExpiryDate(): Date {
    const now = new Date();
    const parseExpiryTime = this.parseExpiryTime(this.config.refreshTokenExpiresIn);
    return new Date(now.getTime() + parseExpiryTime);
  }

  verifyRefreshToken(token: string): any {
    try {
      return verify(token, this.config.secretKey);
    } catch (e) {
      throw new Error('Invalid refresh token');
    }
  }

  decodeToken(token: string): any {
    return decode(token);
  }

  shouldRotateRefreshToken(refreshToken: string): boolean {
    const decodedToken = this.decodeToken(refreshToken);

    const issuedAt = decodedToken.iat;
    const expiresAt = decodedToken.exp;
    const now = Math.floor(Date.now() / 1000);

    return now > (issuedAt + (expiresAt - issuedAt) / 2);
  }

  private parseExpiryTime(expiryTime: string): number {
    const regex = /^(\d+)([smhd])$/;
    const match = expiryTime.match(regex);

    if (!match) {
      throw new Error('Invalid expiry time format');
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        throw new Error('Invalid expiry time unit');
    }
  }
}
