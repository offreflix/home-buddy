export interface JwtPayload {
  sub: number;
  username: string;
  jti?: string;
  iat?: number;
  exp?: number;
}


