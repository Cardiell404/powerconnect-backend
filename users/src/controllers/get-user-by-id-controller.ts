import { Request, Response } from 'express';
import httpStatus = require('http-status');
import { QueryBus } from '@powerconnect/shared';
import { Controller } from './controller';
import { UserResponse } from '../application/search-by-filters/user-response';
import { GetUserByIdQuery } from '../application/get-user-by-id/get-user-by-id-query';

export class GetUserByIdController implements Controller {
  constructor(private queryBus: QueryBus) {}

  async run(req: Request, res: Response): Promise<void> {
    const query = new GetUserByIdQuery(req.params.id);

    const queryResponse: UserResponse = await this.queryBus.ask<UserResponse>(query);

    res.status(httpStatus.OK).json(queryResponse.toResponse());
  }
}
