import { ValueObject } from './value-object';

export class CreatedAt extends ValueObject<Date> {
  constructor(value: Date) {
    super(value);
  }

  public static now(): CreatedAt {
    return new CreatedAt(new Date());
  }

  public format(): string {
    return this.value.toISOString();
  }
}
