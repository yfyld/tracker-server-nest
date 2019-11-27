"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_config_1 = require("./../../app.config");
const elasticsearch_1 = require("@nestjs/elasticsearch");
exports.EsModule = elasticsearch_1.ElasticsearchModule.register(app_config_1.ES_CONFIG);
//# sourceMappingURL=es.module.js.map