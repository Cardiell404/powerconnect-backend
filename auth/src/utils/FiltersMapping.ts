/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Filter, Filters } from '@powerconnect/shared';

export const FiltersMapping = {
  email: (email: string) =>
    new Filters(
      [
        new Map([
          ['field', 'email'],
          ['operator', '='],
          ['value', email]
        ])
      ].map(Filter.fromValues)
    )
};
