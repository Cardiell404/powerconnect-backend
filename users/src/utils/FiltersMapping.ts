import { Filter, Filters } from '@powerconnect/shared';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const FiltersMapping = {
  authUserId: (userId: string): Filters =>
    new Filters(
      [
        new Map([
          ['field', 'authUserId'],
          ['operator', '='],
          ['value', userId]
        ])
      ].map(Filter.fromValues)
    ),
  email: (email: string): Filters =>
    new Filters(
      [
        new Map([
          ['field', 'email'],
          ['operator', '='],
          ['value', email]
        ])
      ].map(Filter.fromValues)
    ),
};
