import mongoose from "mongoose";

export interface ILikes {
  challengeLikes: (typeof mongoose.Schema.Types.ObjectId)[];
  concertLikes: (typeof mongoose.Schema.Types.ObjectId)[];
}

export interface ILikesDTO {
  challengeLikes: (typeof mongoose.Schema.Types.ObjectId)[];
  concertLikes: (typeof mongoose.Schema.Types.ObjectId)[];
}
