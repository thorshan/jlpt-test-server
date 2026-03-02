import Exam from "../models/Exam.js";
import { Request, Response, NextFunction } from "express";

// 1. Helper for catching async errors
export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// 2. GET All Exams (with populated sections)
export const getExams = asyncHandler(async (req: Request, res: Response) => {
  const exams = await Exam.find().populate("sections").sort("-createdAt");
  res.status(200).json({ success: true, data: exams });
});

export const getExam = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const exam = await Exam.findById(id).populate("sections");
  res.status(200).json({ success: true, data: exam });
});

// 3. CREATE Exam
export const createExam = asyncHandler(async (req: Request, res: Response) => {
  const newExam = await Exam.create(req.body);

  // Important: Return the created object so the frontend can update state instantly
  res.status(201).json({
    success: true,
    message: "Exam created.",
    data: newExam,
  });
});

// 4. UPDATE Exam
export const updateExam = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const updatedExam = await Exam.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  }).populate("sections");

  if (!updatedExam) {
    return res.status(404).json({ success: false, message: "Exam not found" });
  }

  res.status(200).json({
    success: true,
    data: updatedExam,
  });
});

// 5. DELETE Exam
export const deleteExam = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedExam = await Exam.findByIdAndDelete(id);

  if (!deletedExam) {
    return res.status(404).json({ success: false, message: "Exam not found" });
  }

  res.status(200).json({ success: true, data: null, message: "Exam deleted" });
});
