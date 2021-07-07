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
  gender: Number;
  challengeCNT: Number;
  badge: IBadge;
  badgeCNT: Number;
  likes: ILikes;
  scraps: IScraps;
  userType: Number;
  img: string;
  ischallenge: Boolean;
  generation: Number;
}
