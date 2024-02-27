import { DynamicModule, Module } from '@nestjs/common';
import { _EncryptService } from './encrypt.service';
import { EncryptAsyncModuleOptions, EncryptModuleOptions } from './encrypt.module.models';

@Module({})
export class _EncryptModule {
  static register(options: EncryptModuleOptions): DynamicModule {
    return {
      global: options.global || false,
      module: _EncryptModule,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        _EncryptService,
      ],
      exports: [_EncryptService],
    };
  }

  static registerAsync(options: EncryptAsyncModuleOptions): DynamicModule {
    return {
      global: options.global || false,
      module: _EncryptModule,
      imports: options.imports,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject,
        },
        _EncryptService,
      ],
      exports: [_EncryptService],
    };
  }
}
