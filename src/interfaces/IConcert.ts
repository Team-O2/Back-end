import mongoose from "mongoose";
import { IUser } from "src/interfaces/IUser";

interface IUserNickName {
  _id: mongoose.Schema.Types.ObjectId;
  nickname: string;
}

export interface IConcert {
  createdAt: Date;
  updatedAt: Date;
  user: IUser;
  title: string;
  videoLink: string;
  imgThumbnail: string;
  text: string;
  likes: Number;
  generation: Number;
  interest: [string];
  hashtag: [string];
  isDeleted: Boolean;
  comments: typeof mongoose.Schema.Types.ObjectId[];
  isNotice: Boolean;
  authorNickname: string;
}
