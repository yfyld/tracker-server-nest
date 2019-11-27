"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
const common_1 = require("@nestjs/common");
const HTTP = require("@/constants/http.constant");
const app_config_1 = require("@/app.config");
let HttpCacheInterceptor = class HttpCacheInterceptor extends common_1.CacheInterceptor {
    intercept(context, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const call$ = next.handle();
            const key = this.trackBy(context);
            const target = context.getHandler();
            const metaTTL = this.reflector.get(HTTP.HTTP_CACHE_TTL_METADATA, target);
            const ttl = metaTTL || app_config_1.REDIS.defaultCacheTTL;
            if (!key) {
                return call$;
            }
            try {
                const value = yield this.cacheManager.get(key);
                return value ? rxjs_1.of(value) : call$.pipe(operators_1.tap(response => this.cacheManager.set(key, response, { ttl })));
            }
            catch (error) {
                return call$;
            }
        });
    }
    trackBy(context) {
        const request = context.switchToHttp().getRequest();
        const httpServer = this.httpAdapterHost.httpAdapter;
        const isHttpApp = httpServer && !!httpServer.getRequestMethod;
        const isGetRequest = isHttpApp && httpServer.getRequestMethod(request) === common_1.RequestMethod[common_1.RequestMethod.GET];
        const requestUrl = httpServer.getRequestUrl(request);
        const cacheKey = this.reflector.get(HTTP.HTTP_CACHE_KEY_METADATA, context.getHandler());
        const isMatchedCache = isHttpApp && isGetRequest && cacheKey;
        return isMatchedCache ? cacheKey : undefined;
    }
};
HttpCacheInterceptor = __decorate([
    common_1.Injectable()
], HttpCacheInterceptor);
exports.HttpCacheInterceptor = HttpCacheInterceptor;
//# sourceMappingURL=cache.intercptor.js.map