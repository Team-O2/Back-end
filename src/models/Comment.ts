import mongoose from "mongoose";
import { IComment } from "../interfaces/IComment";

const CommentSchema = new mongoose.Schema({
  postModel: {
    type: String,
    required: true,
    enum: ["Challenge", "Concert", "Notice"],
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "postModel",
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },
  childrenComment: {
    type: [mongoose.Schema.Types.ObjectId],
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

export default mongoose.model<IComment & mongoose.Document>(
  "Comment",
  CommentSchema
);
