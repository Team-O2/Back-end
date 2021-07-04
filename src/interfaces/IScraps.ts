import mongoose from "mongoose";

export interface IScraps {
  challengeScraps: [mongoose.Schema.Types.ObjectId];
  concertScraps: [mongoose.Schema.Types.ObjectId];
}

export interface IScrapsDTO {
  challengeScraps: [mongoose.Schema.Types.ObjectId];
  concertScraps: [mongoose.Schema.Types.ObjectId];
}
