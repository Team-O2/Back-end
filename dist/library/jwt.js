"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkLogin = exports.isLogin = exports.verify = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const returnCode_1 = require("src/library/returnCode");
const response_1 = require("src/library/response");
const config_1 = __importDefault(require("src/config"));
function verify(authorization) {
    // verify를 통해 토큰 값을 decode 한다.
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(authorization, config_1.default.jwtSecret);
        return decoded;
    }
    catch (err) {
        if (err.message === "jwt expired") {
            console.log("expired token");
            return -3;
        }
        else if (err.message === "invalid token") {
            console.log("invalid token");
            return -2;
        }
        else {
            console.log("invalid token");
            return -2;
        }
    }
}
exports.verify = verify;
function isLogin(req, res, next) {
    const { authorization } = req.headers;
    if (authorization == undefined) {
        // 토큰이 없는 경우
        req.user = {
            userIdx: null,
        };
    }
    else {
        // 토큰이 있는 경우
        try {
            // 유효한 경우 token을 decode
            req.user = jsonwebtoken_1.default.verify(authorization, config_1.default.jwtSecret);
            next();
        }
        catch (error) {
            // 유효하지 않은 경우
            response_1.response(res, returnCode_1.returnCode.UNAUTHORIZED, error.message); //
        }
    }
}
exports.isLogin = isLogin;
function checkLogin(req, res, next) {
    const { authorization } = req.headers;
    try {
        // 유효한 경우 token decode
        req.user = jsonwebtoken_1.default.verify(authorization, config_1.default.jwtSecret);
        next();
    }
    catch (error) {
        // 유효하지 않은 경우
        response_1.response(res, returnCode_1.returnCode.UNAUTHORIZED, error.message);
    }
}
exports.checkLogin = checkLogin;
//# sourceMappingURL=jwt.js.map