export interface IAuth {
  readonly authUserId: string;
  readonly email: string;
  readonly hashedPassword: string;
  readonly createdAt: string;
  readonly lastUpdated: string;
  readonly refreshToken?: string;
  readonly refreshTokenExpiresAt?: string;
}
