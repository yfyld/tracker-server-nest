import { UserModel } from './../user/user.model';
import { MetadataModel } from './../metadata/metadata.model';
// import { ModuleSchedule } from './module.schedule';
import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { CheckoutLogModel } from './checkout.model';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CheckoutLogModel, MetadataModel, UserModel])],
  controllers: [CheckoutController],
  providers: [CheckoutService],
  exports: [CheckoutService]
})
export class CheckoutModule {}
