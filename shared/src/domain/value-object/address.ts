import { City } from './city';
import { InvalidArgumentError } from './invalid-argument-error';
import { State } from './state';
import { Street } from './street';
import { ZipCode } from './zip-code';

export class Address {
  readonly street: Street;
  readonly city: City;
  readonly zipCode: ZipCode;
  readonly state: State;

  constructor(street: Street, city: City, zipCode: ZipCode, state: State) {
    if (!street || !city || !zipCode || !state) {
      throw new InvalidArgumentError('Invalid Address: All components must be provided');
    }
    this.city = city;
    this.zipCode = zipCode;
    this.street = street;
    this.state = state;
    Object.freeze(this);
  }

  equals(other: Address): boolean {
    if (!other) {
      return false;
    }
    return (
      this.street.equals(other.street) &&
      this.city.equals(other.city) &&
      this.zipCode.equals(other.zipCode) &&
      this.state.equals(other.state)
    );
  }

  toString(): string {
    return `${this.street.value}, ${this.city.value}, ${this.zipCode.value}, ${this.state.value}`;
  }
}
