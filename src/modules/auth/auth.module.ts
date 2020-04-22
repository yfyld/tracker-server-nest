import { UserModel } from '@/modules/user/user.model';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import { RolePermissionModel, UserRoleModel } from '@/modules/auth/auth.model';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PermissionModule } from '@/modules/permission/permission.module';
import { RoleModule } from '@/modules/role/role.module';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { AUTH } from '@/app.config';
import { SingleLoginModule } from '@/providers/singleLogin/single-login.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PermissionModule,
    RoleModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secretOrPrivateKey: AUTH.jwtTokenSecret,
      signOptions: { expiresIn: AUTH.expiresIn }
    }),
    SingleLoginModule,
    TypeOrmModule.forFeature([UserRoleModel, RolePermissionModel, UserModel])
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
