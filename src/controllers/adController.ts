import { Request, Response } from "express";
import Ad from "../models/Ad.js";
import fs from "fs";
import path from "path";
import { asyncHandler } from "./userController.js";

// @desc    Create new ad
// @route   POST /api/ads
// @access  Private/Admin
export const createAd = asyncHandler(async (req: Request, res: Response) => {
  const { title, content, duration } = req.body;
  const image = req.file ? `/uploads/ads/${req.file.filename}` : null;

  if (!image) {
    res.status(400);
    throw new Error("Please upload an image");
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

  // Delete associated image file
  if (ad.image) {
    // Note: ad.image starts with /uploads/ads/
    // We need to map it to the actual file system path
    const imagePath = path.join(process.cwd(), ad.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  await Ad.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Ad removed" });
});
