import { Request, Response, NextFunction } from "express";
import Section from "../models/Section.js";

// Helper for catching async errors
export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// 1. GET All Sections
export const getSections = asyncHandler(async (req: Request, res: Response) => {
  const sections = await Section.find()
    .populate("questions")
    .sort("-createdAt");
  res.status(200).json({
    success: true,
    count: sections.length,
    data: sections,
  });
});

// 2. CREATE Section
export const createSections = asyncHandler(
  async (req: Request, res: Response) => {
    // FIX: Capture the created section
    const newSection = await Section.create(req.body);

    // FIX: Return 'data' so React state can update [...prev, res.data.data]
    res.status(201).json({
      success: true,
      message: "Section created.",
      data: newSection,
    });
  },
);

// 3. UPDATE Section
export const updateSection = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const updatedSection = await Section.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate("questions"); // Populate so the frontend UI shows the question text immediately

    if (!updatedSection) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    }

    res.status(200).json({
      success: true,
      data: updatedSection,
    });
  },
);

// 4. DELETE Section
export const deleteSection = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const deleted = await Section.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    }

    res.status(200).json({
      success: true,
      data: null,
      message: "Section deleted successfully",
    });
  },
);
