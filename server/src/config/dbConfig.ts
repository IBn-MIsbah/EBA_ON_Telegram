import mongoose from "mongoose";
import { isProduction } from "../common/index.js";

const MONGODB_URI = isProduction
  ? (process.env.MONGODB_URI as string)
  : "mongodb://localhost:27017/eba_store";

const dbConnection = async () => {
  try {
    mongoose.connect(MONGODB_URI);
    console.log("DB connenction seccess");
  } catch (error) {
    console.log("DB connection error: ", error);
  }
};

export default dbConnection;
