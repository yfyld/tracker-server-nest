import { MetadataService } from './metadata.service';
import { NestSchedule } from 'nest-schedule';
export declare class MetadataSchedule extends NestSchedule {
    private readonly metadataService;
    constructor(metadataService: MetadataService);
    intervalAlarm(): void;
}
