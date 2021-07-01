import mongoose from "mongoose";

export interface ILikes {
  chanllengeLikes: [mongoose.Schema.Types.ObjectId];
  concertLikes: [mongoose.Schema.Types.ObjectId];
}

export interface ILikesDTO {
  chanllengeLikes: [mongoose.Schema.Types.ObjectId];
  concertLikes: [mongoose.Schema.Types.ObjectId];
}
