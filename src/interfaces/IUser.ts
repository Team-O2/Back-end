import mongoose from "mongoose";
import { IScraps } from "./IScraps";
import { ILikes } from "./ILikes";

export interface IUser {
  _id: mongoose.Schema.Types.ObjectId;
  email: String;
  password: String;
  nickname: String;
  interest: [String];
  marpolicy: Boolean;
  gender: Number;
  challengeCNT: Number;
  challengebadgeCNT: Number;
  badgeCNT: Number;
  likes: [ILikes];
  scraps: [IScraps];
  userType: Number;
}

export interface IUserDTO {
  _id: mongoose.Schema.Types.ObjectId;
  email: String;
  password: String;
  nickname: String;
  interest: [String];
  marpolicy: Boolean;
  gender: Number;
  challengeCNT: Number;
  challengebadgeCNT: Number;
  badgeCNT: Number;
  likes: [ILikes];
  scraps: [IScraps];
  userType: Number;
}
