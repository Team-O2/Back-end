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
  },
  title: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  videoLink: {
    // 게시물 안에 들어갈 동영상 링크
    type: String,
    required: true,
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
  generation: {
    type: Number,
    required: true,
  },
  interest: {
    // 관심분야(해시태그)
    type: [String],
    required: true,
  },
});

export default mongoose.model<IConcert & mongoose.Document>(
  "Concert",
  ConcertSchema
);
