"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validate = require("mongoose-validator");
const textValidator = [
    validate({
        validator: "isLength",
        arguments: [1, 1000],
        message: "Text should be between 1 and 1000 characters",
    }),
];
const ConcertSchema = new mongoose_1.default.Schema({
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    videoLink: {
        // 게시물 안에 들어갈 동영상 링크
        type: String,
        required: false,
        default: "https://o2-server.s3.ap-northeast-2.amazonaws.com/origin/default_img_100%403x.jpg",
    },
    imgThumbnail: {
        type: String,
        required: false,
        default: "https://o2-server.s3.ap-northeast-2.amazonaws.com/origin/default_img_100%403x.jpg",
    },
    text: {
        // 게시물 안에 들어갈 작성글
        type: String,
    },
    likes: {
        type: Number,
        required: true,
        default: 0,
    },
    commentNum: {
        type: Number,
        required: true,
        default: 0,
    },
    scrapNum: {
        type: Number,
        required: true,
        default: 0,
    },
    interest: {
        // 관심분야
        type: [String],
        required: true,
    },
    hashtag: {
        //해시태그
        type: [String],
    },
    isDeleted: {
        // 삭제 여부
        type: Boolean,
        required: true,
        default: false,
    },
    comments: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: "Comment",
        default: [],
    },
    isNotice: {
        type: Boolean,
        required: true,
        default: false,
    },
    authorNickname: {
        type: String,
        required: false,
    },
});
exports.default = mongoose_1.default.model("Concert", ConcertSchema);
//# sourceMappingURL=Concert.js.map