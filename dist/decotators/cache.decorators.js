"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash = require("lodash");
const HTTP = require("@/constants/http.constant");
const common_1 = require("@nestjs/common");
function HttpCache(...args) {
    const option = args[0];
    const isOption = (value) => lodash.isObject(value);
    const key = isOption(option) ? option.key : option;
    const ttl = isOption(option) ? option.ttl : args[1] || null;
    return (_, __, descriptor) => {
        if (key) {
            common_1.CacheKey(key)(descriptor.value);
        }
        if (ttl) {
            common_1.SetMetadata(HTTP.HTTP_CACHE_TTL_METADATA, ttl)(descriptor.value);
        }
        return descriptor;
    };
}
exports.HttpCache = HttpCache;
//# sourceMappingURL=cache.decorators.js.map