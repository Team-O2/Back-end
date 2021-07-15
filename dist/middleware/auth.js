"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const returnCode_1 = require("../library/returnCode");
const response_1 = require("../library/response");
exports.default = (req, res, next) => {
    // 토큰 검사
    if (req.headers.authorization == null) {
        response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "토큰 값이 요청되지 않았습니다");
    }
    const token = req.headers.authorization;
    // Verify token
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
        req.body.userID = decoded.user;
        next();
    }
    catch (err) {
        if (err.message === "jwt expired") {
            response_1.response(res, returnCode_1.returnCode.UNAUTHORIZED, "만료된 토큰입니다");
        }
        else {
            response_1.response(res, returnCode_1.returnCode.UNAUTHORIZED, "적합하지 않은 토큰입니다");
        }
    }
};
//# sourceMappingURL=auth.js.map