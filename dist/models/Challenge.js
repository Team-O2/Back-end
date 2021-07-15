"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_validator_1 = __importDefault(require("mongoose-validator"));
const textValidator = [
    mongoose_validator_1.default({
        validator: "isLength",
        arguments: [1, 1000],
        message: "Text should be between 1 and 1000 characters",
    }),
];
const ChallengeSchema = new mongoose_1.default.Schema({
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
    good: {
        type: String,
        required: true,
        validate: textValidator,
    },
    learn: {
        type: String,
        required: true,
        validate: textValidator,
    },
    bad: {
        type: String,
        required: true,
        validate: textValidator,
    },
    likes: {
        type: Number,
        required: false,
        default: 0,
    },
    commentNum: {
        type: Number,
        required: false,
        default: 0,
    },
    scrapNum: {
        type: Number,
        required: false,
        default: 0,
    },
    generation: {
        type: Number,
        default: 0,
    },
    interest: {
        // 관심분야(해시태그)
        type: [String],
        required: true,
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
});
exports.default = mongoose_1.default.model("Challenge", ChallengeSchema);
//# sourceMappingURL=Challenge.js.map