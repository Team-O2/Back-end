import mongoose from "mongoose";
import { IScraps } from "./IScraps";
import { ILikes } from "./ILikes";
import { IBadge } from "./IBadge";

export interface IUser {
  _id: mongoose.Schema.Types.ObjectId;
  email: string;
  password: string;
  nickname: string;
  interest: [string];
  marpolicy: Boolean;
  gender: number;
  challengeCNT: number;
  badge: IBadge;
  badgeCNT: number;
  commentCNT: number;
  likes: ILikes;
  scraps: IScraps;
  userType: number;
  img: string;
  ischallenge: Boolean;
  generation: Number;
  emailCode: string;
}
