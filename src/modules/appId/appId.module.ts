import { forwardRef, Module } from '@nestjs/common';
import { AppIdService } from './appId.service';
import { AppIdController } from './appId.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppIdModel } from './appId.model';

@Module({
  imports: [TypeOrmModule.forFeature([AppIdModel])],
  controllers: [AppIdController],
  providers: [AppIdService],
  exports: [AppIdService]
})
export class AppIdModule {}
