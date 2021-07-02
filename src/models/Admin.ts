import mongoose from "mongoose";
import { IAdmin } from "../interfaces/IAdmin";

const AdminSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  startDT: {
    type: Date,
    required: true,
  },
  endDT: {
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
});

export default mongoose.model<IAdmin & mongoose.Document>("Admin", AdminSchema);
