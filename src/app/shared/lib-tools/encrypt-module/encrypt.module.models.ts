export interface EncryptModuleOptions {
  global?: boolean;
  hashConfigurations: EncryptHashConfigurations[];
}

export interface EncryptHashConfigurations {
  name: string;
  salt: number;
}
