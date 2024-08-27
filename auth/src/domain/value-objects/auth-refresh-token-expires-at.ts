import { ValueObject } from '@powerconnect/shared';

export class AuthRefreshTokenExpiresAt extends ValueObject<Date> {
  constructor(value: Date) {
    console.log(value);
    super(value);
  }

  public static now(): AuthRefreshTokenExpiresAt {
    return new AuthRefreshTokenExpiresAt(new Date());
  }

  public format(): string {
    return this.value.toISOString();
  }
}
