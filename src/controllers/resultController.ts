import { Request, Response, NextFunction } from "express";
import Results from "../models/Results.js";
import Activity from "../models/Activity.js";

// Helper for catching async errors
export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export const examResult = asyncHandler(async (req: Request, res: Response) => {
  const results = await Results.create(req.body);

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

  const results = await Results.find({ user: userId })
    .populate("user")
    .populate("exam");

  res.json({
    success: true,
    data: results,
  });
});

export const getAllResults = asyncHandler(
  async (req: Request, res: Response) => {
    const results = await Results.find()
      .populate("user")
      .populate("exam")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: results,
    });
  },
);
