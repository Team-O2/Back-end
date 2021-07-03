import mongoose from "mongoose";
import { IChallenge } from "src/interfaces/IChallenge";
import validate from "mongoose-validator";

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
    default: Date.now,
  },
  user: {
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
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Comment",
    default: [],
  },
});

export default mongoose.model<IChallenge & mongoose.Document>(
  "Challenge",
  ChallengeSchema
);
