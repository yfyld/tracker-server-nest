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
const fs = require("fs");
const path = require("path");
function getStat(path) {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if (err) {
                resolve(false);
            }
            else {
                resolve(stats);
            }
        });
    });
}
exports.getStat = getStat;
function mkdir(dir) {
    return new Promise((resolve, reject) => {
        fs.mkdir(dir, err => {
            if (err) {
                resolve(false);
            }
            else {
                resolve(true);
            }
        });
    });
}
exports.mkdir = mkdir;
function dirExists(dir) {
    return __awaiter(this, void 0, void 0, function* () {
        let isExists = yield getStat(dir);
        if (isExists && isExists.isDirectory()) {
            return true;
        }
        else if (isExists) {
            return false;
        }
        let tempDir = path.parse(dir).dir;
        let status = yield dirExists(tempDir);
        let mkdirStatus;
        if (status) {
            mkdirStatus = yield mkdir(dir);
        }
        return mkdirStatus;
    });
}
exports.dirExists = dirExists;
//# sourceMappingURL=dirExists.js.map