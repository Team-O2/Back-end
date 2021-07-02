import mongoose from "mongoose";
import { IChallenge } from "../interfaces/IChallenge";
const validate = require("mongoose-validator");

const textValidator = [
  validate({
    validator: "isLength",
    arguments: [1, 1000],
    message: "Text should be between 1 and 1000 characters",
  }),
];

const ChallengeSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
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
    required: true,
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

export default mongoose.model<IChallenge & mongoose.Document>(
  "Challenge",
  ChallengeSchema
);
