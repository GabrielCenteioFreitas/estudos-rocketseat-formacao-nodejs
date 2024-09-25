import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { CPF } from "./value-objects/cpf";
import { Location } from "./value-objects/location";

export interface RecipientProps {
  name: string;
  cpf: CPF;
  password: string;
  location: Location;
}

export class Recipient extends Entity<RecipientProps> {
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
  
  static create(props: RecipientProps, id?: UniqueEntityID) {
    const recipient = new Recipient(props, id)

    return recipient
  }
}