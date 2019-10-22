import { ALARM_INTERVAL } from '../../app.config';
import { MetadataService } from './metadata.service';
import { Injectable } from '@nestjs/common';
import { Cron, Interval, Timeout, NestSchedule } from 'nest-schedule';

@Injectable()
export class MetadataSchedule extends NestSchedule {
  constructor(private readonly metadataService: MetadataService) {
    super();
  }

  // @Cron('0 0 2 * *', {
  //   startTime: new Date(),
  //   endTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  // })
  // async cronJob() {
  //   console.log('executing cron job');
  // }

  // @Timeout(5000)
  // onceJob() {
  //   console.log('executing once job');
  // }

  @Interval(ALARM_INTERVAL)
  intervalAlarm() {
    console.log('auto alarm');
    // return true; //to stop
  }
}
