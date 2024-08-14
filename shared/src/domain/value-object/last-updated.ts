import { ValueObject } from './value-object';

export class LastUpdated extends ValueObject<Date> {
  constructor(value: Date) {
    super(value);
  }

  public static now(): LastUpdated {
    return new LastUpdated(new Date());
  }

  public format(): string {
    return this.value.toISOString();
  }
}
