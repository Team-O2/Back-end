import mongoose from "mongoose";
import { IBadge } from "../interfaces/IBadge";

const BadgeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  welcomeBadge: {
    type: Boolean,
    required: true,
    default: true,
  },
  firstJoinBadge: {
    type: Boolean,
    required: true,
    default: false,
  },
  firstWriteBadge: {
    type: Boolean,
    required: true,
    default: false,
  },
  oneCommentBadge: {
    type: Boolean,
    required: true,
    default: false,
  },
  fiveCommentBadge: {
    type: Boolean,
    required: true,
    default: false,
  },
  oneLikeBadge: {
    type: Boolean,
    required: true,
    default: false,
  },
  fiveLikeBadge: {
    type: Boolean,
    required: true,
    default: false,
  },
  loginBadge: {
    type: Boolean,
    required: true,
    default: false,
  },
  marketingBadge: {
    type: Boolean,
    required: true,
    default: false,
  },
  learnMySelfScrapBadge: {
    type: Boolean,
    required: true,
    default: false,
  },
  firstReplyBadge: {
    type: Boolean,
    required: true,
    default: false,
  },
  concertScrapBadge: {
    type: Boolean,
    required: true,
    default: false,
  },
  challengeBadge: {
    type: Number,
    required: true,
    default: 0,
  },
});

export default mongoose.model<IBadge & mongoose.Document>("Badge", BadgeSchema);
