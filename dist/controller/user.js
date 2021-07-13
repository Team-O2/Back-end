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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// libraries
const returnCode_1 = require("../library/returnCode");
const response_1 = require("../library/response");
// middlewares
const auth_1 = __importDefault(require("../middleware/auth"));
// modules
const upload = require("../modules/upload");
// services
const userService_1 = require("../service/userService");
const router = express_1.Router();
/**
 *  @User_챌린지_신청하기
 *  @route Post user/register
 *  @access Public
 */
router.post("/register", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield userService_1.postRegister(req.body.userID.id, req.body);
        // 요청 바디가 부족할 경우
        if (data === -1) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
        }
        // 유저 id가 관리자 아이디임
        else if (data === -2) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "관리자 아이디는 신청할 수 없습니다");
        }
        else if (data === -3) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "신청 기간이 아닙니다.");
        }
        // 이미 신청된 아이디일 경우
        else if (data == -4) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "이미 신청이 완료된 사용자.");
        }
        // 신청 인원이 초과되었을 경우
        else if (data === -5) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "신청 인원이 초과되었습니다");
        }
        // 챌린지 신청 성공
        else {
            response_1.response(res, returnCode_1.returnCode.OK, "챌린지 신청 성공");
        }
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @마이페이지_회원정보_조회
 *  @route Get user/userInfo
 *  @access private
 */
router.get("/userInfo", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield userService_1.getUserInfo(req.body.userID.id);
        // 유저정보 조회 성공
        response_1.dataResponse(res, returnCode_1.returnCode.OK, "유저정보 조회 성공", data);
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @마이페이지_회원정보_수정
 *  @route Patch user
 *  @access private
 */
router.patch("/userInfo", upload.fields([{ name: "img", maxCount: 1 }]), auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = {
            img: req.files.img
                ? req.files.img[0].location
                : "https://o2-server.s3.ap-northeast-2.amazonaws.com/origin/default_img_100%403x.jpg",
        };
        const data = yield userService_1.patchInfo(req.body.userID.id, req.body, url);
        // 요청 바디가 부족할 경우
        if (data === -1) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다.");
        }
        response_1.dataResponse(res, returnCode_1.returnCode.OK, "회원정보 수정 성공", data);
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @마이페이지_비밀번호_수정
 *  @route Patch user/pw
 *  @access private
 */
router.patch("/password", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield userService_1.patchPW(req.body.userID.id, req.body);
        // 요청 바디가 부족할 경우
        if (data === -1) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
        }
        // 현재 password와 맞지 않을 경우
        if (data === -2) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "현재 비밀번호가 일치하지 않습니다");
        }
        response_1.dataResponse(res, returnCode_1.returnCode.OK, "비밀번호 수정 성공", data);
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @User_마이페이지_콘서트_스크랩
 *  @route Get user/mypage/concert
 *  @access Public
 */
router.get("/mypage/concert", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield userService_1.getMypageConcert(req.body.userID.id, req.query.offset, req.query.limit);
        // 1. no content
        if (data == -1) {
            response_1.response(res, returnCode_1.returnCode.NO_CONTENT, "스크랩한 Share Together가 없습니다.");
        }
        // 2. limit 없을 때
        if (data === -2) {
            response_1.response(res, returnCode_1.returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
        }
        // 마이페이지 콘서트 조회 성공
        else {
            response_1.dataResponse(res, returnCode_1.returnCode.OK, "Share Together 스크랩 조회 성공", data);
        }
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @User_마이페이지_회고_스크랩
 *  @route Get user/mypage/challenge
 *  @access Public
 */
router.get("/mypage/challenge", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield userService_1.getMypageChallenge(req.body.userID.id, req.query.offset, req.query.limit);
        // 1. no content
        if (data == -1) {
            response_1.response(res, returnCode_1.returnCode.NO_CONTENT, "스크랩한 learn Myself가 없습니다.");
        }
        // 2. limit 없을 때
        if (data === -2) {
            response_1.response(res, returnCode_1.returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
        }
        // 마이페이지 콘서트 조회 성공
        else {
            response_1.dataResponse(res, returnCode_1.returnCode.OK, "learn Myself 스크랩 조회 성공", data);
        }
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @User_마이페이지_Info
 *  @route Get user/mypage/info
 *  @access private
 */
router.get("/mypage/info", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield userService_1.getMypageInfo(req.body.userID.id);
        // 유저정보 조회 성공
        response_1.dataResponse(res, returnCode_1.returnCode.OK, "마이페이지 유저정보 검색 성공", data);
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @User_마이페이지_회고_스크랩_취소토글
 *  @route Delete user/mypage/challenge/:challengeID
 *  @access private
 */
router.delete("/mypage/challenge/:id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield userService_1.deleteMypageChallenge(req.body.userID.id, req.params.id);
        // 회고 id가 잘못된 경우
        if (data === -1) {
            response_1.response(res, returnCode_1.returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
        }
        // 스크랩 하지 않은 글일 경우
        if (data === -2) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "스크랩 하지 않은 글입니다");
        }
        // 마이페이지 회고 스크랩 취소
        response_1.response(res, returnCode_1.returnCode.OK, "스크랩 취소 성공");
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @마이페이지_내가_쓴_글
 *  @route Get user/mypage/write/:userID
 *  @access Private
 */
router.get("/mypage/write", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield userService_1.getMyWritings(req.body.userID.id, req.query.offset, req.query.limit);
        // limit 없을 때
        if (data === -1) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다.");
        }
        response_1.dataResponse(res, returnCode_1.returnCode.OK, "내가 쓴 글 가져오기 성공", data);
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @마이페이지_내가_쓴_댓글
 *  @route Get user/mypage/comment
 *  @access Private
 */
router.get("/mypage/comment", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield userService_1.getMyComments(req.body.userID.id, req.query.offset, req.query.limit);
        // limit 없을 때
        if (data === -1) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다.");
        }
        response_1.dataResponse(res, returnCode_1.returnCode.OK, "내가 쓴 댓글 가져오기 성공", data);
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @마이페이지_내가_쓴_댓글_삭제
 *  @route Delete user/mypage/comment
 *  @access Private
 */
router.delete("/mypage/comment", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield userService_1.deleteMyComments(req.body);
        // 요청 바디가 부족할 경우
        if (data === -1) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다.");
        }
        response_1.dataResponse(res, returnCode_1.returnCode.OK, "내가 쓴 댓글 삭제 성공", data);
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
module.exports = router;
//# sourceMappingURL=user.js.map