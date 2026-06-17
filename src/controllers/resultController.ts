import { Request, Response, NextFunction } from "express";
import Results from "../models/Results.js";
import Activity from "../models/Activity.js";
import User from "../models/User.js";

// Helper for catching async errors
export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export const examResult = asyncHandler(async (req: Request, res: Response) => {
  const results = await Results.create(req.body);

  await User.findByIdAndUpdate(
    req.user?._id,
    { $push: { finishedExams: results._id } },
    { new: true },
  );

  await Activity.create({
    action: "RESULT_CREATED",
    message: `${req.user?.name} finished test [ID : ${results._id} ]`,
    status: "SUCCESS",
  });
  res.json({
    success: true,
    data: results,
  });
});

export const getResults = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId || typeof userId !== "string") {
    res.status(400).json({
      success: false,
      message: "A valid User ID must be provided",
    });
    return;
  }

  const results = await Results.find({ user: userId }).populate("user exam");

  res.json({
    success: true,
    data: results,
  });
});

export const getResultsById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const results = await Results.findById(id).populate({
      path: "user",
      populate: {
        path: "association",
        select: "name",
      },
    });
    if (!results)
      return res.json({
        success: false,
        message: "Result not found.",
      });
    res.json({
      success: true,
      data: results,
    });
  },
);

export const getAllResults = asyncHandler(
  async (req: Request, res: Response) => {
    const results = await Results.find()
      .populate("user exam")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: results,
    });
  },
);

export const getResultByUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (id === "true" && !req.user?._id) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    const filter = typeof id === "string" ? { user: req.user!._id } : {};

    const result = await Results.find(filter)
      .populate("user exam")
      .sort("-createdAt");

    res.json({
      success: true,
      data: result,
    });
  },
);
