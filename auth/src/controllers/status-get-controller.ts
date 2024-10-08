import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { Controller } from './controller';

export default class StatusGetController implements Controller {
  async run(req: Request, res: Response): Promise<void> {
    res.status(httpStatus.OK).send();
  }
}
