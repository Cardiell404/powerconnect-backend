export interface JwtImplement {
  createToken(payload: any): string;
  createRefreshToken(payload: any): string;
  verifyAccessToken(token: string): any;
  getRefreshTokenExpiryDate(): Date;
  verifyRefreshToken(token: string): any;
  shouldRotateRefreshToken(refreshToken: string): boolean;
  decodeToken(token: string): any;
}
