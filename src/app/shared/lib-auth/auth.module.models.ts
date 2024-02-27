import { FactoryProvider, ModuleMetadata } from '@nestjs/common';
import { AppError } from '../lib-errors';

export interface AuthModuleOptions {
  global?: boolean;
  type: AuthStrategy;
  config: { basic?: BasicAuthConfig; firebase?: FirebaseConfig; custom?: any };
}

export type AuthAsyncModuleOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<AuthModuleOptions>, 'useFactory' | 'inject'> & { global?: boolean };

export enum AuthStrategy {
  BASIC = 'basic',
  FIREBASE = 'firebase',
  CUSTOM = 'custom',
}

export interface BasicAuthConfig {
  usersService: BasicAuthUsersService;
}

export interface BasicAuthUsersService {
  create(
    signUp: SignUp,
  ): Promise<({ [key: string]: any } & { password: string; email: string; uid: string } | AppError)>;
  findBy(criteria: {
    [key: string]: any;
  }): Promise<({ [key: string]: any } & { password: string; email: string; uid: string } | AppError)>;
}

export interface FirebaseConfig {}

export interface CustomConfig {
  service: any;
}

export interface AuthStrategyService {
  signIn(signIn: SignIn): Promise<SignInCredentials | AppError>;
  signUp(signUp: SignUp): Promise<SignInCredentials | AppError>;
  validateUser(username: string, password: string): Promise<boolean | AppError>;
  refreshSession(refreshToken: RefreshToken): Promise<RefreshCredentials | AppError>;
}

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
