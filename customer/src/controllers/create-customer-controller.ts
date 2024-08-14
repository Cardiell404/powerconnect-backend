import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { CommandBus, Uuid } from '@powerconnect/shared';
import { Controller } from './controller';
import { CreateCustomerCommand } from '../application/create/create-customer-command';

export class CreateCustomerController implements Controller {
  constructor(private commandBus: CommandBus) {}

  async run(req: Request, res: Response): Promise<void> {
    const customerId: string = Uuid.random().value;
    const firstName: string = req.body.firstName;
    const lastName: string = req.body.lastName;
    const email: string = req.body.email;
    const identificationNumber: string = req.body.identificationNumber;
    const dateOfBirth: string = req.body.dateOfBirth;
    const type: string = req.body.type;
    const phoneNumber: string = req.body.phoneNumber;
    const status: string = req.body.status;
    const createdBy: string = req.body.createdBy;
    const billingInfo = req.body.billingInfo;
    const locations = req.body.locations;
    const createCustomerCommand = new CreateCustomerCommand({
      customerId,
      firstName,
      lastName,
      type,
      identificationNumber,
      email,
      dateOfBirth,
      billingInfo,
      locations,
      phoneNumber,
      status,
      createdBy
    });
    await this.commandBus.dispatch(createCustomerCommand);
    res.status(httpStatus.CREATED).send({ id: customerId });
  }
}
