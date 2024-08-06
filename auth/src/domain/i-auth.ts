export interface IAuth {
  readonly id: string;
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly avatar?: string;
}
