import { SlsF2eService } from './sls.f2e.service';
// import { ChartService } from './helper.chart.service';
import { SlsService } from './sls.service';
import { Module, Global, HttpModule } from '@nestjs/common';

@Global()
@Module({
  imports: [],
  providers: [SlsService, SlsF2eService],
  exports: [SlsService, SlsF2eService]
})
export class SlsModule {}
