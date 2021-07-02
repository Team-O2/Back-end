import mongoose from "mongoose";

export interface IComment {
  postModel: String;
  post: mongoose.Schema.Types.ObjectId;
  author: mongoose.Schema.Types.ObjectId;
  parentComment: mongoose.Schema.Types.ObjectId;
  childrenComment: [mongoose.Schema.Types.ObjectId];
  text: string;
  isDeleted: Boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommentDTO {
  postModel: String;
  post: mongoose.Schema.Types.ObjectId;
  author: mongoose.Schema.Types.ObjectId;
  parentComment: mongoose.Schema.Types.ObjectId;
  childrenComment: [mongoose.Schema.Types.ObjectId];
  text: string;
  isDeleted: Boolean;
  createdAt: Date;
  updatedAt: Date;
}
