import { ApiUseTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';

import { AdminService } from './admin.service';

@ApiUseTags('管理')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
}
