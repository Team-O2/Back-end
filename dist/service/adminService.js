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
exports.postAdminNotice = exports.postAdminConcert = exports.getAdminRegist = exports.postAdminChallenge = exports.postAdminList = void 0;
// models
const Admin_1 = __importDefault(require("../models/Admin"));
const User_1 = __importDefault(require("../models/User"));
const Concert_1 = __importDefault(require("../models/Concert"));
// library
const date_1 = require("../library/date");
const Challenge_1 = __importDefault(require("../models/Challenge"));
/**
 *  @관리자_페이지_조회
 *  @route Get admin
 *  @body
 *  @error
 *      1. 유저 id가 관리자가 아님
 */
const postAdminList = (userID, offset, limit) => __awaiter(void 0, void 0, void 0, function* () {
    if (!offset) {
        offset = 0;
    }
    if (!limit) {
        return -1;
    }
    // 1. 유저 id가 관리자가 아님
    let user = yield User_1.default.findById(userID);
    if (!(user.userType === 1)) {
        return -2;
    }
    const admins = yield Admin_1.default.find({}, {
        _id: false,
        title: false,
        limitNum: false,
        __v: false,
    }).sort({ generation: -1 });
    const adminList = yield Promise.all(admins.map(function (admin) {
        return __awaiter(this, void 0, void 0, function* () {
            let totalNum = yield Challenge_1.default.aggregate([
                {
                    $match: { generation: admin.generation },
                },
                {
                    $group: {
                        _id: "$user",
                        // 참여 인원
                        total: { $sum: 1 },
                    },
                },
                { $project: { _id: 0 } },
            ]);
            let participants = 0;
            if (totalNum[0]) {
                participants = totalNum[0]["total"];
            }
            const admintemp = {
                registerStartDT: admin.registerStartDT,
                registerEndDT: admin.registerEndDT,
                challengeStartDT: admin.challengeStartDT,
                challengeEndDT: admin.challengeEndDT,
                generation: admin.generation,
                createdDT: admin.createdDT,
                // 신청 인원
                applyNum: admin.applyNum,
                // 참여 인원
                participants,
                postNum: yield Challenge_1.default.find({ generation: admin.generation }).count(),
                img: admin.img,
            };
            return admintemp;
        });
    }));
    var offsetAdmin = [];
    for (var i = Number(offset); i < Number(offset) + Number(limit); i++) {
        offsetAdmin.push(adminList[i]);
    }
    const resData = {
        offsetAdmin,
        totalAdminNum: adminList.length,
    };
    return resData;
});
exports.postAdminList = postAdminList;
/**
 *  @관리자_챌린지_등록
 *  @route Post admin/challenge
 *  @body registerStartDT, registerEndDT, challengeStartDT, challengeEndDT, limitNum, img
 *  @error
 *      1. 요청 바디 부족
 *      2. 유저 id가 관리자가 아님
 *      3. 챌린지 기간이 잘못됨
 */
const postAdminChallenge = (userID, reqData, url) => __awaiter(void 0, void 0, void 0, function* () {
    const img = url.img;
    const { title, registerStartDT, registerEndDT, challengeStartDT, challengeEndDT, limitNum, } = reqData;
    // 1. 요청 바디 부족
    if (!title ||
        !registerStartDT ||
        !registerEndDT ||
        !challengeStartDT ||
        !challengeEndDT ||
        !limitNum) {
        return -1;
    }
    // 2. 유저 id가 관리자가 아님
    let user = yield User_1.default.findById(userID);
    if (!(user.userType === 1)) {
        return -2;
    }
    /*
      var = new Date('2020-10-23');
      var date2 = new Date('2020-10-22');
  
      console.log(date1 > date2); // true
    */
    //기수 증가
    const changeGen = (yield Admin_1.default.find().count()) + 1;
    const admin = new Admin_1.default({
        title,
        registerStartDT: date_1.stringToDate(registerStartDT),
        registerEndDT: date_1.stringToDate(registerEndDT),
        challengeStartDT: date_1.stringToDate(challengeStartDT),
        challengeEndDT: date_1.stringToDate(challengeEndDT),
        generation: changeGen,
        limitNum,
        img,
        createdAt: new Date(),
    });
    // 3. 챌린지 기간이 잘못됨
    // 신청 마감날짜가 신청 시작 날짜보다 빠름
    if (registerEndDT < registerStartDT) {
        return -3;
    }
    // 챌린지 끝나는 날짜가 챌린지 시작하는 날짜보다 빠름
    else if (challengeEndDT < challengeStartDT) {
        return -3;
    }
    // 챌린지가 시작하는 날짜가 신청 마감 날짜보다 빠름
    else if (challengeStartDT < registerEndDT) {
        return -3;
    }
    yield admin.save();
    return;
});
exports.postAdminChallenge = postAdminChallenge;
/**
 *  @관리자_챌린지_신청페이지
 *  @route Get admin/regist
 *  @access private
 */
const getAdminRegist = () => __awaiter(void 0, void 0, void 0, function* () {
    // 신청 기간을 확인 현재 진행중인 기수를 가져옴
    let dateNow = new Date();
    const admin = yield Admin_1.default.findOne({
        $and: [
            { registerStartDT: { $lte: dateNow } },
            { registerEndDT: { $gte: dateNow } },
        ],
    });
    // 현재 진행중인 기수가 없음
    if (!admin) {
        return -1;
    }
    const resData = {
        img: admin.img,
        title: admin.title,
        registerStartDT: admin.registerStartDT,
        registerEndDT: admin.registerEndDT,
        challengeStartDT: admin.challengeStartDT,
        challengeEndDT: admin.challengeEndDT,
        generation: admin.generation,
    };
    return resData;
});
exports.getAdminRegist = getAdminRegist;
/**
 *  @관리자_오투콘서트_등록
 *  @route Post admin/concert
 *  @body createdAt, title, videoLink, text, interest, hashtag, authorNickname
 *  @error
 *      1. 요청 바디 부족
 *      2. 유저 id가 관리자가 아님
 *      3. 해당 날짜에 진행되는 기수가 없음
 */
const postAdminConcert = (userID, reqData, url) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, text, authorNickname } = reqData;
    let interest = reqData.interest
        .toLowerCase()
        .slice(1, -1)
        .replace(/"/gi, "")
        .split(/,\s?/);
    let hashtag = reqData.hashtag
        .toLowerCase()
        .slice(1, -1)
        .replace(/"/gi, "")
        .split(/,\s?/);
    // 1. 요청 바디 부족
    if (!title || !text || !interest || !hashtag || !authorNickname) {
        return -1;
    }
    // 2. 유저 id가 관리자가 아님
    let user = yield User_1.default.findById(userID);
    if (!(user.userType === 1)) {
        return -2;
    }
    const authorUser = yield User_1.default.findOne({ nickname: authorNickname });
    var authorID;
    if (authorUser) {
        authorID = authorUser._id;
    }
    else {
        authorID = userID;
    }
    const concert = new Concert_1.default({
        title: title.toLowerCase(),
        user: authorID,
        createdAt: new Date(),
        videoLink: url.videoLink,
        imgThumbnail: url.imgThumbnail,
        text: text.toLowerCase(),
        interest,
        hashtag,
        authorNickname,
    });
    yield concert.save();
    return;
});
exports.postAdminConcert = postAdminConcert;
/**
 *  @관리자_공지사항_등록
 *  @route Post admin/notice
 *  @body
 *  @error
 *      1. 요청 바디 부족
 *      2. 유저 id가 관리자가 아님
 */
const postAdminNotice = (userID, reqData, url) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, text } = reqData;
    let interest = reqData.interest
        .toLowerCase()
        .slice(1, -1)
        .replace(/"/gi, "")
        .split(/,\s?/);
    let hashtag = reqData.hashtag
        .toLowerCase()
        .slice(1, -1)
        .replace(/"/gi, "")
        .split(/,\s?/);
    // 1. 요청 바디 부족
    if (!title || !text || !interest || !hashtag) {
        return -1;
    }
    // 2. 유저 id가 관리자가 아님
    let user = yield User_1.default.findById(userID);
    if (!(user.userType === 1)) {
        return -2;
    }
    const notice = new Concert_1.default({
        title: title.toLowerCase(),
        interest,
        user: userID,
        isNotice: true,
        videoLink: url.videoLink,
        imgThumbnail: url.imgThumbnail,
        text: text.toLowerCase(),
        hashtag,
    });
    yield notice.save();
    return;
});
exports.postAdminNotice = postAdminNotice;
//# sourceMappingURL=adminService.js.map