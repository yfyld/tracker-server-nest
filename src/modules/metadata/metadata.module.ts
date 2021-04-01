import { EnumService } from './enum.service';
import { MetadataSchedule } from './metadata.schedule';
import { HttpModule, HttpService, Module } from '@nestjs/common';
import { MetadataController } from './metadata.controller';
import { MetadataService } from './metadata.service';
import { MetadataModel, FieldModel, MetadataTagModel } from './metadata.model';

import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectModel } from '../project/project.model';
import { ModuleModel } from '../module/module.model';
import { ModuleService } from '../module/module.service';
import { EnumModel } from './enum.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([MetadataModel, MetadataTagModel, ProjectModel, ModuleModel, EnumModel]),
    HttpModule
  ],
  providers: [MetadataService, MetadataSchedule, ModuleService, EnumService],
  controllers: [MetadataController],
  exports: [MetadataService]
})
export class MetadataModule {}
