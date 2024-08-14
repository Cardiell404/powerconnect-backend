import { Request, Response } from 'express';
import { Controller } from './controller';
import { CommandBus } from '@powerconnect/shared';
import { DeleteCustomerCommand } from '../application/delete/delete-customer-command';

export class DeleteCustomerController implements Controller {
  constructor(private commandBus: CommandBus) {}

  async run(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const createFeedbackCommand = new DeleteCustomerCommand(id);
    await this.commandBus.dispatch(createFeedbackCommand);
    res.status(204).send({ id });
  }
}
