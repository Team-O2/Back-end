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
exports.patchPW = exports.patchInfo = exports.getUserInfo = exports.deleteMyComments = exports.getMyComments = exports.getMyWritings = exports.deleteMypageChallenge = exports.getMypageInfo = exports.getMypageChallenge = exports.getMypageConcert = exports.postRegister = void 0;
// models
const Admin_1 = __importDefault(require("../models/Admin"));
const User_1 = __importDefault(require("../models/User"));
const Badge_1 = __importDefault(require("../models/Badge"));
const Concert_1 = __importDefault(require("../models/Concert"));
const Challenge_1 = __importDefault(require("../models/Challenge"));
const Comment_1 = __importDefault(require("../models/Comment"));
// library
const date_1 = require("../library/date");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 *  @User_챌린지_신청하기
 *  @route Post user/register
 *  @body challengeCNT
 *  @access private
 */
const postRegister = (userID, body) => __awaiter(void 0, void 0, void 0, function* () {
    const challengeCNT = body.challengeCNT;
    // 1. 요청 바디 부족
    if (!challengeCNT) {
        return -1;
    }
    // 2. 유저 id가 관리자 아이디임
    let user = yield User_1.default.findById(userID);
    if (user.userType === 1) {
        return -2;
    }
    // 신청 기간을 확인
    let dateNow = new Date();
    const admin = yield Admin_1.default.findOne({
        $and: [
            { registerStartDT: { $lte: dateNow } },
            { registerEndDT: { $gte: dateNow } },
        ],
    });
    // 3. 신청 기간이 아님
    if (!admin) {
        return -3;
    }
    // 4. 이미 신청이 완료된 사용자
    if (user.isRegist) {
        return -4;
    }
    // 5. 신청 인원을 초과함
    if (admin.applyNum > admin.limitNum) {
        return -5;
    }
    // 신청 성공
    // applyNum 증가
    yield Admin_1.default.findOneAndUpdate({
        $and: [
            { registerStartDT: { $lte: dateNow } },
            { registerEndDT: { $gte: dateNow } },
        ],
    }, {
        $inc: { applyNum: 1 },
    });
    // isRegist true
    yield user.update({ $set: { isRegist: true } });
    yield user.update({ $set: { challengeCNT: challengeCNT } });
    // 첫 챌린지 참여 시 뱃지 부여
    const badge = yield Badge_1.default.findOne({ user: userID }, { firstJoinBadge: true, _id: false });
    if (!badge.firstJoinBadge) {
        yield Badge_1.default.findOneAndUpdate({ user: userID }, { $set: { firstJoinBadge: true } });
    }
});
exports.postRegister = postRegister;
/**
 *  @User_마이페이지_콘서트_스크랩
 *  @route Post user/mypage/concert
 *  @access private
 */
const getMypageConcert = (userID, offset, limit) => __awaiter(void 0, void 0, void 0, function* () {
    if (!offset) {
        offset = 0;
    }
    const userScraps = yield (yield User_1.default.findOne({ _id: userID })).scraps.concertScraps;
    if (!userScraps[0]) {
        return -1;
    }
    if (!limit) {
        return -2;
    }
    const concertList = yield Promise.all(userScraps.map(function (scrap) {
        return __awaiter(this, void 0, void 0, function* () {
            let concertScrap = yield Concert_1.default.find({ _id: scrap }, { isDeleted: false })
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
            return concertScrap;
        });
    }));
    const mypageConcert = concertList.sort(function (a, b) {
        return date_1.dateToNumber(b[0].createdAt) - date_1.dateToNumber(a[0].createdAt);
    });
    var mypageConcertScrap = [];
    for (var i = Number(offset); i < Number(offset) + Number(limit); i++) {
        const tmp = mypageConcert[i];
        if (!tmp) {
            break;
        }
        mypageConcertScrap.push(tmp[0]);
    }
    return {
        mypageConcertScrap,
        totalScrapNum: mypageConcert.length,
    };
});
exports.getMypageConcert = getMypageConcert;
/**
 *  @User_마이페이지_회고_스크랩
 *  @route Post user/mypage/challenge
 *  @access private
 */
const getMypageChallenge = (userID, offset, limit) => __awaiter(void 0, void 0, void 0, function* () {
    if (!offset) {
        offset = 0;
    }
    const userScraps = yield (yield User_1.default.findOne({ _id: userID })).scraps.challengeScraps;
    if (!userScraps[0]) {
        return -1;
    }
    if (!limit) {
        return -2;
    }
    const challengeList = yield Promise.all(userScraps.map(function (scrap) {
        return __awaiter(this, void 0, void 0, function* () {
            let challengeScrap = yield Challenge_1.default.find({ _id: scrap }, { isDeleted: false })
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
            return challengeScrap;
        });
    }));
    const mypageChallenge = challengeList.sort(function (a, b) {
        return date_1.dateToNumber(b[0].createdAt) - date_1.dateToNumber(a[0].createdAt);
    });
    var mypageChallengeScrap = [];
    for (var i = Number(offset); i < Number(offset) + Number(limit); i++) {
        const tmp = mypageChallenge[i];
        if (!tmp) {
            break;
        }
        mypageChallengeScrap.push(tmp[0]);
    }
    return {
        mypageChallengeScrap,
        totalScrapNum: mypageChallenge.length,
    };
});
exports.getMypageChallenge = getMypageChallenge;
/**
 *  @User_마이페이지_Info
 *  @route Get user/mypage/info
 *  @access private
 */
const getMypageInfo = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(userID);
    const userBadge = yield Badge_1.default.findOne({ user: userID });
    const couponBook = {
        welcomeBadge: userBadge.welcomeBadge,
        firstJoinBadge: userBadge.firstJoinBadge,
        firstWriteBadge: userBadge.firstWriteBadge,
        oneCommentBadge: userBadge.oneCommentBadge,
        fiveCommentBadge: userBadge.fiveCommentBadge,
        oneLikeBadge: userBadge.oneLikeBadge,
        fiveLikeBadge: userBadge.fiveLikeBadge,
        loginBadge: userBadge.loginBadge,
        marketingBadge: userBadge.marketingBadge,
        learnMySelfScrapBadge: userBadge.learnMySelfScrapBadge,
        firstReplyBadge: userBadge.firstReplyBadge,
        concertScrapBadge: userBadge.concertScrapBadge,
        challengeBadge: userBadge.challengeBadge,
    };
    var shareTogether = yield Concert_1.default.find({ user: userID, isNotice: false }, { _id: true, title: true }, { sort: { _id: -1 } }).limit(5);
    if (shareTogether.length === 0) {
        shareTogether = null;
    }
    // 현재 작성 완료 개수
    // const userRM = await Challenge.find(
    //   { user: userID },
    //   { generation: user.generation }
    // ).countDocuments();
    const admin = yield Admin_1.default.findOne({ generation: user.generation });
    // ischallenge 가 false 이거나 admin === null 이면 현재기수 참여 x
    if (!user.isChallenge || !admin) {
        return {
            nickname: user.nickname,
            learnMyselfAchieve: null,
            shareTogether,
            couponBook,
        };
    }
    // 현재기수 참여
    else {
        var term = yield date_1.period(admin.challengeStartDT, admin.challengeEndDT);
        if (term < 1) {
            term = 1;
        }
        // 내림을 취해서 최대한 많은 %를 달성할 수 있도록 한다
        var totalNum = user.conditionCNT * Math.floor(term / 7);
        if (totalNum < 1) {
            totalNum = 1;
        }
        // 퍼센트 올림을 취함
        var percent = Math.ceil((user.writingCNT / totalNum) * 100);
        if (percent > 100) {
            percent = 100;
        }
        const learnMyselfAchieve = {
            percent,
            totalNum,
            completeNum: user.writingCNT,
            startDT: admin.challengeStartDT,
            endDT: admin.challengeEndDT,
        };
        return {
            nickname: user.nickname,
            learnMyselfAchieve,
            shareTogether,
            couponBook,
        };
    }
});
exports.getMypageInfo = getMypageInfo;
/**
 *  @User_마이페이지_회고_스크랩_취소토글
 *  @route Delete user/mypage/challenge/:challengeID
 *  @access private
 */
const deleteMypageChallenge = (userID, challengeID) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. 회고 id 잘못됨
    let challenge = yield Challenge_1.default.findById(challengeID);
    if (!challenge) {
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
    return { _id: challengeID };
});
exports.deleteMypageChallenge = deleteMypageChallenge;
/**
 *  @마이페이지_내가_쓴_글
 *  @route Get user/mypage/write
 *  @error
 *    1.
 */
const getMyWritings = (userID, offset, limit) => __awaiter(void 0, void 0, void 0, function* () {
    if (!limit) {
        return -1;
    }
    if (!offset) {
        offset = 0;
    }
    let challenges;
    challenges = yield Challenge_1.default.find({
        isDeleted: false,
        user: userID,
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
    return challenges;
});
exports.getMyWritings = getMyWritings;
/**
 *  @마이페이지_내가_쓴_댓글
 *  @route Get user/mypage/comment
 */
const getMyComments = (userID, offset, limit) => __awaiter(void 0, void 0, void 0, function* () {
    if (!limit) {
        return -1;
    }
    if (!offset) {
        offset = 0;
    }
    let comments;
    comments = yield Comment_1.default.find({
        isDeleted: false,
        userID,
    })
        .skip(Number(offset))
        .limit(Number(limit))
        .sort({ _id: -1 });
    const user = yield User_1.default.findById(userID);
    const totalCommentNum = yield Comment_1.default.find({
        userID,
        isDeleted: false,
    }).count();
    return {
        comments,
        commentNum: totalCommentNum,
    };
});
exports.getMyComments = getMyComments;
/**
 *  @마이페이지_내가_쓴_댓글_삭제
 *  @route Delete user/mypage/comment
 *  @error
 *    1. 요청 바디가 부족할 경우
 */
const deleteMyComments = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { userID, commentID } = body;
    //1. 요청 바디가 부족할 경우
    if (!commentID || commentID.length === 0) {
        return -1;
    }
    commentID.map((cmtID) => __awaiter(void 0, void 0, void 0, function* () {
        // 삭제하려는 댓글 isDelete = true로 변경
        yield Comment_1.default.findOneAndUpdate({
            _id: cmtID,
            userID: userID.id,
        }, { isDeleted: true });
        // 게시글 댓글 수 1 감소
        let comment = yield Comment_1.default.findById(cmtID);
        if (comment.postModel === "Challenge") {
            // challenge
            yield Challenge_1.default.findOneAndUpdate({
                _id: comment.post,
            }, { $inc: { commentNum: -1 } });
        }
        else {
            // concert
            yield Concert_1.default.findOneAndUpdate({
                _id: comment.post,
            }, { $inc: { commentNum: -1 } });
        }
        // 유저 댓글 수 1 감소
        // 과연 필요할까??
        yield User_1.default.findOneAndUpdate({
            _id: userID.id,
        }, {
            $inc: { commentCNT: -1 },
        });
    }));
});
exports.deleteMyComments = deleteMyComments;
/**
 *  @마이페이지_회원정보_조회
 *  @route Get user/userInfo
 *  @access private
 */
const getUserInfo = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.find({ _id: userID }, {
        img: true,
        email: true,
        nickname: true,
        interest: true,
        gender: true,
        marpolicy: true,
    });
    return user[0];
});
exports.getUserInfo = getUserInfo;
/**
 *  @마이페이지_회원정보_수정
 *  @route Patch user/userInfo
 *  @access private
 */
const patchInfo = (userID, body, url) => __awaiter(void 0, void 0, void 0, function* () {
    const imgUrl = url.img;
    const { nickname, gender, marpolicy } = body;
    const interest = body.interest.slice(1, -1).replace(/"/gi, "").split(/,\s?/);
    // 1. 요청 바디 부족
    if (!nickname || !interest || !gender || !marpolicy) {
        return -1;
    }
    const user = yield User_1.default.findById(userID);
    yield user.update({ $set: { img: imgUrl } });
    yield user.update({ $set: { nickname: nickname } });
    yield user.update({ $set: { interest: interest } });
    yield user.update({ $set: { gender: gender } });
    yield user.update({ $set: { marpolicy: marpolicy } });
    // 마케팅 동의(marpolicy == true) 시 뱃지 발급
    if (marpolicy) {
        yield Badge_1.default.findOneAndUpdate({ user: user.id }, { $set: { marketingBadge: true } });
    }
});
exports.patchInfo = patchInfo;
/**
 *  @마이페이지_비밀번호_수정
 *  @route Patch user/pw
 *  @access private
 */
const patchPW = (userID, body) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, newPassword } = body;
    // 1. 요청 바디 부족
    if (!newPassword) {
        return -1;
    }
    const user = yield User_1.default.findById(userID);
    // Encrpyt password
    const salt = yield bcryptjs_1.default.genSalt(10);
    const currentEncrpytPW = yield bcryptjs_1.default.hash(password, salt);
    // 2. 현재 비밀번호가 일치하지 않음
    const isMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        return -2;
    }
    // Encrpyt password
    const encrpytPW = yield bcryptjs_1.default.hash(newPassword, salt);
    yield user.update({ $set: { password: encrpytPW } });
});
exports.patchPW = patchPW;
//# sourceMappingURL=userService.js.map