export class Validation {
  static username(username) {
    if (typeof username !== 'string') {
      throw new Error('username must be string');
    }
    if (username.length < 3) {
      throw new Error('username must be at least 3 characters long');
    }
  }

  static password(password) {
    if (typeof password !== 'string') {
      throw new Error('password must be string');
    }
    if (password.length < 6) {
      throw new Error('password must be at least 6 characters long');
    }
  }
}
