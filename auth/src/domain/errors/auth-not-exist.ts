export class AuthNotExist extends Error {
  constructor() {
    super('The auth does not exists');
  }
}
