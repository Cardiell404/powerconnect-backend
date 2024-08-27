import { Command, CommandHandler, CustomerId } from '@powerconnect/shared';
import { DeleteCustomerCommand } from './delete-customer-command';
import { CustomerDeleter } from './customer-deleter';

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
