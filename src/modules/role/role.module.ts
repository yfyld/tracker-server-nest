import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from '@/modules/role/role.service';
import { RoleController } from '@/modules/role/role.controller';
import { UserModule } from '@/modules/user/user.module';
import { RoleModel } from './role.model';
import { RolePermissionModel, UserRoleModel } from '@/modules/auth/auth.model';
import { PermissionModel } from '@/modules/permission/permission.model';
import { AuthModule } from '@/modules/auth/auth.module';
import { PermissionModule } from '@/modules/permission/permission.module';

@Module({
  imports: [
    forwardRef(() => PermissionModule),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([RoleModel, RolePermissionModel, UserRoleModel])
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService]
})
export class RoleModule {}
