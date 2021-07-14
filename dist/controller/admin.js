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
//middlewares
const auth_1 = __importDefault(require("../middleware/auth"));
const upload = require("../modules/upload");
//services
const adminService_1 = require("../service/adminService");
const router = express_1.Router();
/**
 *  @관리자_페이지_조회
 *  @route Get admin
 *  @access private
 */
router.get("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield adminService_1.postAdminList(req.body.userID.id, req.query.offset, req.query.limit);
        // limit 없을 때
        if (data === -1) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
        }
        // 유저 id가 관리자가 아님
        if (data === -2) {
            response_1.response(res, returnCode_1.returnCode.NOT_FOUND, "관리자 아이디가 아닙니다");
        }
        // 관리자 챌린지 조회 성공
        else {
            response_1.dataResponse(res, returnCode_1.returnCode.OK, "관리자 페이지 조회 성공", data);
        }
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @관리자_챌린지_등록
 *  @route Post admin/challenge
 *  @access private
 */
router.post("/challenge", upload.fields([{ name: "img", maxCount: 1 }]), auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = {
            img: req.files.img
                ? req.files.img[0].location
                : "https://o2-server.s3.ap-northeast-2.amazonaws.com/origin/default_img_100%403x.jpg",
        };
        const reqData = req.body;
        const data = yield adminService_1.postAdminChallenge(req.body.userID.id, reqData, url);
        // 요청 바디가 부족할 경우
        if (data === -1) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
        }
        // 유저 id가 관리자가 아님
        else if (data === -2) {
            response_1.response(res, returnCode_1.returnCode.NOT_FOUND, "관리자 아이디가 아닙니다");
        }
        // 챌린지 기간이 신청 기간보다 빠른 경우 or 기간 입력이 잘못된 경우
        else if (data === -3) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "잘못된 기간을 입력하셨습니다");
        }
        // 관리자 챌린지 등록 성공
        else {
            response_1.response(res, returnCode_1.returnCode.OK, "관리자 챌린지 등록 성공");
        }
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @관리자_오픈콘서트_등록
 *  @route Post admin/concert
 *  @access private
 */
router.post("/concert", upload.fields([
    { name: "videoLink", maxCount: 1 },
    { name: "imgThumbnail", maxCount: 1 },
]), auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = {
            videoLink: req.files.videoLink
                ? req.files.videoLink[0].location
                : "",
            imgThumbnail: req.files.imgThumbnail
                ? req.files.imgThumbnail[0].location
                : "https://o2-server.s3.ap-northeast-2.amazonaws.com/origin/default_img_100%403x.jpg",
        };
        const reqData = req.body;
        const data = yield adminService_1.postAdminConcert(req.body.userID.id, reqData, url);
        // 요청 바디가 부족할 경우
        if (data === -1) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
        }
        // 유저 id가 관리자가 아님
        else if (data === -2) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "관리자 아이디가 아닙니다");
        }
        // 관리자 챌린지 등록 성공
        else {
            response_1.response(res, returnCode_1.returnCode.OK, "관리자 오투콘서트 등록 성공");
        }
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @관리자_공지사항_등록
 *  @route Post admin/notice
 *  @access private
 */
router.post("/notice", upload.fields([
    { name: "videoLink", maxCount: 1 },
    { name: "imgThumbnail", maxCount: 1 },
]), auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = {
            videoLink: req.files.videoLink
                ? req.files.videoLink[0].location
                : "",
            imgThumbnail: req.files.imgThumbnail
                ? req.files.imgThumbnail[0].location
                : "https://o2-server.s3.ap-northeast-2.amazonaws.com/origin/default_img_100%403x.jpg",
        };
        const reqData = req.body;
        const data = yield adminService_1.postAdminNotice(req.body.userID.id, reqData, 
        // JSON.parse(req.body.json),
        url);
        // 요청 바디가 부족할 경우
        if (data === -1) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
        }
        // 유저 id가 관리자가 아님
        else if (data === -2) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "관리자 아이디가 아닙니다");
        }
        // 관리자 공지사항 등록 성공
        else {
            response_1.response(res, returnCode_1.returnCode.OK, "관리자 공지사항 등록 성공");
        }
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
module.exports = router;
//# sourceMappingURL=admin.js.map