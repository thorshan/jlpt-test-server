import { Request, Response, NextFunction } from "express";
import Question from "../models/Question.js";

// Helper for catching async errors
export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// 1. GET All Questions
export const getQuestions = asyncHandler(
  async (req: Request, res: Response) => {
    const questions = await Question.find().sort("-createdAt");
    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  },
);

// 2. CREATE Question
export const createQuestion = asyncHandler(
  async (req: Request, res: Response) => {
    // FIX: Store the result in a variable
    const newQuestion = await Question.create(req.body);

    // FIX: Return the 'data' field so the frontend doesn't get 'undefined'
    res.status(201).json({
      success: true,
      message: "Question created.",
      data: newQuestion,
    });
  },
);

// 3. UPDATE Question
export const updateQuestion = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }, // 'new: true' returns the modified document
    );

    if (!updatedQuestion) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

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

    res.status(200).json({
      success: true,
      data: null,
      message: "Question deleted successfully",
    });
  },
);
