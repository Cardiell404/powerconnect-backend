import {
  Address,
  City,
  Command,
  CommandHandler,
  CustomerId,
  DateOfBirth,
  Email,
  FirstName,
  LastName,
  PhoneNumber,
  State,
  Street,
  ZipCode
} from '@powerconnect/shared';
import { CreateCustomerCommand } from './create-customer-command';
import { CustomerCreator } from './customer-creator';
import { LocationId } from '../../domain/value-objects/location-id';
import { Location } from '../../domain/value-objects/location';
import { PaymentTerms } from '../../domain/value-objects/payment-terms';
import { TaxIdentification } from '../../domain/value-objects/tax-identification';
import { PaymentMethod } from '../../domain/value-objects/payment-method';
import { MethodType } from '../../domain/value-objects/method-type';
import { ReferenceId } from '../../domain/value-objects/reference-id';
import { CustomerIdentificationNumber } from '../../domain/value-objects/customer-identification-number';
import { CustomerType } from '../../domain/value-objects/customer-type';
import { BillingInfo } from '../../domain/value-objects/billing-info';

export class CreateCustomerCommandHandler implements CommandHandler<CreateCustomerCommand> {
  constructor(private customerCreator: CustomerCreator) {}

  subscribedTo(): Command {
    return CreateCustomerCommand;
  }

  async handle(command: CreateCustomerCommand): Promise<void> {
    const customerId = new CustomerId(command.customerId);
    const firstName = new FirstName(command.firstName);
    const lastName = new LastName(command.lastName);
    const email = new Email(command.email);
    const dateOfBirth = new DateOfBirth(command.dateOfBirth);
    const identificationNumber = new CustomerIdentificationNumber(command.identificationNumber);
    const type = new CustomerType(command.type);
    const billingInfo = new BillingInfo(
      new Address(
        new Street(command.billingInfo.billingAddress.street),
        new City(command.billingInfo.billingAddress.city),
        new ZipCode(command.billingInfo.billingAddress.zipCode),
        new State(command.billingInfo.billingAddress.state)
      ),
      new PaymentTerms(command.billingInfo.paymentTerms),
      new TaxIdentification(command.billingInfo.taxIdentification),
      new PaymentMethod(
        new MethodType(command.billingInfo.paymentMethod.methodType),
        new ReferenceId(command.billingInfo.paymentMethod.referenceId)
      )
    );
    const locations = command.locations.map(
      location =>
        new Location(
          new LocationId(location.locationId),
          new Address(
            new Street(command.billingInfo.billingAddress.street),
            new City(command.billingInfo.billingAddress.city),
            new ZipCode(command.billingInfo.billingAddress.zipCode),
            new State(command.billingInfo.billingAddress.state)
          ),
          location.meterIds
        )
    );
    const phoneNumber = new PhoneNumber(command.phoneNumber);

    await this.customerCreator.run({
      customerId,
      firstName,
      lastName,
      email,
      dateOfBirth,
      identificationNumber,
      type,
      billingInfo,
      locations,
      phoneNumber
    });
  }
}
