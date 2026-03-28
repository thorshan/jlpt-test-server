import { Request, Response } from "express";
import Ad from "../models/Ad.js";
import { asyncHandler } from "./userController.js";

// @desc    Create new ad
// @route   POST /api/ads
// @access  Private/Admin
export const createAd = asyncHandler(async (req: Request, res: Response) => {
  const { title, content, duration, image } = req.body;

  if (!image) {
    res.status(400);
    throw new Error("Please provide an image URL");
  }

  const durationMonths = parseInt(duration as string) || 1;
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + durationMonths);

  const ad = await Ad.create({
    title,
    content,
    image,
    duration: durationMonths,
    expiresAt,
  });

  res.status(201).json({ success: true, data: ad });
});

// @desc    Get all ads
// @route   GET /api/ads
// @access  Private/Admin
export const getAds = asyncHandler(async (req: Request, res: Response) => {
  const ads = await Ad.find().sort("-createdAt");
  res.json({ success: true, data: ads });
});

// @desc    Get random active ad
// @route   GET /api/ads/random
// @access  Public
export const getRandomAd = asyncHandler(async (req: Request, res: Response) => {
  const count = await Ad.countDocuments({ expiresAt: { $gt: new Date() } });
  if (count === 0) {
    return res.json({ success: true, data: null });
  }
  const random = Math.floor(Math.random() * count);
  const ad = await Ad.findOne({ expiresAt: { $gt: new Date() } }).skip(random);
  res.json({ success: true, data: ad });
});

// @desc    Delete ad
// @route   DELETE /api/ads/:id
// @access  Private/Admin
export const deleteAd = asyncHandler(async (req: Request, res: Response) => {
  const ad = await Ad.findById(req.params.id);

  if (!ad) {
    res.status(404);
    throw new Error("Ad not found");
  }

  await Ad.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Ad removed" });
});
