import { CryptoImplement, QueryBus, ValidateFields } from '@powerConnect/shared';
import { Request, Response } from 'express';
import { body, ValidationChain } from 'express-validator';
import { AuthLoginResponse } from '../application/login/auth-login-response';
import { AuthQuery } from '../application/login/auth-query';
import httpStatus from 'http-status';

export class AuthLoginController extends ValidateFields {
  constructor(
    private queryBus: QueryBus,
    private crypto: CryptoImplement
  ) {
    super();
  }

  static validator(): ValidationChain[] {
    return [
      body('email').isEmail().withMessage('Invalid email'),
      body('password').isLength({ min: 4, max: 100 }).withMessage('Invalid password')
    ];
  }

  async run(req: Request, res: Response): Promise<void> {
    const errors = this.validateRequest(req);
    if (errors.length === 0) {
      await this.login(req, res);
    } else {
      res.status(httpStatus.BAD_REQUEST).send({ errors });
    }
  }

  private async login(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    let { password } = req.body;
    password = this.crypto.encryptPassword(password);
    const queryResponse = await this.queryBus.ask<AuthLoginResponse>(new AuthQuery({ email, password }));
    req.session = {
      jwt: queryResponse.token
    };
    res.status(httpStatus.OK).send(queryResponse.user);
  }
}
