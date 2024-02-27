import { Inject, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { EncryptHashConfigurations, EncryptModuleOptions } from './encrypt.module.models';

@Injectable()
export class _EncryptService {
  private readonly logger: Logger;
  private hashConfigurations: EncryptHashConfigurations[] = [];

  constructor(@Inject('CONFIG_OPTIONS') private options: EncryptModuleOptions) {
    this.logger = new Logger();
    this.initModule(options);
  }

  private initModule(options: EncryptModuleOptions) {
    this.setHashConfigurations(options.hashConfigurations);
    this.logger.log('Encrypt Module initialized', 'Encrypt');
  }

  private setHashConfigurations(hashConfigurations: EncryptHashConfigurations[]) {
    if (hashConfigurations) {
      this.hashConfigurations = hashConfigurations;
    }
  }

  public async hash(name: string, pass: string): Promise<string | null> {
    const hashConfig = this.hashConfigurations.find((hashConfig) => hashConfig.name === name);
    if (hashConfig) {
      return await bcrypt.hash(pass, hashConfig.salt);
    } else {
      this.logger.log('Hash config not found', 'Encrypt Hash');
      return null;
    }
  }

  public async compare(name: string, pass: string, hash: string, extraPass?: string): Promise<boolean | null> {
    const hashConfig = this.hashConfigurations.find((hashConfig) => hashConfig.name === name);
    if (hashConfig) {
      const password = extraPass ? pass + extraPass : pass;
      return await bcrypt.compare(password, hash);
    } else {
      this.logger.log('Hash config not found', 'Encrypt Compare Hash');
      return null;
    }
  }
}
