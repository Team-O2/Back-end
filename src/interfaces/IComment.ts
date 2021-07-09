import mongoose from "mongoose";

export interface IComment {
  postModel: String;
  post: mongoose.Schema.Types.ObjectId;
  userID: mongoose.Schema.Types.ObjectId;
  parentComment: mongoose.Schema.Types.ObjectId;
  childrenComment: (typeof mongoose.Schema.Types.ObjectId)[];
  text: string;
  isDeleted: Boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommentDTO {
  postModel: String;
  post: mongoose.Schema.Types.ObjectId;
  userID: mongoose.Schema.Types.ObjectId;
  parentComment: mongoose.Schema.Types.ObjectId;
  childrenComment: (typeof mongoose.Schema.Types.ObjectId)[];
  text: string;
  isDeleted: Boolean;
  createdAt: Date;
  updatedAt: Date;
}
