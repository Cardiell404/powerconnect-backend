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
  Status,
  Street,
  ZipCode
} from '@powerconnect/shared';
import { CustomerUpdater } from './customer-updater';
import { UpdateCustomerCommand } from './update-customer-command';
import { CustomerIdentificationNumber } from '../../domain/value-objects/customer-identification-number';
import { CustomerType } from '../../domain/value-objects/customer-type';
import { BillingInfo } from '../../domain/value-objects/billing-info';
import { Location } from '../../domain/value-objects/location';
import { PaymentTerms } from '../../domain/value-objects/payment-terms';
import { TaxIdentification } from '../../domain/value-objects/tax-identification';
import { PaymentMethod } from '../../domain/value-objects/payment-method';
import { MethodType } from '../../domain/value-objects/method-type';
import { ReferenceId } from '../../domain/value-objects/reference-id';
import { LocationId } from '../../domain/value-objects/location-id';

export class UpdateCustomerCommandHandler implements CommandHandler<UpdateCustomerCommand> {
  constructor(private customerUpdater: CustomerUpdater) {}

  subscribedTo(): Command {
    return UpdateCustomerCommand;
  }

  async handle(command: UpdateCustomerCommand): Promise<void> {
    const customerId = new CustomerId(command.customerId);
    const firstName = new FirstName(command.firstName);
    const lastName = new LastName(command.lastName);
    const email = new Email(command.email);
    const dateOfBirth = new DateOfBirth(command.dateOfBirth);
    const identificationNumber = new CustomerIdentificationNumber(command.identificationNumber);
    const status = new Status(command.status);
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

    await this.customerUpdater.run({
      customerId,
      firstName,
      lastName,
      email,
      dateOfBirth,
      identificationNumber,
      status,
      type,
      billingInfo,
      locations,
      phoneNumber
    });
  }
}
