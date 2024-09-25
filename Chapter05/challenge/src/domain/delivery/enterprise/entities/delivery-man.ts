import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Location } from "./value-objects/location";
import { CPF } from "./value-objects/cpf";

export interface DeliveryManProps {
  name: string;
  cpf: CPF;
  password: string;
  location: Location;
}

export class DeliveryMan extends Entity<DeliveryManProps> {
  get name() {
    return this.props.name
  }
  
  get cpf() {
    return this.props.cpf
  }
  
  get password() {
    return this.props.password
  }
  
  get location() {
    return this.props.location
  }

  set name(name: string) {
    this.props.name = name
  }
  
  set password(password: string) {
    this.props.password = password
  }
  
  set location(location: Location) {
    this.props.location = location
  }
  
  
  static create(props: DeliveryManProps, id?: UniqueEntityID) {
    const deliveryMan = new DeliveryMan(props, id)

    return deliveryMan
  }
}