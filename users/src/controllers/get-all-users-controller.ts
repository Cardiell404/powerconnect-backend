import { Request, Response } from 'express';
import httpStatus = require('http-status');
import { QueryBus } from '@powerconnect/shared';
import { Controller } from './controller';
import { FindUserQuery } from '../application/find/find-user-query';
import { UsersResponse } from '../application/find/users-response';
import { User } from '../domain/user';

export class GetAllUsersController implements Controller {
  constructor(private queryBus: QueryBus) {}

  async run(_req: Request, res: Response): Promise<void> {
    const query = new FindUserQuery();
    const queryResponse: UsersResponse = await this.queryBus.ask<UsersResponse>(query);
    res.status(httpStatus.OK).json(this.toResponse(queryResponse.users));
  }

  private toResponse(users: Array<User>) {
    return users.map(user => ({
      userId: user?.userId.toString(),
      customerId: user?.customerId?.toString(),
      fullName: user?.fullName.toString(),
      email: user?.email.toString(),
      phoneNumber: user?.phoneNumber.toString(),
      createdAt: user?.createdAt.value,
      lastUpdated: user?.lastUpdated.value,
      status: user?.status.value
    }));
  }
}
