type Params = {
  user: { id: string; email?: string; username?: string; avatar?: string };
};

export class AuthCurrentUserResponse {
  readonly user: { id: string; email?: string; username?: string; avatar?: string };

  constructor({ user }: Params) {
    this.user = user;
  }
}
