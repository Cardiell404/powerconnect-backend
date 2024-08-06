export type JwtPayload = { id: string; email: string };
export interface JwtImplement {
  createToken(payload: object): string;
  ValidateJWT(token: string): JwtPayload;
}
