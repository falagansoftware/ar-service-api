import { ModuleMetadata, FactoryProvider } from "@nestjs/common";

export interface EncryptModuleOptions {
  global?: boolean;
  hashConfigurations: EncryptHashConfigurations[];
}

export interface EncryptHashConfigurations {
  name: string;
  salt: number;
}


export type EncryptAsyncModuleOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<EncryptModuleOptions>, 'useFactory' | 'inject'> & { global?: boolean };
