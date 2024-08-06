import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { Controller } from './controller';

export default class AuthSignOutController implements Controller {
  async run(req: Request, res: Response): Promise<void> {
    req.session = null;
    res.status(httpStatus.OK).send();
  }
}
