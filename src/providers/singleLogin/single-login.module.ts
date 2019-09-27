import { SingleLoginService } from './single-login.service';
import { Module, Global } from '@nestjs/common';

const services = [SingleLoginService];

@Global()
@Module({
  imports: [],
  providers: services,
  exports: services,
})
export class SingleLoginModule {}
