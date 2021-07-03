import mongoose from "mongoose";
import config from "src/config";
import Challenge from "src/models/Challenge";
import Concert from "src/models/Concert";
import User from "src/models/User";
import Admin from "src/models/Admin";
import Comment from "src/models/Comment";

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

    console.log("Mongoose Connected ...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
