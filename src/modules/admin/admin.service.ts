import { RoleModel, PermissionModel } from './../user/user.model';
import { UserModel } from '@/modules/user/user.model';
import { SlsService } from '@/providers/sls/sls.service';
import { Injectable } from '@nestjs/common';

import { MetadataService } from '../metadata/metadata.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userModel: Repository<UserModel>,
    @InjectRepository(RoleModel)
    private readonly roleModel: Repository<RoleModel>,
    @InjectRepository(PermissionModel)
    private readonly permissionModel: Repository<PermissionModel>
  ) {}
}
