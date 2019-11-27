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
const common_1 = require("@nestjs/common");
const path = require("path");
const IPDB = require("ipdb");
const ipdb = new IPDB(path.join(__dirname, './data/qqwry.ipdb'));
let IpService = class IpService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    queryIpByTaobao(ip) {
        return this.httpService.axiosRef
            .request({
            url: `http://ip.taobao.com/service/getIpInfo.php?ip=${ip}`
        })
            .then(response => {
            if (response.data && response.data.code === 0) {
                return Promise.resolve(response.data.data);
            }
            else {
                return Promise.reject(response.data);
            }
        })
            .catch(error => {
            return Promise.reject();
        });
    }
    queryIpByGeo(ip) {
        const result = ipdb.find(ip);
        if (result.code >= 0) {
            return {
                country: result.data.country_name,
                region: result.data.region_name,
                city: result.data.city_name,
                isp: result.data.isp_domain,
                ip
            };
        }
        else {
            return {
                country: '未知',
                region: '未知',
                city: '未知',
                isp: '未知',
                ip
            };
        }
    }
    query(ip) {
        const result = this.queryIpByGeo(ip);
        if (result.city !== '未知') {
            return Promise.resolve(result);
        }
        return this.queryIpByTaobao(ip)
            .then(({ city, country, isp, region, ip }) => ({
            city,
            country,
            isp,
            region,
            ip
        }))
            .catch(() => Promise.resolve(result));
    }
};
IpService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [common_1.HttpService])
], IpService);
exports.IpService = IpService;
//# sourceMappingURL=helper.ip.service.js.map