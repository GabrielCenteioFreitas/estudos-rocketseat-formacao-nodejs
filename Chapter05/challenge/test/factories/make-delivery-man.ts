import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DeliveryMan, DeliveryManProps } from "@/domain/delivery/enterprise/entities/delivery-man";
import { CPF } from "@/domain/delivery/enterprise/entities/value-objects/cpf";
import { Location } from "@/domain/delivery/enterprise/entities/value-objects/location";
import { faker } from "@faker-js/faker";

export function makeDeliveryMan(
  override: Partial<DeliveryManProps> = {},
  id?: UniqueEntityID,
) {
  const deliveryMan = DeliveryMan.create(
    {
      name: faker.person.fullName(),
      cpf: CPF.create(faker.number.bigInt().toString()),
      password: faker.internet.password(),
      location: Location.create({
        longitude: faker.location.longitude(),
        latitude: faker.location.latitude(),
      }),
      ...override,
    },
    id
  )

  return deliveryMan
}