import { ALARM_INTERVAL } from '../../app.config';
import { MetadataService } from './metadata.service';
import { Injectable } from '@nestjs/common';
import { Cron, Interval, Timeout, NestSchedule } from 'nest-schedule';

@Injectable()
export class MetadataSchedule extends NestSchedule {
  constructor(private readonly metadataService: MetadataService) {
    super();
  }

  @Interval(30000)
  intervalCheckMetadata() {
    this.metadataService.scheduleIntervalCheckMetadata();
  }

  @Interval(30000)
  intervalFindMetadata() {
    this.metadataService.scheduleIntervalFindMetadata();
  }

  //@Cron('0 0 2 * *')
  @Interval(30000)
  async cronComputedEventAttrRecommend() {
    this.metadataService.scheduleCronComputedEventAttrRecommend();
  }
}
