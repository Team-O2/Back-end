import mongoose from "mongoose";
import { IConcert } from "../interfaces/IConcert";
const validate = require("mongoose-validator");

const textValidator = [
  validate({
    validator: "isLength",
    arguments: [1, 1000],
    message: "Text should be between 1 and 1000 characters",
  }),
];

const ConcertSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
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
  },
  imgThumbnail: {
    type: String,
    required: false,
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
  generation: {
    type: Number,
    required: false,
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
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Comment",
    default: [],
  },
  isNotice: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export default mongoose.model<IConcert & mongoose.Document>(
  "Concert",
  ConcertSchema
);
