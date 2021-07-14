import mongoose from "mongoose";
import { userHeaderDTO } from "./userDTO";

export interface IChallengeDTO {
  createdAt: Date;
  updatedAt: Date;
  user: userHeaderDTO;
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
