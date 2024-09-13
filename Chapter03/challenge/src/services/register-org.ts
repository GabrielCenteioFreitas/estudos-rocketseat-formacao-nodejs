import { OrgsRepository } from "@/repositories/orgs-repository";
import { getCepInfo } from "@/utils/get-cep-info";
import { Org } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { hash } from 'bcryptjs';
import { EmailAlreadyInUseError } from "./errors/email-already-in-use-error";
import { PhoneAlreadyInUseError } from "./errors/phone-already-in-use-error";
import { CepAlreadyInUseError } from "./errors/cep-already-in-use";

interface RegisterOrgServiceParams {
  name: string;
  email: string;
  password: string;
  authorName: string;
  cep: string;
  latitude: number;
  longitude: number;
  phone: string;
}

interface RegisterOrgServiceReturn {
  org: Org;
}

export class RegisterOrgService {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    name,
    email,
    password,
    authorName,
    cep,
    latitude,
    longitude,
    phone,
  }: RegisterOrgServiceParams): Promise<RegisterOrgServiceReturn> {
    const cepAlreadyInUse = await this.orgsRepository.findByCep(cep)

    if (cepAlreadyInUse) {
      throw new CepAlreadyInUseError()
    }

    const emailAlreadyInUse = await this.orgsRepository.findByEmail(email)

    if (emailAlreadyInUse) {
      throw new EmailAlreadyInUseError()
    }

    const phoneAlreadyInUse = await this.orgsRepository.findByPhone(phone)

    if (phoneAlreadyInUse) {
      throw new PhoneAlreadyInUseError()
    }

    
    const cepInfo = await getCepInfo(cep)
    const city = cepInfo?.localidade ?? "";
    const state = cepInfo?.estado ?? "";

    const password_hash = await hash(password, 6)

    const org = await this.orgsRepository.create({
      name,
      email,
      password_hash,
      author_name: authorName,
      cep,
      state,
      city,
      latitude: new Decimal(latitude),
      longitude: new Decimal(longitude),
      phone,
    })

    return {
      org,
    }
  }
}

