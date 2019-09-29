import { Module } from '@nestjs/common';
import { MetadataController } from './metadata.controller';
import { MetadataService } from './metadata.service';
import { MetadataModel } from './metadata.model';

import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectModel } from '../project/project.model';

@Module({
  imports: [TypeOrmModule.forFeature([MetadataModel, ProjectModel])],
  providers: [MetadataService],
  controllers: [MetadataController],
  exports: [MetadataService],
})
export class MetadataModule {}
