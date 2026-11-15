import { Result } from "../models/result.model.js";
import { createResultSchema } from "../validators/result.validator.js";

export const createResult = async (req, res) => {
  try {
    const parsed = createResultSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation Failed",
        errors: parsed.error.issues.map((issue) => issue.message),
      });
    }

    const { wpm, accuracy, characters } = parsed.data;

    if (Number.isNaN(accuracy)) {
      return res.status(400).json({
        success: false,
        message: "Invalid result payload",
      });
    }

    const result = await Result.create({
      wpm,
      accuracy,
      characters,
      timeStamp: new Date(),
      userId: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Result saved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Create result error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user.userId })
      .sort({ timeStamp: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Results fetched successfully",
      data: results,
    });
  } catch (error) {
    console.error("Get results error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
