import mongoose from "mongoose";
import config from "../config";
import Challenge from "../models/Challenge";
import Concert from "../models/Concert";
import User from "../models/User";
import Admin from "../models/Admin";
import Badge from "../models/Badge";
import Comment from "../models/Comment";

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    User.createCollection().then(function (collection) {
      console.log("User Collection is created!");
    });
    Challenge.createCollection().then(function (collection) {
      console.log("Challenge Collection is created!");
    });
    Concert.createCollection().then(function (collection) {
      console.log("Concert Collection is created!");
    });
    Comment.createCollection().then(function (collection) {
      console.log("Comment Collection is created!");
    });
    Admin.createCollection().then(function (collection) {
      console.log("Admin Collection is created!");
    });
    Badge.createCollection().then(function (collection) {
      console.log("Badge Collection is created!");
    });

    console.log("Mongoose Connected ...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
