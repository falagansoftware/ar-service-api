import { DynamicModule, FactoryProvider, Module, ModuleMetadata } from '@nestjs/common';
import { EncryptService } from './encrypt.service';
import { EncryptModuleOptions } from './encrypt.module.models';

type EncryptAsyncModuleOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<EncryptModuleOptions>, 'useFactory' | 'inject'> & { global?: boolean };

@Module({})
export class EncryptModule {
  static register(options: EncryptModuleOptions): DynamicModule {
    return {
      global: options.global || false,
      module: EncryptModule,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        EncryptService,
      ],
      exports: [EncryptService],
    };
  }

  static registerAsync(options: EncryptAsyncModuleOptions): DynamicModule {
    return {
      global: options.global || false,
      module: EncryptModule,
      imports: options.imports,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject,
        },
        EncryptService,
      ],
      exports: [EncryptService],
    };
  }
}
