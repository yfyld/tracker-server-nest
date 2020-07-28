import { PermissionModel } from './../permission/permission.model';
import { MemberModel } from './../project/project.model';

import { UserModel } from '@/modules/user/user.model';
import { forwardRef, Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';

import { JwtModule, JwtService } from '@nestjs/jwt';

import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { AUTH } from '@/app.config';
import { SingleLoginModule } from '@/providers/singleLogin/single-login.module';
@Global()
@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secretOrPrivateKey: AUTH.jwtTokenSecret,
      signOptions: { expiresIn: AUTH.expiresIn }
    }),
    SingleLoginModule,
    TypeOrmModule.forFeature([UserModel, MemberModel, PermissionModel])
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
