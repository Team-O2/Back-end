import mongoose from "mongoose";

export interface IConcert {
  createdAt: Date;
  updatedAt: Date;
  title: string;
  userId: mongoose.Schema.Types.ObjectId;
  videoLink: string;
  text: string;
  likes: Number;
  generation: Number;
  interest: [string];
}

export interface IConcertDTO {
  createdAt: Date;
  updatedAt: Date;
  title: string;
  userId: mongoose.Schema.Types.ObjectId;
  videoLink: string;
  text: string;
  likes: Number;
  generation: Number;
  interest: [string];
}
