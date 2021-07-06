import mongoose from "mongoose";
import { IUser } from "src/interfaces/IUser";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  interest: {
    type: [String],
    required: true,
  },
  marpolicy: {
    type: Boolean,
    required: false,
    default: false,
  },
  gender: {
    type: Number,
    required: true,
  },
  challengeCNT: {
    // 일주일 작성 개수
    type: Number,
    required: false,
    default: 0,
  },
  badge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Badge",
    required: true,
  },
  badgeCNT: {
    // 일반 배지
    type: Number,
    required: false,
    default: 0,
  },
  likes: {
    // 좋아요한 게시글
    challengeLikes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Callenge",
    },
    concertLikes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Concert",
    },
  },
  scraps: {
    // 스크랩한 게시글
    challengeScraps: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Callenge",
    },
    concertScraps: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Concert",
    },
  },
  userType: {
    type: Number, // 0: normal, 1: admin
    required: true,
    default: 0,
  },
  img: {
    type: String,
    required: false,
  },
  ischallenge: {
    //챌린지 참여 여부
    type: Boolean,
    required: true,
    default: false,
  },
  generation: {
    // 참여기수 참여시 갱신
    type: Number,
    required: false,
  },
});

export default mongoose.model<IUser & mongoose.Document>("User", UserSchema);
