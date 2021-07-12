import mongoose, { isValidObjectId } from "mongoose";
import { IUser } from "src/interfaces/IUser";

const UserSchema = new mongoose.Schema({
  createDT: {
    // 유저 회원가입 일자
    type: Date,
    required: true,
    default: Date.now,
  },
  email: {
    // 유저 이메일
    type: String,
    unique: true,
    required: true,
  },
  password: {
    // 유저 비밀번호
    type: String,
    required: true,
  },
  nickname: {
    // 유저 닉네임
    type: String,
    required: true,
  },
  interest: {
    // 유저 관심분야
    type: [String],
    required: true,
  },
  marpolicy: {
    // 유저 이메일, 마케팅 수신 여부
    type: Boolean,
    required: false,
    default: false,
  },
  gender: {
    // 유저 성별
    type: Number,
    required: true,
  },
  challengeCNT: {
    // 신청할 때 받은 일주일 작성 개수 조건
    type: Number,
    required: false,
    default: 0,
  },
  conditionCNT: {
    // 챌린지 동안 일주일 작성 개수 조건
    type: Number,
    required: false,
    default: 0,
  },
  writingCNT: {
    // 챌린지 기간동안 유저가 작성한 회고 개수
    type: Number,
    require: true,
    default: 0,
  },
  badge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Badge",
  },
  badgeCNT: {
    // 일반 배지
    type: Number,
    required: false,
    default: 0,
  },
  commentCNT: {
    // 내가 쓴 댓글 개수
    type: Number,
    required: true,
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
    // 유저 프로필 이미지
    type: String,
    required: false,
    default:
      "https://o2-server.s3.ap-northeast-2.amazonaws.com/origin/default_img_100%403x.jpg",
  },
  isChallenge: {
    // 챌린지 참여 여부
    type: Boolean,
    required: true,
    default: false,
  },
  isRegist: {
    // 챌린지 신청 여부
    type: Boolean,
    required: true,
    default: false,
  },
  generation: {
    // 참여기수 참여시 갱신
    type: Number,
    required: true,
    default: 0,
  },
  emailCode: {
    // 이메일로 받은 인증번호
    type: String,
    required: false,
  },
});

export default mongoose.model<IUser & mongoose.Document>("User", UserSchema);
