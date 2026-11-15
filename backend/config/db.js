import mongoose from "mongoose";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!uri) {
  throw new Error("MONGODB_URI is required");
}

export const client = new MongoClient(uri);
export const db = client.db();

const connectDb = async () => {
  try {
    await client.connect();
    await mongoose.connect(uri);
    console.log(`MongoDB connected successfully !!`);
  } catch (error) {
    console.log("Error While connecting to MongoDB :", error);
    process.exit(1);
  }
};

export default connectDb;
