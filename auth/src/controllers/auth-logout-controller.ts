import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { Controller } from './controller';
import { CommandBus } from '@powerconnect/shared';
import { AuthLogoutCommand } from '../application/logout/auth-logout-command';

export default class AuthLogoutController implements Controller {
  constructor(private commandBus: CommandBus) {}

  async run(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;
    const userId = req.user.id;
    const authLogoutCommand = new AuthLogoutCommand(userId, refreshToken);
    await this.commandBus.dispatch(authLogoutCommand);
    res.status(httpStatus.OK).send();
  }
}
