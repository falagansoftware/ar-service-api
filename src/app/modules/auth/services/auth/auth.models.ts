export interface SignIn {
  username: string;
  password: string;
}

export interface SignInCredentials {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshCredentials extends SignInCredentials {}

export interface RefreshToken {
  user: {
    sub: string;
    refreshToken: string;
  };
}
