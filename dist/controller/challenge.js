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
const publicAuth_1 = __importDefault(require("../middleware/publicAuth"));
// services
const challengeService_1 = require("../service/challengeService");
const router = express_1.Router();
/**
 *  @챌린지_회고_전체_가져오기
 *  @route Get /challenge
 *  @access public
 */
router.get("/", publicAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield challengeService_1.getChallengeAll(req.body.userID, req.query.generation, req.query.offset, req.query.limit);
        // limit 없을 때
        if (data === -1) {
            response_1.response(res, returnCode_1.returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
        }
        // 회고 전체 불러오기 성공
        const challengeAll = data;
        response_1.dataResponse(res, returnCode_1.returnCode.OK, "회고 전체 불러오기 성공", challengeAll);
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @챌린지_회고_검색_또는_필터
 *  @route Get /challenge/search
 *  @access public
 */
router.get("/search", publicAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield challengeService_1.getChallengeSearch(req.query.tag, req.query.ismine, req.query.keyword, req.query.offset, req.query.limit, req.query.generation, req.body.userID);
        // limit 없을 때
        if (data === -1) {
            response_1.response(res, returnCode_1.returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
        }
        // 회고 전체 불러오기 성공
        const challengeSearch = data;
        response_1.dataResponse(res, returnCode_1.returnCode.OK, "검색 성공", challengeSearch);
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @챌린지_회고_가져오기
 *  @route Get /challenge/:challengeID
 *  @access public
 */
router.get("/:id", publicAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield challengeService_1.getChallengeOne(req.body.userID, req.params.id);
        // challengeID가 이상할 때
        if (data === -1) {
            response_1.response(res, returnCode_1.returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
        }
        response_1.dataResponse(res, returnCode_1.returnCode.OK, "회고 불러오기 성공", data);
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @챌린지_회고_등록
 *  @route Post /challenge/:userId
 *  @access private
 */
router.post("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqData = req.body;
        const data = yield challengeService_1.postChallenge(req.body.userID.id, reqData);
        // 요청 바디가 부족할 경우
        if (data === -1) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
        }
        // 유저 id 잘못된 경우
        if (data === -2) {
            response_1.response(res, returnCode_1.returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
        }
        // 회고 등록 성공
        const challenge = data;
        response_1.dataResponse(res, returnCode_1.returnCode.OK, "회고 등록 성공", challenge);
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @챌린지_회고_수정
 *  @route Patch /challenge/:challengeId
 *  @access private
 */
router.patch("/:id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqData = req.body;
        const data = yield challengeService_1.patchChallenge(req.params.id, reqData);
        // 회고 id가 잘못된 경우
        if (data === -1) {
            response_1.response(res, returnCode_1.returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
        }
        // 요청 바디가 부족한 경우
        if (data === -2) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
        }
        //회고 수정 성공
        const challenge = data;
        response_1.dataResponse(res, returnCode_1.returnCode.OK, "회고 수정 성공", challenge);
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @챌린지_회고_삭제
 *  @route Delete /challenge/:challengeId
 *  @access private
 */
router.delete("/:id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield challengeService_1.deleteChallenge(req.body.userID.id, req.params.id);
        // 회고 id가 잘못된 경우
        if (data === -1) {
            response_1.response(res, returnCode_1.returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
        }
        // 회고 삭제 성공
        const challengeID = data;
        response_1.dataResponse(res, returnCode_1.returnCode.OK, "회고 삭제 성공", challengeID);
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @챌린지_회고_댓글_등록
 *  @route Post /challenge/comment/:challengeID
 *  @access private
 */
router.post("/comment/:id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqData = req.body;
        const data = yield challengeService_1.postChallengeComment(req.params.id, req.body.userID.id, reqData);
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
        const challengeID = data;
        response_1.dataResponse(res, returnCode_1.returnCode.OK, "댓글 등록 성공", challengeID);
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @챌린지_회고_좋아요_등록
 *  @route Post /challenge/like/:challengeID
 *  @access private
 */
router.post("/like/:id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield challengeService_1.postChallengeLike(req.params.id, req.body.userID.id);
        // 회고 id가 잘못된 경우
        if (data === -1) {
            response_1.response(res, returnCode_1.returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
        }
        // 이미 좋아요 한 글일 경우
        if (data === -2) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "이미 좋아요 한 글입니다");
        }
        // 좋아요 등록 성공
        const challengeID = data;
        response_1.dataResponse(res, returnCode_1.returnCode.OK, "좋아요 등록 성공", challengeID);
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @챌린지_회고_좋아요_삭제하기
 *  @route Delete /challenge/like/:challengeID
 *  @access private
 */
router.delete("/like/:id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield challengeService_1.deleteChallengeLike(req.params.id, req.body.userID.id);
        // 회고 id가 잘못된 경우
        if (data === -1) {
            response_1.response(res, returnCode_1.returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
        } // 좋아요 한 개수가 0인 경우
        if (data === -2) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "좋아요 개수가 0");
        }
        // 좋아요 삭제 성공
        const challengeID = data;
        response_1.dataResponse(res, returnCode_1.returnCode.OK, "좋아요 삭제 성공", challengeID);
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @유저_챌린지_회고_스크랩하기
 *  @route Post /challenge/scrap/:challengeID
 *  @access private
 */
router.post("/scrap/:id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield challengeService_1.postChallengeScrap(req.params.id, req.body.userID.id);
        // 회고 id가 잘못된 경우
        if (data === -1) {
            response_1.response(res, returnCode_1.returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
        }
        // 이미 유저가 스크랩한 글일 경우
        if (data === -2) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "이미 스크랩 된 글입니다");
        }
        // 자신의 회고인 경우
        if (data === -3) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "자신의 글은 스크랩 할 수 없습니다");
        }
        // 회고 스크랩 성공
        response_1.dataResponse(res, returnCode_1.returnCode.OK, "회고 스크랩 성공", data);
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
/**
 *  @유저_챌린지_회고_스크랩_취소하기
 *  @route Delete /challenge/scrap/:challengeID
 *  @access private
 */
router.delete("/scrap/:id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield challengeService_1.deleteChallengeScrap(req.params.id, req.body.userID.id);
        // 회고 id가 잘못된 경우
        if (data === -1) {
            response_1.response(res, returnCode_1.returnCode.NOT_FOUND, "요청 아이디가 올바르지 않습니다");
        }
        // 스크랩 하지 않은 글일 경우
        if (data === -2) {
            response_1.response(res, returnCode_1.returnCode.BAD_REQUEST, "스크랩 하지 않은 글입니다");
        }
        // 스크랩 취소 성공
        response_1.dataResponse(res, returnCode_1.returnCode.OK, "회고 스크랩 취소 성공", data);
    }
    catch (err) {
        console.error(err.message);
        response_1.response(res, returnCode_1.returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
}));
module.exports = router;
//# sourceMappingURL=challenge.js.map