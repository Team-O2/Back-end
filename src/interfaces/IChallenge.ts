import mongoose from "mongoose";

interface IUserNickName {
  _id: mongoose.Schema.Types.ObjectId;
  nickname: string;
}

export interface IChallenge {
  createdAt: Date;
  updatedAt: Date;
  user: IUserNickName;
  good: string;
  learn: string;
  bad: string;
  likes: Number;
  commentNum: Number;
  scrapNum: Number;
  generation: Number;
  interest: [string];
  isDeleted: Boolean;
  comments: typeof mongoose.Schema.Types.ObjectId[];
}
