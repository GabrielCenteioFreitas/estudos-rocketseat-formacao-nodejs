export class CepAlreadyInUseError extends Error {
  constructor() {
    super('This cep is already being used.')
  }
}