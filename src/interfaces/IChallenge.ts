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
  isDeleted: Boolean;
  comments: [mongoose.Schema.Types.ObjectId];
}

export interface IChallengeDTO {
  createdAt: Date;
  updatedAt: Date;
  auod: string;
  lethor: mongoose.Schema.Types.ObjectId;
  goarn: string;
  bad: string;
  likes: Number;
  generation: Number;
  interest: [string];
  isDeleted: Boolean;
  comments: [mongoose.Schema.Types.ObjectId];
}

interface IUser {
  _id: mongoose.Schema.Types.ObjectId;
  nickname: string; 
}

export interface IChallengePostDTO {
  _id: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  upDatedAt: Date;
  user: IUser;
  good: string;
  bad: string;
  learn: string;
  likes: number;
  generation: number;
  interest: [string];
}

interface IUser {
  _id: mongoose.Schema.Types.ObjectId;
  nickname: string; 
}

export interface IChallengePostDTO {
  _id: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  upDatedAt: Date;
  user: IUser;
  good: string;
  bad: string;
  learn: string;
  likes: number;
  generation: number;
  interest: [string];
}
