import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { QueryBus } from '@powerconnect/shared';
import { AuthCurrentUserResponse } from '../application/current-user/auth-current-user-response';
import { AuthCurrentUserQuery } from '../application/current-user/auth-current-user-query';

export class AuthCurrentUserController {
  constructor(private queryBus: QueryBus) {}

  async run(_req: Request, _res: Response): Promise<void> {
    const queryResponse: AuthCurrentUserResponse = await this.queryBus.ask<AuthCurrentUserResponse>(
      new AuthCurrentUserQuery(_req.currentUser!.id)
    );
    _res.status(httpStatus.OK).json(queryResponse.user);
  }
}
