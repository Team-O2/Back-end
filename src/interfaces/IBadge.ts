import { IUser } from "src/interfaces/IUser";

export interface IBadge {
  user: IUser;
  welcomeBadge: Boolean;
  firstJoinBadge: Boolean;
  firstWriteBadge: Boolean;
  oneCommentBadge: Boolean;
  fiveCommentBadge: Boolean;
  oneLikeBadge: Boolean;
  fiveLikeBadge: Boolean;
  loginBadge: Boolean;
  marketingBadge: Boolean;
  runMySelfScrapBadge: Boolean;
  firstReplyBadge: Boolean;
  concertScrapBadge: Boolean;
  challengeBadge: Number;
}
