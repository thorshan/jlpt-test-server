import Activity from "../models/Activity.js";
import Exam from "../models/Exam.js";
import Section from "../models/Section.js";
import Question from "../models/Question.js";
import { Request, Response, NextFunction } from "express";

// 1. Helper for catching async errors
export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// 2. GET All Exams (with populated sections)
export const getExams = asyncHandler(async (req: Request, res: Response) => {
  const { admin } = req.query;
  const isSAdmin = req.user?.role === "s-admin";
  const filter =
    admin === "true" && !isSAdmin ? { createdBy: req.user?._id } : {};

  const exams = await Exam.find(filter as any)
    .populate("sections")
    .sort("-createdAt");
  res.status(200).json({ success: true, data: exams });
});

export const getExam = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const exam = await Exam.findById(id).populate({
    path: "sections",
    populate: { path: "questions" },
  });
  res.status(200).json({ success: true, data: exam });
});

// 3. CREATE Exam
export const createExam = asyncHandler(async (req: Request, res: Response) => {
  const newExam = await Exam.create({ ...req.body, createdBy: req.user?._id });

  await Activity.create({
    action: "EXAM_CREATED",
    message: `${req.user?.name} created exam [ ID : ${newExam._id} | Title : ${newExam.title}]`,
    status: "SUCCESS",
    userId: req.user?._id as any,
  });

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

  await Activity.create({
    action: "EXAM_UPDATED",
    message: `${req.user?.name} updeated exam [ ID : ${id}]`,
    status: "SUCCESS",
    userId: req.user?._id as any,
  });

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

  const sections = await Section.find({ _id: { $in: deletedExam.sections } });
  for (const section of sections) {
    await Question.deleteMany({ _id: { $in: section.questions } });
  }
  await Section.deleteMany({ _id: { $in: deletedExam.sections } });

  await Activity.create({
    action: "EXAM_DELETED",
    message: `${req.user?.name} deleted exam [ ID : ${id} | Title : ${deletedExam.title}]`,
    status: "SUCCESS",
    userId: req.user?._id as any,
  });

  res.status(200).json({ success: true, data: null, message: "Exam deleted" });
});
