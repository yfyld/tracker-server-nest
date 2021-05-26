import { AlarmService } from './alarm.service';
import { Injectable } from '@nestjs/common';
import { Cron, Interval, Timeout, NestSchedule } from 'nest-schedule';

@Injectable()
export class AlarmSchedule extends NestSchedule {
  constructor(private readonly alarmService: AlarmService) {
    super();
  }

  @Interval(1000)
  intervalCheckMetadata() {
    this.alarmService.scheduleIntervalHugeLogAlarm();
  }
}
