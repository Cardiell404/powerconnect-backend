import { Request, Response } from 'express';
import httpStatus = require('http-status');
import { QueryBus } from '@powerconnect/shared';
import { Controller } from './controller';
import { CustomersResponse } from '../application/find/customers-response';
import { FindCustomerQuery } from '../application/find/find-customer-query';
import { Customer } from '../domain/customer';

export class GetAllCustomersController implements Controller {
  constructor(private queryBus: QueryBus) {}

  async run(_req: Request, res: Response): Promise<void> {
    const query = new FindCustomerQuery();
    const queryResponse: CustomersResponse = await this.queryBus.ask<CustomersResponse>(query);
    res.status(httpStatus.OK).json(this.toResponse(queryResponse.customers));
  }

  private toResponse(customers: Array<Customer>) {
    return customers.map(customer => ({
      id: customer?.customerId.toString(),
      firstName: customer?.firstName?.toString(),
      lastName: customer?.lastName?.toString(),
      dateOfBirth: customer?.dateOfBirth?.toString(),
      email: customer?.email?.toString(),
      phoneNumber: customer?.phoneNumber.toString(),
      status: customer?.status.value,
      identificationNumber: customer?.identificationNumber?.toString(),
      type: customer?.type.value,
      billingInfo: customer?.billingInfo.toPrimitives(),
      locations: customer?.locations.map(location => location.toPrimitives()),
      lastupdated: customer?.lastUpdated.toString(),
      createdAt: customer?.createdAt.toString()
    }));
  }
}
