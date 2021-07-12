"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AdminSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    registerStartDT: {
        type: Date,
        required: true,
    },
    registerEndDT: {
        type: Date,
        required: true,
    },
    challengeStartDT: {
        type: Date,
        required: true,
    },
    challengeEndDT: {
        type: Date,
        required: true,
    },
    generation: {
        type: Number,
        required: true,
    },
    limitNum: {
        type: Number,
        required: true,
    },
    img: {
        type: String,
        required: false,
        default: "https://o2-server.s3.ap-northeast-2.amazonaws.com/origin/default_img_100%403x.jpg",
    },
    createdDT: {
        type: Date,
        required: true,
        default: Date.now,
    },
    applyNum: {
        type: Number,
        required: true,
        default: 0,
    },
});
exports.default = mongoose_1.default.model("Admin", AdminSchema);
//# sourceMappingURL=Admin.js.map