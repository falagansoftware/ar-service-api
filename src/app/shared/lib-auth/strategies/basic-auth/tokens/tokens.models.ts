export interface AccessTokenPayload {
  sub: string;
  username: string;
}

export interface RefreshTokenPayload {
  userId: string;
}
