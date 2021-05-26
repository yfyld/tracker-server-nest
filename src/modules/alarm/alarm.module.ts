import { AlarmService } from './alarm.service';
import { AlarmSchedule } from './alarm.schedule';
import { HttpModule, HttpService, Module } from '@nestjs/common';

@Module({
  providers: [AlarmService, AlarmSchedule],
  controllers: [],
  exports: [AlarmService]
})
export class AlarmModule {}
