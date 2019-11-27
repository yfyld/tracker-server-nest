"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash = require("lodash");
const HTTP = require("@/constants/http.constant");
const common_1 = require("@nestjs/common");
const buildHttpDecorator = (options) => {
    const { errMessage, successMessage, errCode, successCode, usePaginate } = options;
    return (_, __, descriptor) => {
        if (errCode) {
            common_1.SetMetadata(HTTP.HTTP_ERROR_CODE, errCode)(descriptor.value);
        }
        if (successCode) {
            common_1.SetMetadata(HTTP.HTTP_SUCCESS_CODE, successCode)(descriptor.value);
        }
        if (errMessage) {
            common_1.SetMetadata(HTTP.HTTP_ERROR_MESSAGE, errMessage)(descriptor.value);
        }
        if (successMessage) {
            common_1.SetMetadata(HTTP.HTTP_SUCCESS_MESSAGE, successMessage)(descriptor.value);
        }
        if (usePaginate) {
            common_1.SetMetadata(HTTP.HTTP_RES_TRANSFORM_PAGINATE, true)(descriptor.value);
        }
        return descriptor;
    };
};
exports.error = (message, statusCode) => {
    return buildHttpDecorator({ errMessage: message, errCode: statusCode });
};
exports.success = (message, statusCode) => {
    return buildHttpDecorator({ successMessage: message, successCode: statusCode });
};
function handle(...args) {
    const option = args[0];
    const isOption = (value) => lodash.isObject(value);
    const message = isOption(option) ? option.message : option;
    const errMessage = message + HTTP.HTTP_ERROR_SUFFIX;
    const successMessage = message + HTTP.HTTP_SUCCESS_SUFFIX;
    const errCode = isOption(option) ? option.error : null;
    const successCode = isOption(option) ? option.success : null;
    const usePaginate = isOption(option) ? option.usePaginate : null;
    return buildHttpDecorator({ errCode, successCode, errMessage, successMessage, usePaginate });
}
exports.handle = handle;
exports.paginate = () => {
    return buildHttpDecorator({ usePaginate: true });
};
exports.HttpProcessor = { error: exports.error, success: exports.success, handle, paginate: exports.paginate };
//# sourceMappingURL=http.decotator.js.map