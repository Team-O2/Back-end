import mongoose from "mongoose";
import { IComment } from "src/interfaces/IComment";

const CommentSchema = new mongoose.Schema({
  postModel: {
    type: String,
    required: true,
    enum: ["Challenge", "Concert"],
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "postModel",
    required: true,
  },
  author: {
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
  },
  text: {
    type: String,
    required: [true, "text is required!"],
  },
  isDeleted: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

export default mongoose.model<IComment & mongoose.Document>(
  "Comment",
  CommentSchema
);
