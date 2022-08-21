export class WbUserNotFoundError extends Error {
  constructor(userId: string) {
    super(userId);
    this.name = this.constructor.name;
    this.message = `user "${userId}" is not found.`;
  }
}

export class WbUserAlreadyExists extends Error {
  constructor(userId: string) {
    super(userId);
    this.name = this.constructor.name;
    this.message = `user "${userId}" already exists.`;
  }
}
