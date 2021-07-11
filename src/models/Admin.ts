import mongoose from "mongoose";
import { IAdmin } from "../interfaces/IAdmin";

const AdminSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  registerStartDT: {
    type: Date,
    required: true,
  },
  registerEndDT: {
    type: Date,
    required: true,
  },
  challengeStartDT: {
    type: Date,
    required: true,
  },
  challengeEndDT: {
    type: Date,
    required: true,
  },
  generation: {
    type: Number,
    required: true,
  },
  limitNum: {
    type: Number,
    required: true,
  },
  img: {
    type: String,
    required: false,
    default:
      "https://o2-server.s3.ap-northeast-2.amazonaws.com/origin/default_img_100%403x.jpg",
  },
  createdDT: {
    type: Date,
    required: true,
    default: Date.now,
  },
  applyNum: {
    type: Number,
    required: true,
    default: 0,
  },
});

export default mongoose.model<IAdmin & mongoose.Document>("Admin", AdminSchema);
