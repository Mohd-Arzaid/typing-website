import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    wpm: {
      type: Number,
      required: true,
    },
    accuracy: {
      type: Number,
      required: true,
    },
    characters: {
      type: String,
      required: true,
    },
    timeStamp: {
      type: Date,
      default: Date.now,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

export const Result = mongoose.model("Result", resultSchema);
