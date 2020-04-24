import { ProjectModule } from './../project/project.module';
import { ProjectModel } from './../project/project.model';
import { MetadataModule } from './../metadata/metadata.module';
import { MetadataService } from './../metadata/metadata.service';
import { Module } from '@nestjs/common';
import { AnalyseController } from './analyse.controller';
import { AnalyseService } from './analyse.service';

@Module({
  imports: [MetadataModule, ProjectModule],
  controllers: [AnalyseController],
  providers: [AnalyseService],
  exports: [AnalyseService]
})
export class AnalyseModule {}
