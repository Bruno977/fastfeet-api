export class CpfAlreadyExistsError extends Error {
  constructor() {
    super('CPF already in use');
  }
}
