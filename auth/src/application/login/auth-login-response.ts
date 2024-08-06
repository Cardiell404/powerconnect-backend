type Params = {
  token: string;
  user: { id: string; email?: string; username?: string; avatar?: string };
};

export class AuthLoginResponse {
  readonly token: string;
  readonly user: { id: string; email?: string; username?: string; avatar?: string };

  constructor({ token, user }: Params) {
    this.token = token;
    this.user = user;
  }
}
