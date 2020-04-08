//解析excel
import { XlsxService } from './xlsx.service';
import { Module, Global, HttpModule } from '@nestjs/common';

const services = [XlsxService];

@Global()
@Module({
  imports: [HttpModule],
  providers: services,
  exports: services
})
export class XlsxModule {}
