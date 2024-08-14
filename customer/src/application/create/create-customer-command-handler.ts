import { Command, CommandHandler, CreatedAt, LastUpdated } from '@powerconnect/shared';
import { CreateCustomerCommand } from './create-customer-command';
import { CustomerCreator } from './customer-creator';
import { Customer } from '../../domain/customer';

export class CreateCustomerCommandHandler implements CommandHandler<CreateCustomerCommand> {
  constructor(private customerCreator: CustomerCreator) {}

  subscribedTo(): Command {
    return CreateCustomerCommand;
  }

  async handle(command: CreateCustomerCommand): Promise<void> {
    const customer = Customer.fromPrimitives({
      ...command,
      createdAt: CreatedAt.now().format(),
      lastUpdated: LastUpdated.now().format()
    });

    await this.customerCreator.run({ ...customer });
  }
}
