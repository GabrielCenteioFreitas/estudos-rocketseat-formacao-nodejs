export class CPF {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(cpf: string) {
    return new CPF(cpf)
  }

  toString() {
    return this.value
  }

  equals(cpfToCompare: string) {
    return this.value === cpfToCompare
  }
}