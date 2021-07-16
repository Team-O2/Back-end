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
// services
const noticeService_1 = require("../service/noticeService");
// middlewares
const auth_1 = __importDefault(require("../middleware/auth"));
const publicAuth_1 = __importDefault(require("../middleware/publicAuth"));
const router = express_1.Router();
/**
 *  @공지사항_전체_가져오기
 *  @route Get /notice
 *  @access private
 */
router.get("/", publicAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield noticeService_1.getNoticeAll(req.query.offset, req.query.limit);
        // 공지사항 불러오기 성공
        const notice = data;
        // limit 없을 때
        if (data === -1) {
            response_1.response(res, returnCode_1.returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
        }
        response_1.dataResponse(res, returnCode_1.returnCode.OK, "공지사항 불러오기 성공", notice);
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @공지사항_검색_또는_필터
 *  @route Get /notice/search?keyword=검색할단어
 *  @access private
 */
router.get("/search", publicAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield noticeService_1.getNoticeSearch(req.query.keyword, req.query.offset, req.query.limit);
        // 검색 불러오기 성공
        const noticeSearch = data;
        // limit 없을 때
        if (data === -1) {
            response_1.response(res, returnCode_1.returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
        }
        response_1.dataResponse(res, returnCode_1.returnCode.OK, "검색 성공", noticeSearch);
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @공지사항_디테일
 *  @route Get /notice/:noticeID
 *  @access private
 */
router.get("/:id", publicAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const data: INotice = await getNoticeOne(req.params.id);
        const data = yield noticeService_1.getNoticeOne(req.params.id);
        response_1.dataResponse(res, returnCode_1.returnCode.OK, "해당 공지사항 불러오기 성공", data);
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @공지사항_댓글_등록
 *  @route Post /notice/comment/:noticeID
 *  @access private
 */
router.post("/comment/:id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqData = req.body;
        const data = yield noticeService_1.postNoticeComment(req.params.id, req.body.userID.id, reqData);
        // 공지사항 id가 잘못된 경우
        if (data === -1) {
            response_1.response(res, returnCode_1.returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
        }
        //  요청 바디가 부족한 경우
        if (data === -2) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
        }
        // 부모 댓글 id가 잘못된 경우
        if (data === -3) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "부모 댓글 id가 올바르지 않습니다");
        }
        // 댓글 등록 성공
        const noticeID = data;
        response_1.dataResponse(res, returnCode_1.returnCode.OK, "댓글 등록 성공", noticeID);
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
module.exports = router;
//# sourceMappingURL=notice.js.map