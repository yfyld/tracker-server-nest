import { MetadataModule } from './../metadata/metadata.module';
import { MetadataService } from './../metadata/metadata.service';
import { Module } from '@nestjs/common';
import { AnalyseController } from './analyse.controller';
import { AnalyseService } from './analyse.service';

@Module({
  imports: [MetadataModule],
  controllers: [AnalyseController],
  providers: [AnalyseService],
  exports: [AnalyseService]
})
export class AnalyseModule {}
