import { MetadataSchedule } from './metadata.schedule';
import { Module } from '@nestjs/common';
import { MetadataController } from './metadata.controller';
import { MetadataService } from './metadata.service';
import { MetadataModel, FieldModel, MetadataTagModel } from './metadata.model';

import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectModel } from '../project/project.model';
import { ModuleModel } from '../module/module.model';
import { ModuleService } from '../module/module.service';

@Module({
  imports: [TypeOrmModule.forFeature([MetadataModel, MetadataTagModel, ProjectModel, FieldModel, ModuleModel])],
  providers: [MetadataService, MetadataSchedule, ModuleService],
  controllers: [MetadataController],
  exports: [MetadataService]
})
export class MetadataModule {}
