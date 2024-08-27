import { Command, CommandHandler, AuthUserId } from '@powerconnect/shared';
import { AuthLogout } from './auth-logout';
import { AuthLogoutCommand } from './auth-logout-command';
import { AuthRefreshToken } from '../../domain/value-objects/auth-refresh-token';

export class AuthLogoutCommandHandler implements CommandHandler<AuthLogoutCommand> {
  constructor(private authLogout: AuthLogout) {}

  subscribedTo(): Command {
    return AuthLogoutCommand;
  }

  async handle(command: AuthLogoutCommand): Promise<void> {
    const authUserId = new AuthUserId(command.authUserId);
    console.log(authUserId);
    const refreshToken = new AuthRefreshToken(command.refreshToken);
    console.log(refreshToken);
    await this.authLogout.run(authUserId, refreshToken);
  }
}
