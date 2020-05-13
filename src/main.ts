import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as serveStatic from 'serve-static';
import * as helmet from 'helmet';
import * as fs from 'fs';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as rateLimit from 'express-rate-limit';
import * as compression from 'compression';

import { APP } from './app.config';
import { isDevMode } from './app.environment';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { PermissionsGuard } from './guards/permission.guard';
import { AuthGuard } from '@nestjs/passport';
import { HttpExceptionFilter } from './filters/error.filter';
import { ErrorInterceptor } from './interceptors/error.intercptor';
import { LoggerInterceptor } from './interceptors/logger.intercptor';
import * as cookieParser from 'cookie-parser';
import { renderFile } from 'ejs';
import { NestExpressApplication } from '@nestjs/platform-express';
import { dirExists } from './utils/dirExists';
import { Logger } from './utils/logger';
import { getConnection } from 'typeorm';

const { log, warn, debug, info } = console;
const color = c => (isDevMode ? c : '');
global.console = Object.assign(console, {
  log: (...args) => log('[log]', ...args),
  warn: (...args) => {
    Logger.warn(...args);
    return warn(color('\x1b[33m%s\x1b[0m'), '[warn]', '[nodepress]', ...args);
  },
  info: (...args) => {
    Logger.info(...args);
    return info(color('\x1b[34m%s\x1b[0m'), '[info]', '[nodepress]', ...args);
  },
  error: (...args) => {
    Logger.error(...args);
    return info(color('\x1b[31m%s\x1b[0m'), '[error]', '[nodepress]', ...args);
  },
  debug: (...args) => {
    Logger.debug(...args);
    return debug(color('\x1b[33m%s\x1b[0m'), '[debug]', '[nodepress]', ...args);
  }
});

dirExists(path.join(__dirname, 'public/doc'));
dirExists(path.join(__dirname, 'public/uploads'));
dirExists(path.join(__dirname, 'public/charts'));

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(helmet());
  app.use(compression());
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.text({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  //app.use(rateLimit({ max: 1000, windowMs: 15 * 60 * 1000 }));

  // const permissionsGuard = app
  // .select(AppModule)
  // .get(PermissionsGuard);
  // app.useGlobalGuards(permissionsGuard);

  app.useGlobalFilters(new HttpExceptionFilter());
  // 验证
  app.useGlobalPipes(
    new ValidationPipe({
      //skipMissingProperties: true,
    })
  );

  // 拦截器
  app.useGlobalInterceptors(
    new TransformInterceptor(new Reflector()),
    new ErrorInterceptor(new Reflector()),
    new LoggerInterceptor()
  );

  app.use('/public', serveStatic(path.join(__dirname, 'public'), {}));

  app.setBaseViewsDir(path.join(__dirname, 'views'));
  app.engine('html', renderFile);
  app.setViewEngine('ejs');

  // swagger
  // const options = new DocumentBuilder()
  //   .setTitle('my xmind api')
  //   .setDescription('The xmind API description')
  //   .setVersion('1.0')
  //   .addBearerAuth()
  //   .build();

  // const document = SwaggerModule.createDocument(app, options);
  // fs.writeFileSync(path.join(__dirname, 'public/doc/swagger.json'), JSON.stringify(document));
  // SwaggerModule.setup('doc-api', app, document);

  await app.listen(APP.port);
}
bootstrap().then(() => {
  // tslint:disable-next-line:no-console
  console.info('running listen ' + APP.port);
});
