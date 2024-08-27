import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { QueryBus } from '@powerconnect/shared';
import { AuthRefreshTokenResponse } from '../application/refresh-token/auth-refresh-token-response';
import { AuthRefreshTokenQuery } from '../application/refresh-token/auth-refresh-token-query';
import { Controller } from './controller';

export default class AuthRefreshTokenController implements Controller {
  constructor(private queryBus: QueryBus) {}

  async run(req: Request, _res: Response): Promise<void> {
    const { refreshToken } = req.body;
    const userId = req.user.id;
    const response: AuthRefreshTokenResponse = await this.queryBus.ask<AuthRefreshTokenResponse>(
      new AuthRefreshTokenQuery(userId, refreshToken)
    );
    _res.status(httpStatus.OK).json({ accessToken: response.accessToken, refreshToken: response.refreshToken });
  }
}
