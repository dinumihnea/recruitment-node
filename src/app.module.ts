import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CertificateModule } from './certificate/certificate.module';
import { CONFIG_KEYS } from './common/config-keys';

@Module({
  imports: [
    AuthModule,
    CertificateModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development'],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get(CONFIG_KEYS.DATABASE_URI),
      }),
    }),
  ],
})
export class AppModule {}
