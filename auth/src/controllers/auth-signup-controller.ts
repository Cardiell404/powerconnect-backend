import { CommandBus, Uuid } from '@powerconnect/shared';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { AuthSignUpCommand } from '../application/signup/auth-sign-up-command';
import { Controller } from './controller';

export default class AuthSignUpController implements Controller {
  constructor(private commandBus: CommandBus) {}

  async run(req: Request, res: Response): Promise<void> {
    const { email, name, password, phoneNumber } = req.body;
    const authUserId: string = Uuid.random().value;
    const authSignUpCommand = new AuthSignUpCommand({
      authUserId,
      email,
      password,
      name,
      phoneNumber
    });
    await this.commandBus.dispatch(authSignUpCommand);
    res.status(httpStatus.OK).send();
  }
}
