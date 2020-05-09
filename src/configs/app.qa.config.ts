import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import * as path from 'path';

export const APP = {
  port: 5000,
  version: '1.0.0'
};

export const AUTH = {
  jwtTokenSecret: 'I am quiet handsome man',
  expiresIn: 99999999999999,
  defaultPassword: '123456',
  data: { username: 'root', roles: [] }
};

export const CROSS_DOMAIN = {
  allowedOrigins: []
};

export const BULLCONFIG = {};

export const CCONFIG = {};

export const MULTER_OPTIONS = {
  fileSize: 10000000,
  path: path.join(__dirname, 'public/uploads')
};

export const ALARMCONFIG = {
  alarmWithlevelType: [1, 10, 100]
};

export const STAT_USER_NUM_INTERVAL = 30000;
export const ALARM_INTERVAL = 30000;
export const GENERATE_IMG_CRON = '0 0 11 * *';

export const BASE_URL = {
  webUrl: 'http://telescope.qa.91jkys.com',
  serverUrl: 'http://telescope.qa.91jkys.com/api'
};

const opsConfig = require('/app/config/config.ts');

export const ORMCONFIG: MysqlConnectionOptions = {
  type: 'mysql',
  ...opsConfig.db,
  database: 'telescope',
  entities: [__dirname + '/**/*.model{.ts,.js}'],
  synchronize: true
};

export const REDIS = {
  ...opsConfig.redis,
  db: 10
};

export const LOGGER_CONFIG = {
  path: path.join(__dirname, '/app/logs/telescope-server'),
  daysToKeep: 30,
  pattern: 'yyyy-MM-dd.log',
  level: 'debug'
};

export const SLS_CONFIG = {
  ...opsConfig.sls
};

export const SLS_STORE_CONFIG = {
  projectName: 'k8s-log-custom-ks-qa',
  logStoreName: 'frontlo-collection-telescope-process-qa'
};
