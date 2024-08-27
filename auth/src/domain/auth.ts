import { AuthHashedPassword } from './value-objects/auth-hashed-password';
import {
  AggregateRoot,
  AuthUserId,
  Email,
  CreatedAt,
  LastUpdated,
  Uuid,
  AuthCreatedDomainEvent
} from '@powerconnect/shared';
import { AuthRefreshToken } from './value-objects/auth-refresh-token';
import { AuthRefreshTokenExpiresAt } from './value-objects/auth-refresh-token-expires-at';
import { AuthCreateData } from './types/auth-create-data';

export class Auth extends AggregateRoot {
  readonly authUserId: AuthUserId;
  readonly email: Email;
  readonly hashedPassword: AuthHashedPassword;
  readonly createdAt: CreatedAt;
  readonly lastUpdated: LastUpdated;
  readonly refreshToken?: AuthRefreshToken;
  readonly refreshTokenExpiresAt?: AuthRefreshTokenExpiresAt;

  constructor({
    authUserId,
    email,
    hashedPassword,
    createdAt,
    lastUpdated,
    refreshToken,
    refreshTokenExpiresAt
  }: {
    authUserId: AuthUserId;
    email: Email;
    hashedPassword: AuthHashedPassword;
    createdAt: CreatedAt;
    lastUpdated: LastUpdated;
    refreshToken?: AuthRefreshToken;
    refreshTokenExpiresAt?: AuthRefreshTokenExpiresAt;
  }) {
    super();
    this.authUserId = authUserId;
    this.email = email;
    this.hashedPassword = hashedPassword;
    this.createdAt = createdAt;
    this.lastUpdated = lastUpdated;
    this.refreshToken = refreshToken;
    this.refreshTokenExpiresAt = refreshTokenExpiresAt;
  }

  static create({ authUserId, email, hashedPassword, name, phoneNumber }: AuthCreateData): Auth {
    const auth = new Auth({
      authUserId,
      email,
      hashedPassword,
      createdAt: CreatedAt.now(),
      lastUpdated: LastUpdated.now()
    });
    auth.record(
      new AuthCreatedDomainEvent({
        aggregateId: Uuid.random().value,
        authUserId: authUserId.value,
        email: email.value,
        name: name.value,
        phoneNumber: phoneNumber.value
      })
    );
    return auth;
  }

  static updateRefreshToken(existingAuth: Auth, refreshToken: AuthRefreshToken, refreshTokenExpiresAt: AuthRefreshTokenExpiresAt): Auth {
    return new Auth({
      ...existingAuth,
      refreshToken,
      refreshTokenExpiresAt,
      lastUpdated: LastUpdated.now()
    })
  }

  static invalidateRefreshToken(existingAuth: Auth): Auth {
    return new Auth({
      ...existingAuth,
      lastUpdated: LastUpdated.now(),
      refreshToken: undefined,
      refreshTokenExpiresAt: undefined
    })
  }

  isRefreshTokenValid(token?: string): boolean {
    if(!this.refreshToken?.value || !this.refreshTokenExpiresAt?.value) {
      return false;
    }
    const isTokenValid = this.refreshToken.value == token;
    const isTokenNotExpired = new Date() < this.refreshTokenExpiresAt.value;
    return isTokenValid && isTokenNotExpired;
  }

  static fromPrimitives(plainData: {
    authUserId: string;
    email: string;
    hashedPassword: string;
    createdAt: string;
    lastUpdated: string;
    refreshToken?: string;
    refreshTokenExpiresAt?: string;
  }): Auth {
    return new Auth({
      authUserId: new AuthUserId(plainData.authUserId),
      email: new Email(plainData.email),
      hashedPassword: new AuthHashedPassword(plainData.hashedPassword),
      createdAt: new CreatedAt(new Date(plainData.createdAt)),
      lastUpdated: new LastUpdated(new Date(plainData.lastUpdated)),
      refreshToken: plainData.refreshToken ? new AuthRefreshToken(plainData.refreshToken) : undefined,
      refreshTokenExpiresAt: plainData.refreshTokenExpiresAt
        ? new AuthRefreshTokenExpiresAt(new Date(plainData.refreshTokenExpiresAt))
        : undefined
    });
  }

  toPrimitives(): {
    authUserId: string;
    email: string;
    hashedPassword: string;
    createdAt: string;
    lastUpdated: string;
    refreshToken: string | undefined;
    refreshTokenExpiresAt: string | undefined;
  } {
    return {
      authUserId: this.authUserId.toString(),
      email: this.email.toString(),
      hashedPassword: this.hashedPassword.toString(),
      createdAt: this.createdAt.format(),
      lastUpdated: this.lastUpdated.format(),
      refreshToken: this.refreshToken?.toString(),
      refreshTokenExpiresAt: this.refreshTokenExpiresAt?.format()
    };
  }
}
