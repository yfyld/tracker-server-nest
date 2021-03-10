import { ModuleSchedule } from './module.schedule';
import { Module } from '@nestjs/common';
import { ModuleController } from './module.controller';
import { ModuleService } from './module.service';
import {
  ModuleModel
  //  FieldModel, ModuleTagModel
} from './module.model';

import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectModel } from '../project/project.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ModuleModel,
      ProjectModel
      //  ModuleTagModel,  FieldModel
    ])
  ],
  providers: [ModuleService, ModuleSchedule],
  controllers: [ModuleController],
  exports: [ModuleService]
})
export class ModuleModule {}
