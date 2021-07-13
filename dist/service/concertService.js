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
exports.deleteConcertScrap = exports.postConcertScrap = exports.deleteConcertLike = exports.postConcertLike = exports.postConcertComment = exports.getConcertSearch = exports.getConcertOne = exports.getConcertAll = void 0;
// models
const Concert_1 = __importDefault(require("../models/Concert"));
const User_1 = __importDefault(require("../models/User"));
const Comment_1 = __importDefault(require("../models/Comment"));
const Badge_1 = __importDefault(require("../models/Badge"));
/**
 *  @오투콘서트_전체_가져오기
 *  @route Get /concert
 */
const getConcertAll = (offset, limit) => __awaiter(void 0, void 0, void 0, function* () {
    // isDelete = true 인 애들만 가져오기
    // offset 뒤에서 부터 가져오기
    // 최신순으로 정렬
    // 댓글, 답글 populate
    // 댓글, 답글 최신순으로 정렬
    if (!limit) {
        return -1;
    }
    if (!offset) {
        offset = 0;
    }
    let concerts;
    concerts = yield Concert_1.default.find({
        isDeleted: false,
        isNotice: false,
    })
        .skip(Number(offset))
        .limit(Number(limit))
        .sort({ _id: -1 })
        .populate("user", ["nickname", "img"])
        .populate({
        path: "comments",
        select: { userID: 1, text: 1, isDeleted: 1 },
        options: { sort: { _id: -1 } },
        populate: [
            {
                path: "childrenComment",
                select: { userID: 1, text: 1, isDeleted: 1 },
                options: { sort: { _id: -1 } },
                populate: {
                    path: "userID",
                    select: ["nickname", "img"],
                },
            },
            {
                path: "userID",
                select: ["nickname", "img"],
            },
        ],
    });
    let totalConcertNum = yield Concert_1.default.find({
        isDeleted: false,
        isNotice: false,
    }).count();
    return { concerts, totalConcertNum };
});
exports.getConcertAll = getConcertAll;
/**
 *  @오투콘서트_Detail
 *  @route Get /concert/:concertID
 */
const getConcertOne = (concertID) => __awaiter(void 0, void 0, void 0, function* () {
    // 댓글, 답글 populate
    // isDelete = true 인 애들만 가져오기
    const concert = yield Concert_1.default.find({ _id: concertID }, { isDeleted: false })
        .populate("user", ["nickname", "img"])
        .populate({
        path: "comments",
        select: { userID: 1, text: 1, isDeleted: 1 },
        options: { sort: { _id: -1 } },
        populate: [
            {
                path: "childrenComment",
                select: { userID: 1, text: 1, isDeleted: 1 },
                options: { sort: { _id: -1 } },
                populate: {
                    path: "userID",
                    select: ["nickname", "img"],
                },
            },
            {
                path: "userID",
                select: ["nickname", "img"],
            },
        ],
    });
    return concert[0];
});
exports.getConcertOne = getConcertOne;
/**
 *  @오투콘서트_검색_또는_필터
 *  @route Get /concert/search?tag=관심분야&ismine=내글만보기여부&keyword=검색할단어
 */
const getConcertSearch = (tag, keyword, offset, limit) => __awaiter(void 0, void 0, void 0, function* () {
    // isDelete = true 인 애들만 가져오기
    // offset 뒤에서 부터 가져오기
    // 최신순으로 정렬
    // 댓글, 답글 populate
    if (!limit) {
        return -1;
    }
    if (!offset) {
        offset = 0;
    }
    let concerts;
    concerts = yield Concert_1.default.find({
        isDeleted: false,
        isNotice: false,
    })
        .skip(Number(offset))
        .limit(Number(limit))
        .sort({ _id: -1 })
        .populate("user", ["nickname", "img"])
        .populate({
        path: "comments",
        select: { userID: 1, text: 1, isDeleted: 1 },
        options: { sort: { _id: -1 } },
        populate: [
            {
                path: "childrenComment",
                select: { userID: 1, text: 1, isDeleted: 1 },
                options: { sort: { _id: -1 } },
                populate: {
                    path: "userID",
                    select: ["nickname", "img"],
                },
            },
            {
                path: "userID",
                select: ["nickname", "img"],
            },
        ],
    });
    let filteredData = concerts;
    // 관심분야 필터링
    if (tag !== "") {
        filteredData = filteredData.filter((fd) => {
            if (fd.interest.includes(tag.toLowerCase()))
                return fd;
        });
    }
    // 검색 단어 필터링
    if (keyword !== "") {
        filteredData = filteredData.filter((fd) => {
            if (fd.text.includes(keyword.toLowerCase().trim()) ||
                fd.title.includes(keyword.toLowerCase().trim()) ||
                fd.hashtag.includes(keyword.toLowerCase().trim()))
                return fd;
        });
    }
    return filteredData;
});
exports.getConcertSearch = getConcertSearch;
/**
 *  @콘서트_댓글_등록
 *  @route Post /concert/comment/:concertID
 *  @access Private
 *  @error
 *      1. 회고록 id 잘못됨
 *      2. 요청 바디 부족
 *      3. 부모 댓글 id 값이 유효하지 않을 경우
 */
const postConcertComment = (concertID, userID, body) => __awaiter(void 0, void 0, void 0, function* () {
    const { parentID, text } = body;
    // 1. 회고록 id 잘못됨
    const concert = yield Concert_1.default.findById(concertID);
    if (!concert || concert.isDeleted) {
        return -1;
    }
    // 2. 요청 바디 부족
    if (!text) {
        return -2;
    }
    let comment;
    // 답글인 경우
    if (parentID) {
        const parentComment = yield Comment_1.default.findById(parentID);
        // 3. 부모 댓글 id 값이 유효하지 않을 경우
        if (!parentComment) {
            return -3;
        }
        comment = new Comment_1.default({
            postModel: "Concert",
            post: concertID,
            userID: userID,
            parentComment: parentID,
            text,
        });
        yield comment.save();
        yield parentComment.childrenComment.push(comment._id);
        yield parentComment.save();
        // 첫 답글 작성 시 뱃지 추가
        const badge = yield Badge_1.default.findOne({ user: userID });
        if (!badge.firstReplyBadge) {
            badge.firstReplyBadge = true;
            yield badge.save();
        }
    }
    else {
        // 댓글인 경우
        comment = new Comment_1.default({
            postModel: "Concert",
            post: concertID,
            userID: userID,
            text,
        });
        yield comment.save();
        yield concert.comments.push(comment._id);
        yield concert.save();
        // 댓글 1개 작성 시 뱃지 추가
        const badge = yield Badge_1.default.findOne({ user: userID });
        if (!badge.oneCommentBadge) {
            badge.oneCommentBadge = true;
            yield badge.save();
        }
        // 댓글 5개 작성 시 뱃지 추가
        const user = yield User_1.default.findById(userID);
        if (!badge.fiveCommentBadge && user.commentCNT === 4) {
            badge.fiveCommentBadge = true;
            yield badge.save();
        }
        // 유저 댓글 수 1 증가
        yield user.update({
            commentCNT: user.commentCNT + 1,
        });
    }
    // 게시글 댓글 수 1 증가
    yield Concert_1.default.findOneAndUpdate({ _id: concertID }, {
        $inc: { commentNum: 1 },
    });
    const user = yield User_1.default.findById(userID);
    return {
        _id: comment._id,
        nickname: user.nickname,
        text: text,
        createdAt: comment.createdAt,
    };
    return;
});
exports.postConcertComment = postConcertComment;
/**
 *  @오투콘서트_좋아요_등록
 *  @route Post /concert/like/:concertID
 *  @error
 *      1. 콘서트 id 잘못됨
 *      2. 이미 좋아요 한 글일 경우
 */
const postConcertLike = (concertID, userID) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. 콘서트 id 잘못됨
    const concert = yield Concert_1.default.findById(concertID);
    if (!concert || concert.isDeleted) {
        return -1;
    }
    const user = yield User_1.default.findById(userID);
    // 2. 이미 좋아요 한 글일 경우
    if (user.likes.concertLikes.includes(concertID)) {
        return -2;
    }
    // 챌린지 글의 like 1 증가
    yield Concert_1.default.findOneAndUpdate({ _id: concertID }, {
        $inc: { likes: 1 },
    });
    // 유저 likes 필드에 챌린지 id 추가
    user.likes.concertLikes.push(concertID);
    yield user.save();
    // 좋아요 1개 누를 시 뱃지 추가
    const badge = yield Badge_1.default.findOne({ user: userID });
    if (!badge.oneLikeBadge) {
        badge.oneLikeBadge = true;
        yield badge.save();
    }
    // 좋아요 5개 누를 시 뱃지 추가
    if (!badge.fiveLikeBadge &&
        user.likes.challengeLikes.length + user.likes.concertLikes.length === 5) {
        badge.fiveLikeBadge = true;
        yield badge.save();
    }
    return { _id: concertID };
});
exports.postConcertLike = postConcertLike;
/**
 *  @오투콘서트_좋아요_삭제
 *  @route Delete /concert/like/:concertID
 *  @error
 *      1. 콘서트 id 잘못됨
 *      2. 좋아요 개수가 0
 */
const deleteConcertLike = (concertID, userID) => __awaiter(void 0, void 0, void 0, function* () {
    const concert = yield Concert_1.default.findById(concertID);
    // 1. 콘서트 id 잘못됨
    if (!concert || concert.isDeleted) {
        return -1;
    }
    // 2. 좋아요 개수가 0
    if (concert.likes === 0) {
        return -2;
    }
    // 콘서트 글의 like 1 감소
    yield Concert_1.default.findOneAndUpdate({ _id: concertID }, {
        $inc: { likes: -1 },
    });
    // 유저 likes 필드에 챌린지 id 삭제
    const user = yield User_1.default.findById(userID);
    const idx = user.likes.concertLikes.indexOf(concertID);
    user.likes.concertLikes.splice(idx, 1);
    yield user.save();
    return { _id: concertID };
});
exports.deleteConcertLike = deleteConcertLike;
/**
 *  @오투콘서트_스크랩하기
 *  @route Post /user/concert/:concertID
 *  @error
 *      1. 콘서트 id 잘못됨
 *      2. 이미 스크랩 한 회고일 경우
 */
const postConcertScrap = (concertID, userID) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. 회고 id 잘못됨
    let concert = yield Concert_1.default.findById(concertID);
    if (!concert || concert.isDeleted) {
        return -1;
    }
    const user = yield User_1.default.findById(userID);
    // 2. 이미 스크랩 한 회고인 경우
    if (user.scraps.concertScraps.includes(concertID)) {
        return -2;
    }
    // 게시글 스크랩 수 1 증가
    yield Concert_1.default.findOneAndUpdate({ _id: concertID }, {
        $inc: { scrapNum: 1 },
    });
    user.scraps.concertScraps.push(concertID);
    yield user.save();
    // 첫 스크랩이면 뱃지 발급
    const badge = yield Badge_1.default.findOne({ user: userID }, { concertScrapBadge: true, _id: false });
    const scrapNum = user.scraps.concertScraps.length;
    if (!badge.concertScrapBadge && scrapNum === 1) {
        yield Badge_1.default.findOneAndUpdate({ user: userID }, { $set: { concertScrapBadge: true } });
    }
    return { _id: concertID };
});
exports.postConcertScrap = postConcertScrap;
/**
 *  @유저_콘서트_스크랩_취소하기
 *  @route Delete /user/concert/:concertID
 *  @error
 *      1. 콘서트 id 잘못됨
 *      2. 스크랩 하지 않은 글일 경우
 */
const deleteConcertScrap = (concertID, userID) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. 콘서트 id 잘못됨
    let concert = yield Concert_1.default.findById(concertID);
    if (!concert || concert.isDeleted) {
        return -1;
    }
    const user = yield User_1.default.findById(userID);
    // 2. 스크랩하지 않은 글일 경우
    if (!user.scraps.concertScraps.includes(concertID)) {
        return -2;
    }
    // 게시글 스크랩 수 1 감소
    yield Concert_1.default.findOneAndUpdate({ _id: concertID }, {
        $inc: { scrapNum: -1 },
    });
    // 유저 likes 필드에 챌린지 id 삭제
    const idx = user.scraps.concertScraps.indexOf(concertID);
    user.scraps.concertScraps.splice(idx, 1);
    yield user.save();
    return { _id: concertID };
});
exports.deleteConcertScrap = deleteConcertScrap;
//# sourceMappingURL=concertService.js.map