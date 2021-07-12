"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CommentSchema = new mongoose_1.default.Schema({
    postModel: {
        type: String,
        required: true,
        enum: ["Challenge", "Concert"],
    },
    post: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        refPath: "postModel",
        required: true,
    },
    userID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    parentComment: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Comment",
        default: null,
    },
    childrenComment: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: "Comment",
        default: [],
    },
    text: {
        type: String,
        required: [true, "text is required!"],
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});
exports.default = mongoose_1.default.model("Comment", CommentSchema);
//# sourceMappingURL=Comment.js.map