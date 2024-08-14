import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { CommandBus } from '@powerconnect/shared';
import { Controller } from './controller';
import { UpdateCustomerCommand } from '../application/update/update-customer-command';

export class UpdateCustomerController implements Controller {
  constructor(private commandBus: CommandBus) {}

  async run(req: Request, res: Response): Promise<void> {
    const customerId: string = req.params.id;
    const firstName: string = req.body.firstName;
    const lastName: string = req.body.lastName;
    const email: string = req.body.email;
    const identificationNumber: string = req.body.identificationNumber;
    const dateOfBirth: string = req.body.dateOfBirth;
    const type: string = req.body.type;
    const phoneNumber: string = req.body.phoneNumber;
    const status: string = req.body.status;
    const billingInfo = req.body.billingInfo;
    const locations = req.body.locations;
    const updateCustomerCommand = new UpdateCustomerCommand({
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
      status
    });
    await this.commandBus.dispatch(updateCustomerCommand);

    res.status(httpStatus.CREATED).send({ id: customerId });
  }
}
