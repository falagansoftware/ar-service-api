export interface SignIn {
  username: string;
  password: string;
}

export interface SignInCredentials {
  accessToken: string;
  refreshToken: string;
}

export interface SignUpCredentials extends SignInCredentials {}

export interface RefreshCredentials extends SignInCredentials {}

export interface RefreshToken {
  user: {
    sub: string;
    refreshToken: string;
  };
}

export interface SignUp {
  name: string;
  surname: string;
  email: string;
  password: string;
}
