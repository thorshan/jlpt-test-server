import { Request, Response, NextFunction } from "express";
import Question from "../models/Question.js";
import Activity from "../models/Activity.js";

// Helper for catching async errors
export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// 1. GET All Questions
export const getQuestions = asyncHandler(
  async (req: Request, res: Response) => {
    const { admin } = req.query;
  const isSAdmin = req.user?.role === "s-admin";
  const filter =
    admin === "true" && !isSAdmin ? { createdBy: req.user?._id } : {};

  try {
    const questions = await Question.find(filter as any).sort("-createdAt");
    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    // Handle error if necessary, or let asyncHandler catch it
    throw error;
  }
  },
);

// 2. CREATE Question
export const createQuestion = asyncHandler(
  async (req: Request, res: Response) => {
    // FIX: Store the result in a variable
    try {
    const newQuestion = await Question.create({
      ...req.body,
      createdBy: req.user?._id,
    });

    await Activity.create({
      action: "QUESTION_CREATED",
      message: `${req.user?.name} created question [ID : ${newQuestion._id} | Title : ${newQuestion.text}]`,
      status: "SUCCESS",
      userId: req.user?._id as any,
    });

    res.status(201).json({
      success: true,
      message: "Question created.",
      data: newQuestion,
    });
  } catch (error) {
    // Handle error if necessary, or let asyncHandler catch it
    throw error;
  }
  },
);

// 3. UPDATE Question
export const updateQuestion = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const updatedQuestion = await Question.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedQuestion) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    await Activity.create({
      action: "QUESTION_UPDATED",
      message: `${req.user?.name} updated question [ ID : ${id}]`,
      status: "SUCCESS",
      userId: req.user?._id as any,
    });

    res.status(200).json({
      success: true,
      data: updatedQuestion,
    });
  },
);

// 4. DELETE Question
export const deleteQuestion = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const deleted = await Question.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    await Activity.create({
      action: "QUESTION_DELETED",
      message: `${req.user?.name} deleted a question [ ID : ${id} | Title : ${deleted.text}]`,
      status: "SUCCESS",
      userId: req.user?._id as any,
    });

    res.status(200).json({
      success: true,
      data: null,
      message: "Question deleted successfully",
    });
  },
);
