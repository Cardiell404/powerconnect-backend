import { Address, InvalidArgumentError } from '@powerconnect/shared';
import { LocationId } from './location-id';

export class Location {
  readonly locationId: LocationId;
  readonly address: Address;
  readonly meterIds: Array<string>;

  constructor(locationId: LocationId, address: Address, meterIds: Array<string>) {
    if (!locationId || !address || !meterIds) {
      throw new InvalidArgumentError('Invalid location: All components must be provided');
    }
    this.locationId = locationId;
    this.address = address;
    this.meterIds = meterIds;
    Object.freeze(this);
  }

  equals(other: Location): boolean {
    if (!other) {
      return false;
    }
    return (
      this.locationId.equals(other.locationId) &&
      this.address.equals(other.address) &&
      this.meterIds.every((id, index) => id === other.meterIds[index])
    );
  }

  toString(): string {
    return `${this.locationId}, ${this.address}, ${this.meterIds}`;
  }

  toPrimitives() {
    return {
      locationId: this.locationId.value,
      address: {
        state: this.address.state.value,
        city: this.address.city.value,
        street: this.address.street.value,
        zipCode: this.address.zipCode.value
      },
      meterIds: this.meterIds
    };
  }
}
