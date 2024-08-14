import { Command, CommandHandler } from '@powerconnect/shared';
import { DeleteCustomerCommand } from './delete-customer-command';
import { CustomerDeleter } from './customer-deleter';
import { CustomerId } from '../../domain/value-objects/customer-id';

export class DeleteCustomerCommandHandler implements CommandHandler<DeleteCustomerCommand> {
  constructor(private customerDeleter: CustomerDeleter) {}

  subscribedTo(): Command {
    return DeleteCustomerCommand;
  }

  async handle(command: DeleteCustomerCommand): Promise<void> {
    const customerId = new CustomerId(command.customerId);
    await this.customerDeleter.run(customerId);
  }
}
