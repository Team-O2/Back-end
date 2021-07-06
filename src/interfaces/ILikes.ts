import mongoose from "mongoose";

export interface ILikes {
  challengeLikes: [mongoose.Schema.Types.ObjectId];
  concertLikes: [mongoose.Schema.Types.ObjectId];
}

export interface ILikesDTO {
  challengeLikes: [mongoose.Schema.Types.ObjectId];
  concertLikes: [mongoose.Schema.Types.ObjectId];
}
