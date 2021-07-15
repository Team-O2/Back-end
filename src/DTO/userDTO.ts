import mongoose, { Document } from "mongoose";
import { IComment } from "src/interfaces/IComment";
import { IUser } from "src/interfaces/IUser";
import { IConcert } from "src/interfaces/IConcert";
import { IChallenge } from "src/interfaces/IChallenge";

export interface userHeaderDTO {
  _id?: mongoose.Schema.Types.ObjectId;
  nickname?: string;
  img?: string;
}

export interface registerReqDTO {
  challengeCNT: number;
}

export interface ILearnMySelfAchieve {
  percent: number;
  totalNum: number;
  completeNum: number;
  startDT: Date;
  endDT: Date;
  generation: Number;
}

export interface IShareTogether {
  _id: mongoose.Schema.Types.ObjectId;
  title: string;
}

export interface ICouponBook {
  welcomeBadge: Boolean;
  firstJoinBadge: Boolean;
  firstWriteBadge: Boolean;
  oneCommentBadge: Boolean;
  fiveCommentBadge: Boolean;
  oneLikeBadge: Boolean;
  fiveLikeBadge: Boolean;
  loginBadge: Boolean;
  marketingBadge: Boolean;
  learnMySelfScrapBadge: Boolean;
  firstReplyBadge: Boolean;
  concertScrapBadge: Boolean;
  challengeBadge: Number;
}

export interface mypageInfoResDTO {
  nickname?: string;
  learnMyselfAchieve: ILearnMySelfAchieve | null;
  shareTogether: IShareTogether[] | null;
  couponBook: ICouponBook;
}

export interface concertScrapResDTO {
  mypageConcertScrap: (IConcert &
    Document<IUser, mongoose.Schema.Types.ObjectId> &
    Document<IComment, mongoose.Schema.Types.ObjectId>)[];
  totalScrapNum: number;
}

export interface challengeScrapResDTO {
  mypageChallengeScrap: (IChallenge &
    Document<IUser, mongoose.Schema.Types.ObjectId> &
    Document<IComment, mongoose.Schema.Types.ObjectId>)[];
  totalScrapNum: number;
}

export interface myWritingsResDTO {
  mypageChallengeScrap: (IChallenge &
    Document<IUser, mongoose.Schema.Types.ObjectId> &
    Document<IComment, mongoose.Schema.Types.ObjectId>)[];
  totalScrapNum: number;
}

export interface myCommentsResDTO {
  comments: IComment[];
  commentNum: number;
}

export interface delMyCommentReqDTO {
  userID: { id: mongoose.Schema.Types.ObjectId };
  commentID: mongoose.Schema.Types.ObjectId[];
}

export interface userInfoResDTO {
  interest: string[];
  marpolicy: Boolean;
  img?: string;
  _id: mongoose.Schema.Types.ObjectId;
  email: string;
  nickname?: string;
  gender: 0 | 1 | 2;
}

export interface userInfoReqDTO {
  interest: string;
  marpolicy: string;
  img?: File;
  nickname?: string;
  gender: string;
}

export interface newPwReqDTO {
  password: string;
  newPassword: string;
  userID: { id: mongoose.Schema.Types.ObjectId };
}
