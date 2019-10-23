import { Module } from '@nestjs/common';
import { MetadataController } from './metadata.controller';
import { MetadataService } from './metadata.service';
import { MetadataModel, FieldModel, MetadataTagModel } from './metadata.model';

import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectModel } from '../project/project.model';

@Module({
  imports: [TypeOrmModule.forFeature([MetadataModel, MetadataTagModel, ProjectModel, FieldModel])],
  providers: [MetadataService],
  controllers: [MetadataController],
  exports: [MetadataService]
})
export class MetadataModule {}
