import { Request, Response, NextFunction } from "express";
import Collabs from "../models/Collabs.js";
import User from "../models/User.js";

export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export const getAllCollabs = asyncHandler(
  async (req: Request, res: Response) => {
    const collabs = await Collabs.find()
      .populate("incharge students")
      .sort("-createdAt");
    res.json({
      success: true,
      data: collabs,
    });
  },
);

export const createCollabs = asyncHandler(
  async (req: Request, res: Response) => {
    const collab = await Collabs.create({
      ...req.body,
      incharge: req.user?._id,
    });
    res.status(201).json({
      success: true,
      message: "Collab created.",
      data: collab,
    });
  },
);

export const addUserToCollab = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { collabId, id } = req.params;
      const collab = await Collabs.findByIdAndUpdate(
        collabId,
        { $push: { students: id } },
        { new: true },
      );
      const user = await User.findById(id);
      if (user) {
        user.password = user.token!;
        await user.save();
      }
      res.status(201).json({
        success: true,
        message: "Collab updated.",
        data: collab,
      });
    } catch (err) {
      console.error(err);
    }
  },
);

export const updateCollabStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { status } = req.body;
    const { id } = req.params;
    const collab = await Collabs.findById(id);
    console.log(collab);
    if (collab) {
      collab.status = status;
      await collab?.save();
    } else {
      res.status(404).json({
        message: "Collabs not found",
      });
    }

    res.json({
      message: "Collabs status updated.",
      success: true,
      data: collab,
    });
  },
);
