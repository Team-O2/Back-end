import mongoose from "mongoose";

export interface IScraps {
  chanllengeScraps: [mongoose.Schema.Types.ObjectId];
  concertScraps: [mongoose.Schema.Types.ObjectId];
}

export interface IScrapsDTO {
  chanllengeScraps: [mongoose.Schema.Types.ObjectId];
  concertScraps: [mongoose.Schema.Types.ObjectId];
}
