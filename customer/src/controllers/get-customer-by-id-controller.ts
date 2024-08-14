import { Request, Response } from 'express';
import httpStatus = require('http-status');
import { QueryBus } from '@powerconnect/shared';
import { Controller } from './controller';
import { CustomerResponse } from '../application/search-by-filters/customer-response';
import { FiltersMapping } from '../utils/FiltersMapping';
import { SearchCustomerByFilterQuery } from '../application/search-by-filters/search-customer-by-filter-query';

export class GetCustomerByIdController implements Controller {
  constructor(private queryBus: QueryBus) {}

  async run(req: Request, res: Response): Promise<void> {
    const query = new SearchCustomerByFilterQuery(FiltersMapping.customerIdAndHidden(req.params.id));
    const queryResponse: CustomerResponse = await this.queryBus.ask<CustomerResponse>(query);

    res.status(httpStatus.OK).json(queryResponse.toResponse());
  }
}
