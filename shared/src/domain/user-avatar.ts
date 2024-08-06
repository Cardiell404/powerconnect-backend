import { StringValueObject } from './value-object/string-value-object';

export class UserAvatar extends StringValueObject {
  constructor(value: string) {
    super(value);
  }
}
