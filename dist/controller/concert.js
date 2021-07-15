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
const concertService_1 = require("../service/concertService");
// middlewares
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.Router();
/**
 *  @오투콘서트_전체_가져오기
 *  @route Get /concert
 *  @access Private
 */
router.get("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield concertService_1.getConcertAll(req.query.offset, req.query.limit);
        // limit 없을 때
        if (data === -1) {
            response_1.response(res, returnCode_1.returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
        }
        // 회고 전체 불러오기 성공
        const concert = data;
        response_1.dataResponse(res, returnCode_1.returnCode.OK, "콘서트 전체 불러오기 성공", concert);
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @오투콘서트_검색_또는_필터
 *  @route Get /concert/search?tag=관심분야&ismine=내글만보기여부&keyword=검색할단어
 *  @access Private
 */
router.get("/search", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield concertService_1.getConcertSearch(req.query.tag, req.query.keyword, req.query.offset, req.query.limit);
        // limit 없을 때
        if (data === -1) {
            response_1.response(res, returnCode_1.returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
        }
        // 검색 불러오기 성공
        const concertSearch = data;
        response_1.dataResponse(res, returnCode_1.returnCode.OK, "검색 성공", concertSearch);
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @오투콘서트_Detail
 *  @route Get /concert/:concertID
 */
router.get("/:id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const data: IConcrtDTO = await getConcertOne(req.params.id);
        const data = yield concertService_1.getConcertOne(req.params.id);
        const concert = data;
        response_1.dataResponse(res, returnCode_1.returnCode.OK, "해당 콘서트 게시글 불러오기 성공", concert);
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @콘서트_댓글_등록
 *  @route Post /concert/comment/:concertID
 *  @access Private
 */
router.post("/comment/:id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqData = req.body;
        const data = yield concertService_1.postConcertComment(req.params.id, req.body.userID.id, reqData);
        // 회고 id가 잘못된 경우
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
        const concertComment = data;
        response_1.dataResponse(res, returnCode_1.returnCode.OK, "댓글 등록 성공", concertComment);
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @오투콘서트_좋아요_등록
 *  @route Post /concert/like/:concertID
 *  @access Private
 */
router.post("/like/:id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield concertService_1.postConcertLike(req.params.id, req.body.userID.id);
        // 회고 id가 잘못된 경우
        if (data === -1) {
            response_1.response(res, returnCode_1.returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
        }
        // 이미 좋아요 한 글일 경우
        if (data === -2) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "이미 좋아요 한 글입니다");
        }
        // 좋아요 등록 성공
        const concert = data;
        response_1.dataResponse(res, returnCode_1.returnCode.OK, "좋아요 등록 성공", concert);
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @오투콘서트_좋아요_삭제하기
 *  @route Delete /concert/like/:concertID
 *  @access Private
 */
router.delete("/like/:id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield concertService_1.deleteConcertLike(req.params.id, req.body.userID.id);
        // 콘서트 id가 잘못된 경우
        if (data === -1) {
            response_1.response(res, returnCode_1.returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
        } // 좋아요 한 개수가 0인 경우
        if (data === -2) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "해당 게시글을 좋아요하지 않았습니다");
        }
        // 좋아요 삭제 성공
        const concert = data;
        response_1.dataResponse(res, returnCode_1.returnCode.OK, "좋아요 삭제 성공", concert);
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @유저_챌린지_회고_스크랩하기
 *  @route Post /concert/scrap/:concertID
 *  @access Private
 */
router.post("/scrap/:id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield concertService_1.postConcertScrap(req.params.id, req.body.userID.id);
        // 회고 id가 잘못된 경우
        if (data === -1) {
            response_1.response(res, returnCode_1.returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
        }
        // 이미 유저가 스크랩한 글일 경우
        if (data === -2) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "이미 스크랩 된 글입니다");
        }
        // 회고 스크랩 성공
        response_1.dataResponse(res, returnCode_1.returnCode.OK, "콘서트 스크랩 성공", data);
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @오투콘서트_회고_스크랩_취소하기
 *  @route Delete /concert/scrap/:concertID
 *  @access Private
 */
router.delete("/scrap/:id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield concertService_1.deleteConcertScrap(req.params.id, req.body.userID.id);
        // 콘서트 id가 잘못된 경우
        if (data === -1) {
            response_1.response(res, returnCode_1.returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
        }
        // 스크랩 하지 않은 글일 경우
        if (data === -2) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "스크랩 하지 않은 글입니다");
        }
        // 스크랩 취소 성공
        response_1.dataResponse(res, returnCode_1.returnCode.OK, "콘서트 스크랩 취소 성공", data);
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
module.exports = router;
//# sourceMappingURL=concert.js.map