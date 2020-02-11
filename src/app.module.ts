import { BullQueueModule } from './providers/bull-queue/bull-queue.module';
import { EsModule } from './providers/es/es.module';
import { HelperModule } from './providers/helper/helper.module';
import { SlsModule } from './providers/sls/sls.module';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/user.module';
import { ProjectModule } from './modules/project/project.module';
import { CommonModule } from './modules/common/common.module';
import { CorsMiddleware } from './middlewares/cors.middleware';
import { DatabaseModule } from './providers/database/database.module';
import { PermissionsGuard } from './guards/permission.guard';
import { MetadataModule } from './modules/metadata/metadata.module';
import { BoardModule } from './modules/board/board.module';
import { TeamModule } from './modules/team/team.module';
import { ReportModule } from './modules/report/report.module';
import { RedisModule } from './providers/redis/redis.module';
import { AnalyseModule } from './modules/analyse/analyse.module';
@Module({
  imports: [
    DatabaseModule,
    UserModule,
    ProjectModule,
    AnalyseModule,
    CommonModule,
    HelperModule,
    EsModule,
    BullQueueModule,
    ReportModule,
    BoardModule,
    MetadataModule,
    TeamModule,
    SlsModule,
    RedisModule
  ],
  controllers: [AppController],
  providers: [PermissionsGuard]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes('*');
  }
}
