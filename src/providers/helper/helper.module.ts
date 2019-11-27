// import { ChartService } from './helper.chart.service';
import { UaService } from './helper.ua.service';
import { Module, Global, HttpModule } from '@nestjs/common';

const services = [UaService];

@Global()
@Module({
  imports: [HttpModule],
  providers: services,
  exports: services
})
export class HelperModule {}
