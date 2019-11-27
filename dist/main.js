"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const serveStatic = require("serve-static");
const helmet = require("helmet");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const compression = require("compression");
const swagger_1 = require("@nestjs/swagger");
const app_config_1 = require("./app.config");
const app_environment_1 = require("./app.environment");
const common_1 = require("@nestjs/common");
const transform_interceptor_1 = require("./interceptors/transform.interceptor");
const error_filter_1 = require("./filters/error.filter");
const error_intercptor_1 = require("./interceptors/error.intercptor");
const logging_intercptor_1 = require("./interceptors/logging.intercptor");
const cookieParser = require("cookie-parser");
const ejs_1 = require("ejs");
const dirExists_1 = require("./utils/dirExists");
const { log, warn, info } = console;
const color = c => (app_environment_1.isDevMode ? c : '');
global.console = Object.assign(console, {
    log: (...args) => log('[log]', ...args),
    warn: (...args) => warn(color('\x1b[33m%s\x1b[0m'), '[warn]', '[tracker]', ...args),
    info: (...args) => info(color('\x1b[34m%s\x1b[0m'), '[info]', '[tracker]', ...args),
    error: (...args) => info(color('\x1b[31m%s\x1b[0m'), '[error]', '[tracker]', ...args)
});
dirExists_1.dirExists(path.join(__dirname, 'publics/doc'));
dirExists_1.dirExists(path.join(__dirname, 'publics/uploads'));
dirExists_1.dirExists(path.join(__dirname, 'publics/charts'));
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(app_module_1.AppModule);
        app.use(helmet());
        app.use(compression());
        app.use(bodyParser.json({ limit: '5mb' }));
        app.use(bodyParser.text({ limit: '5mb' }));
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(cookieParser());
        app.useGlobalFilters(new error_filter_1.HttpExceptionFilter());
        app.useGlobalPipes(new common_1.ValidationPipe({}));
        app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor(new core_1.Reflector()), new error_intercptor_1.ErrorInterceptor(new core_1.Reflector()), new logging_intercptor_1.LoggingInterceptor());
        app.use('/public', serveStatic(path.join(__dirname, 'publics'), {}));
        app.setBaseViewsDir(path.join(__dirname, 'views'));
        app.engine('html', ejs_1.renderFile);
        app.setViewEngine('ejs');
        const options = new swagger_1.DocumentBuilder()
            .setTitle('my xmind api')
            .setDescription('The xmind API description')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, options);
        fs.writeFileSync(path.join(__dirname, 'publics/doc/swagger.json'), JSON.stringify(document));
        swagger_1.SwaggerModule.setup('doc-api', app, document);
        yield app.listen(app_config_1.APP.port);
    });
}
bootstrap().then(() => {
    console.info('running');
});
//# sourceMappingURL=main.js.map