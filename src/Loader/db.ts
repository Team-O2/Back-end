import mongoose from "mongoose";
import config from "../config";
import User from "../models/User";

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

    console.log("Mongoose Connected ...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
