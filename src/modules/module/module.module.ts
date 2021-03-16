// import { ModuleSchedule } from './module.schedule';
import { Module } from '@nestjs/common';
import { ModuleController } from './module.controller';
import { ModuleService } from './module.service';
import { ModuleModel } from './module.model';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleModel])],
  controllers: [ModuleController],
  providers: [ModuleService],
  exports: [ModuleService]
})
export class ModuleModule {}
