import mongoose from "mongoose";
import { IScraps } from "./IScraps";
import { ILikes } from "./ILikes";
import { IBadge } from "./IBadge";

export interface IUser {
  _id: mongoose.Schema.Types.ObjectId;
  createDT: Date;
  email: string;
  password: string;
  nickname: string;
  interest: [string];
  marpolicy: Boolean;
  gender: number;
  challengeCNT: number;
  conditionCNT: number;
  writingCNT: number;
  badge: IBadge;
  badgeCNT: number;
  commentCNT: number;
  likes: ILikes;
  scraps: IScraps;
  userType: number;
  img: string;
  isChallenge: Boolean;
  isRegist: Boolean;
  generation: Number;
  emailCode: string;
}
