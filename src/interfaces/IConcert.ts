import mongoose from "mongoose";
import { IUser } from "../interfaces/IUser";
import { ICommentDTO } from "../interfaces/IComment";
interface IUserNickName {
  _id: mongoose.Schema.Types.ObjectId;
  nickname: string;
}

export interface IConcert {
  _id: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  user: IUser;
  title: string;
  videoLink?: string;
  imgThumbnail?: string;
  text?: string;
  likes?: Number;
  interest?: [string];
  hashtag?: [string];
  isDeleted: Boolean;
  isNotice: Boolean;
  authorNickname?: string;
  commentNum: number;
  scrapNum: number;
  generation?: number;
  comments?: ICommentDTO[];
}

export interface IConcertDTO {
  _id?: mongoose.Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  user?: IUser;
  title?: string;
  videoLink?: string;
  imgThumbnail?: string;
  text?: string;
  likes?: Number;
  interest?: [string];
  hashtag?: [string];
  isDeleted?: Boolean;
  isNotice?: Boolean;
  authorNickname?: string;
  commentNum?: number;
  scrapNum?: number;
  generation?: number;
  comments?: ICommentDTO[];
}
