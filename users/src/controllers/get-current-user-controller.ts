import { Request, Response } from 'express';
import httpStatus = require('http-status');
import { QueryBus } from '@powerconnect/shared';
import { Controller } from './controller';
import { UserResponse } from '../application/search-by-filters/user-response';
import { SearchUserByFilterQuery } from '../application/search-by-filters/search-user-by-filter-query';
import { FiltersMapping } from '../utils/FiltersMapping';

export class GetCurrentUserController implements Controller {
  constructor(private queryBus: QueryBus) {}

  async run(req: Request, res: Response): Promise<void> {
    const userId = req.user.id;
    console.log(userId);
    const query = new SearchUserByFilterQuery(FiltersMapping.authUserId(userId));
    const queryResponse: UserResponse = await this.queryBus.ask<UserResponse>(query);

    res.status(httpStatus.OK).json(queryResponse.toResponse());
  }
}
