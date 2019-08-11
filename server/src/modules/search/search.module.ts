import { ErrorModule } from './../error/error.module';
import { ErrorService } from './../error/error.service';
import { BullModule } from 'nest-bull';
import { SearchQueue } from './search.queue';
import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';

@Module({
  imports: [
    ElasticsearchModule.register({
      host: '127.0.0.1:9600',
      log: 'trace',
    }),
    BullModule.forRoot({
      //name: 'store',
      options: {
        redis: {
          host: '127.0.0.1',
          port: 6666,
          password: '342531',
          db: 1,
        },
      },
      processors: [],
    }),
    ErrorModule,
  ],
  controllers: [SearchController],
  providers: [SearchService, SearchQueue],
})
export class SearchModule {}
