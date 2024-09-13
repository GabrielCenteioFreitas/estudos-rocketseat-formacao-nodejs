import { OrgsRepository } from "@/repositories/orgs-repository";
import { Org } from "@prisma/client";
import { compare } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

interface LoginAsAnOrgServiceParams {
  email: string;
  password: string;
}

interface LoginAsAnOrgServiceResponse {
  org: Org;
}

export class LoginAsAnOrgService {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    email,
    password,
  }: LoginAsAnOrgServiceParams): Promise<LoginAsAnOrgServiceResponse> {
    const org = await this.orgsRepository.findByEmail(email)

    if (!org) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await compare(password, org.password_hash)

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }
  
    return {
      org,
    }
  }
}