import { AnalyseFunnelService } from './analyse.funnel.service';
import { AnalyseEventService } from './analyse.event.service';
import { AnalysePathService } from './analyse.path.service';
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
  providers: [AnalyseService, AnalysePathService, AnalyseEventService, AnalyseFunnelService],
  exports: [AnalyseService, AnalysePathService, AnalyseEventService, AnalyseFunnelService]
})
export class AnalyseModule {}
