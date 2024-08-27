import { Command } from '@powerconnect/shared';

export class AuthLogoutCommand extends Command {
  public readonly authUserId: string;
  public readonly refreshToken: string;

  constructor(authUserId: string, refreshToken: string) {
    super();
    this.authUserId = authUserId;
    this.refreshToken = refreshToken;
  }
}
