import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionService } from '@/modules/permission/permission.service';
import { PermissionController } from '@/modules/permission/permission.controller';
import { PermissionModel } from './permission.model';
import { UserModule } from '../user/user.module';
import { RolePermissionModel } from '@/modules/auth/auth.model';
import { RoleModule } from '@/modules/role/role.module';

@Module({
  imports: [
    forwardRef(() => RoleModule),
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([PermissionModel, RolePermissionModel])
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService]
})
export class PermissionModule {}
