import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";

// Helper for catching async errors
export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export const createUsers = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json({ success: true, data: user });
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  res.json({ success: true, data: user });
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find().sort("-createdAt");
  res.json({ success: true, data: users });
});

export const clearUsers = asyncHandler(async (req: Request, res: Response) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "All user data is cleared" });
});
