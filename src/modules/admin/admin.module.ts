import { UserModel } from '@/modules/user/user.model';
import { MetadataModule } from './../metadata/metadata.module';
import { MetadataService } from './../metadata/metadata.service';
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [MetadataModule, UserModel],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService]
})
export class AdminModule {}
