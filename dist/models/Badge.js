"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const BadgeSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    welcomeBadge: {
        type: Boolean,
        required: true,
        default: true,
    },
    firstJoinBadge: {
        type: Boolean,
        required: true,
        default: false,
    },
    firstWriteBadge: {
        type: Boolean,
        required: true,
        default: false,
    },
    oneCommentBadge: {
        type: Boolean,
        required: true,
        default: false,
    },
    fiveCommentBadge: {
        type: Boolean,
        required: true,
        default: false,
    },
    oneLikeBadge: {
        type: Boolean,
        required: true,
        default: false,
    },
    fiveLikeBadge: {
        type: Boolean,
        required: true,
        default: false,
    },
    loginBadge: {
        type: Boolean,
        required: true,
        default: false,
    },
    marketingBadge: {
        type: Boolean,
        required: true,
        default: false,
    },
    runMySelfScrapBadge: {
        type: Boolean,
        required: true,
        default: false,
    },
    firstReplyBadge: {
        type: Boolean,
        required: true,
        default: false,
    },
    concertScrapBadge: {
        type: Boolean,
        required: true,
        default: false,
    },
    challengeBadge: {
        type: Number,
        required: true,
        default: 0,
    },
});
exports.default = mongoose_1.default.model("Badge", BadgeSchema);
//# sourceMappingURL=Badge.js.map