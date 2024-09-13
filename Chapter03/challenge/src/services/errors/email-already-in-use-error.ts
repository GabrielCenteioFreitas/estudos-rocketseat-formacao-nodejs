export class EmailAlreadyInUseError extends Error {
  constructor() {
    super('This email is already being used.')
  }
}