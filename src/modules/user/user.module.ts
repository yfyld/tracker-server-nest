import { RoleModel } from './../role/role.model';
import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserModel } from './user.model';

import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@/pipes/validation.pipe';
import { AuthModule } from '../auth/auth.module';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => RoleModule),
    TypeOrmModule.forFeature([UserModel, RoleModel])
  ],
  providers: [
    UserService,
    JwtStrategy,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    }
  ],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
