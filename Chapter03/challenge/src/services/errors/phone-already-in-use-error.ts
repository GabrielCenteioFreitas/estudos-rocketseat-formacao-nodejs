export class PhoneAlreadyInUseError extends Error {
  constructor() {
    super('This phone is already being used.')
  }
}