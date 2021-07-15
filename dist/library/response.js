"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataTokenResponse = exports.tokenResponse = exports.dataResponse = exports.response = void 0;
const response = (res, status, message) => {
    res.status(status).json({
        status: status,
        message: message,
    });
};
exports.response = response;
const dataResponse = (res, status, message, data) => {
    res.status(status).json({
        status: status,
        message: message,
        data: data,
    });
};
exports.dataResponse = dataResponse;
const tokenResponse = (res, status, message, token) => {
    res.status(status).json({
        status: status,
        message: message,
        token: token,
    });
};
exports.tokenResponse = tokenResponse;
const dataTokenResponse = (res, status, message, data, token) => {
    res.status(status).json({
        status: status,
        message: message,
        data: data,
        token: token,
    });
};
exports.dataTokenResponse = dataTokenResponse;
//# sourceMappingURL=response.js.map