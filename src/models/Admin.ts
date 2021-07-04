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
  cardiNum: {
    type: Number,
    required: true,
  },
  limitNum: {
    type: Number,
    required: true,
  },
  img: {
    data: String,
  },
  createdDT: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export default mongoose.model<IAdmin & mongoose.Document>("Admin", AdminSchema);
