import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Activity from "../models/Activity.js";

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export const createUsers = asyncHandler(async (req: Request, res: Response) => {
  const { name, token, role, level } = req.body;

  const hashedToken = await bcrypt.hash(token, 10);

  const user = await User.create({
    name,
    token: hashedToken,
    role,
    level,
  });

  if (user) {
    await Activity.create({
      action: "USER_JOINED",
      message: `New user: ${user.name} has joined the engine`,
      status: "SUCCESS",
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        role: user.role,
        token: token,
      },
      token: generateToken(user._id.toString()),
    });
  }
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, token } = req.body;

  if (!name || !token) {
    res.status(400);
    throw new Error("Please provide both name and access token");
  }

  const user = await User.findOne({ name });

  const storedHashedToken = user?.token;

  if (user && typeof storedHashedToken === "string") {
    const isMatch = await bcrypt.compare(token, storedHashedToken);

    if (isMatch) {
      await Activity.create({
        action: "USER_LOGGED_IN",
        message: `User: ${user.name} authenticated via Admin Console`,
        status: "SUCCESS",
      });

      return res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          level: user.level,
          role: user.role,
        },
        token: generateToken(user._id.toString()),
      });
    }
  }

  res.status(401);
  throw new Error("Invalid name or access token");
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (user) {
    await Activity.create({
      action: "USER_LEVEL_ASSIGNED",
      message: `Assign level for user ${user.name} to ${user.level}`,
      status: "SUCCESS",
    });
  }
  res.json({ success: true, data: user });
});

export const updateRole = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.role = "admin";
  user.expireAt = undefined as any;
  await user.save();

  await Activity.create({
    action: "USER_ROLE_UPDATED",
    message: `Update role for user ${user.name} to ${user.role}`,
    status: "SUCCESS",
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
