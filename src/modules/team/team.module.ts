import { UserModel } from '@/modules/user/user.model';
import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { TeamModel } from './team.model';

import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TeamModel, UserModel])],
  providers: [TeamService],
  controllers: [TeamController],
  exports: [TeamService]
})
export class TeamModule {}
