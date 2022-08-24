import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';
import { EncryptionService } from './encryption.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';

@Global()
@Module({
  imports: [UserModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, EncryptionService, TokenService],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
