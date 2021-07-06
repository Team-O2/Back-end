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
  generation: Number;
  interest: [string];
  isDeleted: Boolean;
  comments: [mongoose.Schema.Types.ObjectId];
}

export interface IChallengeDTO {
  createdAt: Date;
  updatedAt: Date;
  user: IUserNickName;
  good: string;
  learn: string;
  bad: string;
  likes: Number;
  generation: Number;
  interest: [string];
  isDeleted: Boolean;
  comments: [mongoose.Schema.Types.ObjectId];
}

export interface IChallengePostDTO {
  _id: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  upDatedAt: Date;
  user: IUserNickName;
  good: string;
  bad: string;
  learn: string;
  likes: number;
  generation: number;
  interest: [string];
}
