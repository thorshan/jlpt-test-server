import { Request, Response, NextFunction } from "express";
import Section from "../models/Section.js";
import Activity from "../models/Activity.js";

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
    const newSection = await Section.create(req.body);

    await Activity.create({
      action: "SECTION_CREATED",
      message: `${req.user?.name} created section [ ID : ${newSection._id} | Title : ${newSection.title}]`,
      status: "SUCCESS",
    });

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
    }).populate("questions");

    if (!updatedSection) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    }

    await Activity.create({
      action: "SECTION_UPDATED",
      message: `${req.user?.name} updeated section [ ID : ${id}]`,
      status: "SUCCESS",
    });

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

    await Activity.create({
      action: "SECTION_DELETED",
      message: `${req.user?.name} deleted section [ ID : ${id} | Title : ${deleted.title}]`,
      status: "SUCCESS",
    });

    res.status(200).json({
      success: true,
      data: null,
      message: "Section deleted successfully",
    });
  },
);
