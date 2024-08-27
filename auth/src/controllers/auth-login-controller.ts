import { ValidateFields } from '@powerconnect/shared';
import { Request, Response } from 'express';
import { body, ValidationChain } from 'express-validator';
import httpStatus from 'http-status';
import { AuthService } from '../application/login/auth-service';
import { Controller } from './controller';

export default class AuthLoginController extends ValidateFields implements Controller {
  constructor(private authService: AuthService) {
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
    const { email, password } = req.body;
    const response = await this.authService.run(email, password);
    res.status(httpStatus.OK).send({ accessToken: response.accessToken, refreshToken: response.refreshToken });
  }
}
