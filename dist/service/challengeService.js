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
exports.deleteChallengeScrap = exports.postChallengeScrap = exports.deleteChallengeLike = exports.postChallengeLike = exports.postChallengeComment = exports.deleteChallenge = exports.patchChallenge = exports.postChallenge = exports.getChallengeSearch = exports.getChallengeOne = exports.getChallengeAll = void 0;
// models
const Challenge_1 = __importDefault(require("../models/Challenge"));
const User_1 = __importDefault(require("../models/User"));
const Comment_1 = __importDefault(require("../models/Comment"));
const Badge_1 = __importDefault(require("../models/Badge"));
/**
 *  @챌린지_회고_전체_가져오기
 *  @route Get /challenge
 */
const getChallengeAll = (userID, offset, limit) => __awaiter(void 0, void 0, void 0, function* () {
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
    let challenge;
    challenge = yield Challenge_1.default.find({
        isDeleted: false,
    })
        .skip(Number(offset))
        .limit(Number(limit))
        .sort({ _id: -1 })
        .populate("user", ["nickname", "img"])
        .populate({
        path: "comments",
        select: ["userID", "text", "isDeleted"],
        options: { sort: { _id: -1 } },
        populate: [
            {
                path: "childrenComment",
                select: ["userID", "text", "isDeleted"],
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
    var resData;
    if (userID) {
        // 좋아요, 스크랩 여부 추가
        const user = yield User_1.default.findById(userID.id);
        const newChallenge = challenge.map((c) => {
            if (user.scraps.challengeScraps.includes(c._id) &&
                user.likes.challengeLikes.includes(c._id)) {
                return Object.assign(Object.assign({}, c._doc), { isLike: true, isScrap: true });
            }
            else if (user.scraps.challengeScraps.includes(c._id)) {
                return Object.assign(Object.assign({}, c._doc), { isLike: false, isScrap: true });
            }
            else if (user.likes.challengeLikes.includes(c._id)) {
                return Object.assign(Object.assign({}, c._doc), { isLike: true, isScrap: false });
            }
            else {
                return Object.assign(Object.assign({}, c._doc), { isLike: false, isScrap: false });
            }
        });
        resData = newChallenge;
    }
    else {
        resData = challenge;
    }
    return resData;
});
exports.getChallengeAll = getChallengeAll;
/**
 *  @챌린지_Detail
 *  @route Get /challenge/:challengeID
 */
const getChallengeOne = (userID, challengeID) => __awaiter(void 0, void 0, void 0, function* () {
    // 댓글, 답글 populate
    // isDelete = true 인 애들만 가져오기
    let challenge;
    challenge = yield Challenge_1.default.findById(challengeID)
        .populate("user", ["nickname", "img"])
        .populate({
        path: "comments",
        select: ["userID", "text", "isDeleted"],
        options: { sort: { _id: -1 } },
        populate: [
            {
                path: "childrenComment",
                select: ["userID", "text", "isDeleted"],
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
    // challenge ID가 잘못되었을 때
    if (!challenge) {
        return -1;
    }
    let resData;
    if (userID) {
        // 좋아요, 스크랩 여부 추가
        const user = yield User_1.default.findById(userID.id);
        if (user.scraps.challengeScraps.includes(challengeID) &&
            user.likes.challengeLikes.includes(challengeID)) {
            resData = Object.assign(Object.assign({}, challenge._doc), { isLike: true, isScrap: true });
        }
        else if (user.scraps.challengeScraps.includes(challengeID)) {
            resData = Object.assign(Object.assign({}, challenge._doc), { isLike: false, isScrap: true });
        }
        else if (user.likes.challengeLikes.includes(challengeID)) {
            resData = Object.assign(Object.assign({}, challenge._doc), { isLike: true, isScrap: false });
        }
        else {
            resData = Object.assign(Object.assign({}, challenge._doc), { isLike: false, isScrap: false });
        }
    }
    else {
        resData = challenge;
    }
    return resData;
});
exports.getChallengeOne = getChallengeOne;
/**
 *  @챌린지_회고_검색_또는_필터
 *  @route Get /challenge/search
 */
const getChallengeSearch = (tag, isMine, keyword, offset, limit, userID) => __awaiter(void 0, void 0, void 0, function* () {
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
    let challenges;
    challenges = yield Challenge_1.default.find({
        isDeleted: false,
    })
        .sort({ _id: -1 })
        .populate("user", ["nickname", "img"])
        .populate({
        path: "comments",
        select: ["userID", "text", "isDeleted"],
        options: { sort: { _id: -1 } },
        populate: [
            {
                path: "childrenComment",
                select: ["userID", "text", "isDeleted"],
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
    let filteredData = challenges;
    // 관심분야 필터링
    if (tag !== "" && tag) {
        filteredData = filteredData.filter((fd) => {
            if (fd.interest.includes(tag.toLowerCase()))
                return fd;
        });
    }
    if (userID) {
        // 내가 쓴 글 필터링
        if (isMine === "1" && isMine) {
            filteredData = filteredData.filter((fd) => {
                if (String(fd.user._id) === String(userID.id))
                    return fd;
            });
        }
    }
    // 검색 단어 필터링
    if (keyword !== "" && keyword) {
        filteredData = filteredData.filter((fd) => {
            if (fd.good.includes(keyword.toLowerCase().trim()) ||
                fd.bad.includes(keyword.toLowerCase().trim()) ||
                fd.learn.includes(keyword.toLowerCase().trim()))
                return fd;
        });
    }
    var searchData = [];
    for (var i = Number(offset); i < Number(offset) + Number(limit); i++) {
        if (!filteredData[i]) {
            break;
        }
        searchData.push(filteredData[i]);
    }
    var resData;
    if (userID) {
        // 좋아요, 스크랩 여부 추가
        const user = yield User_1.default.findById(userID.id);
        const newChallenge = searchData.map((c) => {
            // console.log(c);
            if (user.scraps.challengeScraps.includes(c._id) &&
                user.likes.challengeLikes.includes(c._id)) {
                return Object.assign(Object.assign({}, c._doc), { isLike: true, isScrap: true });
            }
            else if (user.scraps.challengeScraps.includes(c._id)) {
                return Object.assign(Object.assign({}, c._doc), { isLike: false, isScrap: true });
            }
            else if (user.likes.challengeLikes.includes(c._id)) {
                return Object.assign(Object.assign({}, c._doc), { isLike: true, isScrap: false });
            }
            else {
                return Object.assign(Object.assign({}, c._doc), { isLike: false, isScrap: false });
            }
        });
        resData = newChallenge;
    }
    else {
        resData = searchData;
    }
    return resData;
});
exports.getChallengeSearch = getChallengeSearch;
/**
 *  @챌린지_회고_등록
 *  @route Post api/challenge/:userId
 *  @body author, good, bad, learn, interest, generation
 *  @error
 *      1. 요청 바디 부족
 *      2. 유저 id 잘못됨
 */
const postChallenge = (userID, reqData) => __awaiter(void 0, void 0, void 0, function* () {
    const { good, bad, learn, interest } = reqData;
    // 1. 요청 바디 부족
    if (!good || !bad || !learn || !interest) {
        return -1;
    }
    // 2. 유저 id 잘못됨
    const user = yield User_1.default.findById(userID);
    if (!user) {
        return -2;
    }
    const challenge = new Challenge_1.default({
        user: userID,
        good: good.toLowerCase(),
        bad: bad.toLowerCase(),
        learn: learn.toLowerCase(),
        interest: interest.map((it) => it.toLowerCase()),
        generation: user.generation,
    });
    yield challenge.save();
    // 유저의 writingCNT 증가
    yield user.update({
        $inc: { writingCNT: 1 },
    });
    // 첫 챌린지 회고 작성 시 배지 추가
    const badge = yield Badge_1.default.findOne({ user: userID });
    if (!badge.firstWriteBadge) {
        badge.firstWriteBadge = true;
        yield badge.save();
    }
    const data = Challenge_1.default.findById(challenge._id).populate("user", [
        "nickname",
        "img",
    ]);
    return data;
});
exports.postChallenge = postChallenge;
/**
 *  @챌린지_회고_수정
 *  @route PATCH api/challenge/:challengeId
 *  @body good, bad, learn
 *  @error
 *      1. 회고록 id 잘못됨
 *      2. 요청 바디 부족
 */
const patchChallenge = (challengeID, reqData) => __awaiter(void 0, void 0, void 0, function* () {
    const { good, bad, learn, interest } = reqData;
    // 1. 회고록 id 잘못됨
    const challenge = yield Challenge_1.default.findById(challengeID);
    if (!challenge || challenge.isDeleted) {
        return -1;
    }
    // 2. 요청 바디 부족
    if (!good || !bad || !learn || !interest) {
        return -2;
    }
    const updateDate = new Date();
    yield Challenge_1.default.update({ _id: challengeID }, {
        good: good.toLowerCase(),
        bad: bad.toLowerCase(),
        learn: learn.toLowerCase(),
        interest: interest,
        updatedAt: updateDate,
    });
});
exports.patchChallenge = patchChallenge;
/**
 *  @챌린지_회고_삭제
 *  @route DELETE api/challenge/:challengeId
 *  @error
 *      1. 회고록 id 잘못됨
 */
const deleteChallenge = (userID, challengeID) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. 회고록 id 잘못됨
    const challenge = yield Challenge_1.default.findById(challengeID);
    if (!challenge || challenge.isDeleted) {
        return -1;
    }
    yield Challenge_1.default.findByIdAndUpdate({ _id: challengeID }, { $set: { isDeleted: true } });
    // 유저의 writingCNT 감소
    yield User_1.default.findOneAndUpdate({ _id: userID }, {
        $inc: { writingCNT: 1 },
    });
    return { _id: challenge._id };
});
exports.deleteChallenge = deleteChallenge;
/**
 *  @챌린지_회고_댓글_등록
 *  @route POST /challenge/comment/:challengeID
 *  @error
 *      1. 회고록 id 잘못됨
 *      2. 요청 바디 부족
 *      3. 부모 댓글 id 값이 유효하지 않을 경우
 */
const postChallengeComment = (challengeID, userID, reqData) => __awaiter(void 0, void 0, void 0, function* () {
    const { parentID, text } = reqData;
    // 1. 회고록 id 잘못됨
    const challenge = yield Challenge_1.default.findById(challengeID);
    if (!challenge || challenge.isDeleted) {
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
            postModel: "Challenge",
            post: challengeID,
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
            postModel: "Challenge",
            post: challengeID,
            userID: userID,
            text,
        });
        yield comment.save();
        challenge.comments.push(comment._id);
        yield challenge.save();
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
    yield Challenge_1.default.findOneAndUpdate({ _id: challengeID }, {
        $inc: { commentNum: 1 },
    });
    const user = yield User_1.default.findById(userID);
    return {
        _id: comment._id,
        nickname: user.nickname,
        text: text,
        img: user.img,
        createdAt: comment.createdAt,
    };
    return;
});
exports.postChallengeComment = postChallengeComment;
/**
 *  @챌린지_회고_좋아요_등록
 *  @route POST /challenge/like/:challengeID
 *  @error
 *      1. 회고록 id 잘못됨
 *      2. 이미 좋아요 한 글일 경우
 */
const postChallengeLike = (challengeID, userID) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. 회고록 id 잘못됨
    const challenge = yield Challenge_1.default.findById(challengeID);
    if (!challenge || challenge.isDeleted) {
        return -1;
    }
    const user = yield User_1.default.findById(userID);
    // 2. 이미 좋아요 한 글일 경우
    if (user.likes.challengeLikes.includes(challengeID)) {
        return -2;
    }
    // 챌린지 글의 like 1 증가
    yield Challenge_1.default.findOneAndUpdate({ _id: challengeID }, {
        $inc: { likes: 1 },
    });
    // 유저 likes 필드에 챌린지 id 추가
    user.likes.challengeLikes.push(challengeID);
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
    return { _id: challengeID };
});
exports.postChallengeLike = postChallengeLike;
/**
 *  @챌린지_회고_좋아요_삭제
 *  @route DELETE /challenge/like/:challengeID
 *  @error
 *      1. 회고록 id 잘못됨
 *      2. 좋아요 개수가 0
 */
const deleteChallengeLike = (challengeID, userID) => __awaiter(void 0, void 0, void 0, function* () {
    const challenge = yield Challenge_1.default.findById(challengeID);
    // 1. 회고록 id 잘못됨
    if (!challenge || challenge.isDeleted) {
        return -1;
    }
    // 2. 좋아요 개수가 0
    if (challenge.likes === 0) {
        return -2;
    }
    // 챌린지 글의 like 1 감소
    yield Challenge_1.default.findOneAndUpdate({ _id: challengeID }, {
        $inc: { likes: -1 },
    });
    // 유저 likes 필드에 챌린지 id 삭제
    const user = yield User_1.default.findById(userID);
    const idx = user.likes.challengeLikes.indexOf(challengeID);
    user.likes.challengeLikes.splice(idx, 1);
    yield user.save();
    return { _id: challengeID };
});
exports.deleteChallengeLike = deleteChallengeLike;
/**
 *  @유저_챌린지_회고_스크랩하기
 *  @route Post /user/challenge/:challengeID
 *  @error
 *      1. 회고록 id 잘못됨
 *      2. 이미 스크랩 한 회고일 경우
 */
const postChallengeScrap = (challengeID, userID) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. 회고 id 잘못됨
    let challenge = yield Challenge_1.default.findById(challengeID);
    if (!challenge || challenge.isDeleted) {
        return -1;
    }
    const user = yield User_1.default.findById(userID);
    // 2. 이미 스크랩 한 회고인 경우
    if (user.scraps.challengeScraps.includes(challengeID)) {
        return -2;
    }
    user.scraps.challengeScraps.push(challengeID);
    yield user.save();
    // 게시글 스크랩 수 1 증가
    yield Challenge_1.default.findOneAndUpdate({ _id: challengeID }, {
        $inc: { scrapNum: 1 },
    });
    // 게시글 첫 스크랩 시 배지 추가
    const badge = yield Badge_1.default.findOne({ user: userID });
    if (!badge.learnMySelfScrapBadge) {
        badge.learnMySelfScrapBadge = true;
        yield badge.save();
    }
    return { _id: challengeID };
});
exports.postChallengeScrap = postChallengeScrap;
/**
 *  @유저_챌린지_회고_스크랩_취소하기
 *  @route Delete /user/challenge/:challengeID
 *  @error
 *      1. 회고록 id 잘못됨
 *      2. 스크랩 하지 않은 글일 경우
 */
const deleteChallengeScrap = (challengeID, userID) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. 회고 id 잘못됨
    let challenge = yield Challenge_1.default.findById(challengeID);
    if (!challenge || challenge.isDeleted) {
        return -1;
    }
    const user = yield User_1.default.findById(userID);
    // 2. 스크랩하지 않은 글일 경우
    if (!user.scraps.challengeScraps.includes(challengeID)) {
        return -2;
    }
    // 유저 scraps 필드에 챌린지 id 삭제
    const idx = user.scraps.challengeScraps.indexOf(challengeID);
    user.scraps.challengeScraps.splice(idx, 1);
    yield user.save();
    // 게시글 스크랩 수 1 감소
    yield Challenge_1.default.findOneAndUpdate({ _id: challengeID }, {
        $inc: { scrapNum: -1 },
    });
    return { _id: challengeID };
});
exports.deleteChallengeScrap = deleteChallengeScrap;
//# sourceMappingURL=challengeService.js.map