import mongoose from "mongoose";

export interface IScraps {
  challengeScraps: (typeof mongoose.Schema.Types.ObjectId)[];
  concertScraps: (typeof mongoose.Schema.Types.ObjectId)[];
}

export interface IScrapsDTO {
  challengeScraps: (typeof mongoose.Schema.Types.ObjectId)[];
  concertScraps: (typeof mongoose.Schema.Types.ObjectId)[];
}
