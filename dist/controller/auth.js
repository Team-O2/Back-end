"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
// libraries
const returnCode_1 = require("../library/returnCode");
const response_1 = require("../library/response");
// services
const authService_1 = require("../service/authService");
const router = express_1.Router();
/**yar
 *  @회원가입
 *  @route Post auth/signup
 *  @access Public
 */
router.post("/signup", [
    express_validator_1.check("email", "Please include a valid email").isEmail(),
    express_validator_1.check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const reqData = req.body;
        const data = yield authService_1.postSignup(reqData);
        // 요청 바디가 부족할 경우
        if (data == -1) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
        } // 이미 존재하는 아이디
        else if (data == -2) {
            response_1.response(res, returnCode_1.returnCode.CONFLICT, "중복된 아이디 입니다");
        }
        // 회원가입 성공
        else {
            const { user, token } = data;
            response_1.tokenResponse(res, returnCode_1.returnCode.CREATED, "회원가입 성공", token);
        }
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @로그인
 *  @route Post auth/signin
 *  @desc Authenticate user & get token
 *  @access Public
 */
router.post("/signin", [express_validator_1.check("email", "Please include a valid email").isEmail()], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const reqData = req.body;
        const data = yield authService_1.postSignin(reqData);
        // 요청 바디가 부족할 경우
        if (data == -1) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
        }
        // email이 DB에 없을 경우
        else if (data == -2) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "아이디가 존재하지 않습니다");
        }
        // password가 틀렸을 경우
        else if (data == -3) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "비밀번호가 틀렸습니다");
        }
        // 로그인 성공
        else {
            const { userData, token } = data;
            response_1.dataTokenResponse(res, returnCode_1.returnCode.OK, "로그인 성공", userData, token);
        }
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @이메일_인증번호_전송
 *  @route Post auth/email
 *  @access Public
 */
router.post("/email", [express_validator_1.check("email", "Please include a valid email").isEmail()], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const data = yield authService_1.postEmail(req.body);
        // 요청 바디가 부족할 경우
        if (data == -1) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
        }
        // email이 DB에 없을 경우
        if (data == -2) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "아이디가 존재하지 않습니다");
        }
        // 성공
        response_1.response(res, returnCode_1.returnCode.OK, "인증번호 전송 성공");
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @인증번호_확인
 *  @route Post auth/code
 *  @access Public
 */
router.post("/code", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield authService_1.postCode(req.body);
        // 요청 바디가 부족할 경우
        if (data === -1) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
        }
        // email이 DB에 없을 경우
        if (data === -2) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "아이디가 존재하지 않습니다");
        }
        // 인증번호가 올바르지 않은 경우
        if (data === -3) {
            response_1.dataResponse(res, returnCode_1.returnCode.OK, "인증번호 인증 실패", { isOkay: false });
        }
        // 인증번호 인증 성공
        response_1.dataResponse(res, returnCode_1.returnCode.OK, "인증번호 인증 성공", { isOkay: true });
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @비밀번호_변경
 *  @route Patch auth/pw
 *  @desc Authenticate user & get token
 *  @access Public
 */
router.patch("/pw", [
    express_validator_1.check("email", "Please include a valid email").isEmail(),
    express_validator_1.check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const reqData = req.body;
        const data = yield authService_1.patchPassword(reqData);
        // 요청 바디가 부족할 경우
        if (data === -1) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
        }
        // email이 DB에 없을 경우
        if (data === -2) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "아이디가 존재하지 않습니다");
        }
        // 성공
        response_1.response(res, returnCode_1.returnCode.OK, "비밀번호 변경 성공");
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @햄버거바
 *  @route Post auth/hamburger
 *  @desc
 *  @access Public
 */
router.get("/hamburger", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield authService_1.getHamburger();
        // 조회 성공
        response_1.dataResponse(res, returnCode_1.returnCode.OK, "햄버거바 조회 성공", data);
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
module.exports = router;
//# sourceMappingURL=auth.js.map