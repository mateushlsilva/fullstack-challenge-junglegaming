export interface JwtPayload {
  sub: string;
  userEmail: string;
  iat?: number;
  exp?: number;
}
