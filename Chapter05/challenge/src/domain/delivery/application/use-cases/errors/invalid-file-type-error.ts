import { UseCaseError } from "@/core/errors/use-case-error";

export class InvalidFileTypeError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`The type "${identifier}" is not valid.`)
  }
}