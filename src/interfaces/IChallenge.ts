import mongoose from "mongoose";

export interface IChallenge {
  createdAt: Date;
  updatedAt: Date;
  author: mongoose.Schema.Types.ObjectId;
  good: string;
  learn: string;
  bad: string;
  likes: Number;
  generation: Number;
  interest: [string];
}

export interface IChallengeDTO {
  createdAt: Date;
  updatedAt: Date;
  author: mongoose.Schema.Types.ObjectId;
  good: string;
  learn: string;
  bad: string;
  likes: Number;
  generation: Number;
  interest: [string];
}
