"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_config_1 = require("./../../app.config");
const canvas_1 = require("canvas");
const fs = require("fs");
const path = require("path");
const echarts = require("echarts");
const common_1 = require("@nestjs/common");
let ChartService = class ChartService {
    constructor() { }
    generateImg(config) {
        var ctx = canvas_1.createCanvas(128, 128);
        echarts.setCanvasCreator(function () {
            return ctx;
        });
        var chart, option = {
            title: {
                text: 'test'
            },
            tooltip: {},
            legend: {
                data: ['test']
            },
            xAxis: {
                data: ['a', 'b', 'c', 'd', 'f', 'g']
            },
            yAxis: {},
            series: [
                {
                    name: 'test',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20]
                }
            ]
        };
        let defaultConfig = {
            width: 600,
            height: 400,
            option,
            enableAutoDispose: true,
            path: path.join(__dirname, '../../publics/charts/default.png')
        };
        config = Object.assign({}, defaultConfig, config);
        config.option.animation = false;
        chart = echarts.init(canvas_1.createCanvas(parseInt(config.width, 10), parseInt(config.height, 10)));
        chart.setOption(config.option);
        if (config.path) {
            try {
                fs.writeFileSync(config.path, chart.getDom().toBuffer());
                if (config.enableAutoDispose) {
                    chart.dispose();
                }
                return `${app_config_1.BASE_URL.serverUrl}/public/charts/${config.path.replace(/^.*\/([^/]+\.png)/, '$1')}`;
            }
            catch (err) {
                console.error('Error: Write File failed' + err.message);
            }
        }
        else {
            var buffer = chart.getDom().toBuffer();
            try {
                if (config.enableAutoDispose) {
                    chart.dispose();
                }
            }
            catch (e) { }
            return buffer;
        }
    }
};
ChartService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], ChartService);
exports.ChartService = ChartService;
//# sourceMappingURL=helper.chart.service.js.map