"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    createDT: {
        type: Date,
        required: true,
        default: Date.now,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        required: true,
    },
    interest: {
        type: [String],
        required: true,
    },
    marpolicy: {
        type: Boolean,
        required: false,
        default: false,
    },
    gender: {
        type: Number,
        required: true,
    },
    challengeCNT: {
        // 일주일 작성 개수
        type: Number,
        required: false,
        default: 0,
    },
    badge: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Badge",
    },
    badgeCNT: {
        // 일반 배지
        type: Number,
        required: false,
        default: 0,
    },
    commentCNT: {
        type: Number,
        required: true,
        default: 0,
    },
    likes: {
        // 좋아요한 게시글
        challengeLikes: {
            type: [mongoose_1.default.Schema.Types.ObjectId],
            ref: "Callenge",
        },
        concertLikes: {
            type: [mongoose_1.default.Schema.Types.ObjectId],
            ref: "Concert",
        },
    },
    scraps: {
        // 스크랩한 게시글
        challengeScraps: {
            type: [mongoose_1.default.Schema.Types.ObjectId],
            ref: "Callenge",
        },
        concertScraps: {
            type: [mongoose_1.default.Schema.Types.ObjectId],
            ref: "Concert",
        },
    },
    userType: {
        type: Number,
        required: true,
        default: 0,
    },
    img: {
        type: String,
        required: false,
        default: "https://o2-server.s3.ap-northeast-2.amazonaws.com/origin/default_img_100%403x.jpg",
    },
    isChallenge: {
        // 챌린지 참여 여부
        type: Boolean,
        required: true,
        default: false,
    },
    isRegist: {
        // 챌린지 신청 여부
        type: Boolean,
        required: true,
        default: false,
    },
    generation: {
        // 참여기수 참여시 갱신
        type: Number,
        required: true,
        default: 0,
    },
    emailCode: {
        // 이메일로 받은 인증번호
        type: String,
        required: false,
    },
});
exports.default = mongoose_1.default.model("User", UserSchema);
//# sourceMappingURL=User.js.map