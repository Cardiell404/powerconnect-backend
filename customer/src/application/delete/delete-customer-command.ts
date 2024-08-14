import { Command } from '@powerconnect/shared';

export class DeleteCustomerCommand extends Command {
  constructor(public readonly customerId: string) {
    super();
  }
}
