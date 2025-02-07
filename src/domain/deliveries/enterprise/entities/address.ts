import { Entity } from 'src/core/entities/entity';

interface AddressProps {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
}

export class Address extends Entity<AddressProps> {
  get street() {
    return this.props.street;
  }
  set street(value: string) {
    this.props.street = value;
  }
  get number() {
    return this.props.number;
  }
  set number(value: string) {
    this.props.number = value;
  }
  get neighborhood() {
    return this.props.neighborhood;
  }
  set neighborhood(value: string) {
    this.props.neighborhood = value;
  }
  get city() {
    return this.props.city;
  }
  set city(value: string) {
    this.props.city = value;
  }
  get state() {
    return this.props.state;
  }
  set state(value: string) {
    this.props.state = value;
  }
  get zipCode() {
    return this.props.zipCode;
  }
  set zipCode(value: string) {
    this.props.zipCode = value;
  }
  get latitude() {
    return this.props.latitude;
  }
  set latitude(value: number) {
    this.props.latitude = value;
  }
  get longitude() {
    return this.props.longitude;
  }
  set longitude(value: number) {
    this.props.longitude = value;
  }
  static create(props: AddressProps) {
    return new Address(props);
  }
}
