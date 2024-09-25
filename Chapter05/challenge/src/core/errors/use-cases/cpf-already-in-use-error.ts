import { UseCaseError } from "@/core/errors/use-case-error";

export class CpfAlreadyInUseError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`CPF "${identifier}" is already being used.`)
  }
}