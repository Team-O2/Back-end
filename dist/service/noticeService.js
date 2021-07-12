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
exports.postNoticeComment = exports.getNoticeSearch = exports.getNoticeOne = exports.getNoticeAll = void 0;
// models
const Concert_1 = __importDefault(require("src/models/Concert"));
const User_1 = __importDefault(require("src/models/User"));
const Badge_1 = __importDefault(require("src/models/Badge"));
const Comment_1 = __importDefault(require("src/models/Comment"));
/**
 *  @공지사항_전체_가져오기
 *  @route Get /notice
 */
const getNoticeAll = (offset) => __awaiter(void 0, void 0, void 0, function* () {
    // isDelete = true 인 애들만 가져오기
    // offset 뒤에서 부터 가져오기
    // 최신순으로 정렬
    // 댓글, 답글 populate
    // 댓글, 답글 최신순으로 정렬
    let notices;
    if (offset) {
        notices = yield Concert_1.default.find({
            isDeleted: false,
            isNotice: true,
            _id: { $lt: offset },
        })
            .limit(Number(process.env.PAGE_SIZE))
            .sort({ _id: -1 })
            .populate("user", ["nickname"])
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
                        select: ["nickname"],
                    },
                },
                {
                    path: "userID",
                    select: ["nickname"],
                },
            ],
        });
    }
    else {
        notices = yield Concert_1.default.find({ isDeleted: false, isNotice: true })
            .limit(Number(process.env.PAGE_SIZE))
            .sort({ _id: -1 })
            .populate("user", ["nickname"])
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
                        select: ["nickname"],
                    },
                },
                {
                    path: "userID",
                    select: ["nickname"],
                },
            ],
        });
    }
    return { notices, totalNoticeNum: notices.length };
});
exports.getNoticeAll = getNoticeAll;
/**
 *  @공지사항_Detail
 *  @route Get /notice/:noticeID
 */
const getNoticeOne = (noticeID) => __awaiter(void 0, void 0, void 0, function* () {
    // 댓글, 답글 populate
    // isDelete = true 인 애들만 가져오기
    // isNotice: true
    const notice = yield Concert_1.default.find({ _id: noticeID }, { isDeleted: false })
        .populate("user", ["nickname"])
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
                    select: ["nickname"],
                },
            },
            {
                path: "userID",
                select: ["nickname"],
            },
        ],
    });
    return notice;
});
exports.getNoticeOne = getNoticeOne;
/**
 *  @공지사항_검색_또는_필터
 *  @route Get /notice/search?keyword=검색할단어
 */
const getNoticeSearch = (keyword, offset) => __awaiter(void 0, void 0, void 0, function* () {
    // isDelete = true 인 애들만 가져오기
    // isNotice: true
    // offset 뒤에서 부터 가져오기
    // 최신순으로 정렬
    // 댓글, 답글 populate
    let notices;
    if (offset) {
        notices = yield Concert_1.default.find({
            isDeleted: false,
            isNotice: true,
            _id: { $lt: offset },
        })
            .limit(Number(process.env.PAGE_SIZE))
            .sort({ _id: -1 })
            .populate("user", ["nickname"])
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
                        select: ["nickname"],
                    },
                },
                {
                    path: "userID",
                    select: ["nickname"],
                },
            ],
        });
    }
    else {
        notices = yield Concert_1.default.find({ isDeleted: false, isNotice: true })
            .limit(Number(process.env.PAGE_SIZE))
            .sort({ _id: -1 })
            .populate("user", ["nickname"])
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
                        select: ["nickname"],
                    },
                },
                {
                    path: "userID",
                    select: ["nickname"],
                },
            ],
        });
    }
    let filteredData = notices;
    // 검색 단어 필터링
    if (keyword !== "") {
        filteredData = filteredData.filter((fd) => {
            if (fd.text.includes(keyword.toLowerCase().trim()) ||
                fd.title.includes(keyword.toLowerCase().trim()) ||
                fd.hashtag.includes(keyword.toLowerCase().trim()) ||
                fd.interest.includes(keyword.toLowerCase().trim()))
                return fd;
        });
    }
    return filteredData;
});
exports.getNoticeSearch = getNoticeSearch;
/**
 *  @공지사항_댓글_등록
 *  @route POST /notice/comment/:noticeID
 *  @error
 *      1. 공지사항 id 잘못됨
 *      2. 요청 바디 부족
 *      3. 부모 댓글 id 값이 유효하지 않을 경우
 */
const postNoticeComment = (noticeID, userID, body) => __awaiter(void 0, void 0, void 0, function* () {
    const { parentID, text } = body;
    // 1. 공지사항 id 잘못됨
    const notice = yield Concert_1.default.findById(noticeID);
    if (!notice || notice.isDeleted) {
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
            post: noticeID,
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
            post: noticeID,
            userID: userID,
            text,
        });
        yield comment.save();
        notice.comments.push(comment._id);
        yield notice.save();
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
    yield Concert_1.default.findOneAndUpdate({ _id: noticeID }, {
        $inc: { commentNum: 1 },
    });
    const user = yield User_1.default.findById(userID);
    return {
        _id: comment._id,
        nickname: user.nickname,
        text: text,
        createdAt: comment.createdAt,
    };
});
exports.postNoticeComment = postNoticeComment;
//# sourceMappingURL=noticeService.js.map