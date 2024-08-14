import { Filter, Filters } from '@powerconnect/shared';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const FiltersMapping = {
  customerIdAndHidden: (customerId: string): Filters =>
    new Filters(
      [
        new Map([
          ['field', 'customerId'],
          ['operator', '='],
          ['value', customerId]
        ])
      ].map(Filter.fromValues)
    ),
  customerId: (customerId: string): Filters =>
    new Filters(
      [
        new Map([
          ['field', 'customerId'],
          ['operator', '='],
          ['value', customerId]
        ])
      ].map(Filter.fromValues)
    ),
  customerIdentificationNumberAndHidden: (customerIdentificationNumber: string): Filters =>
    new Filters(
      [
        new Map([
          ['field', 'identificationNumber'],
          ['operator', '='],
          ['value', customerIdentificationNumber]
        ]),
        new Map<string, any>([
          ['field', 'status'],
          ['operator', '='],
          ['value', 'active']
        ])
      ].map(Filter.fromValues)
    )
};
