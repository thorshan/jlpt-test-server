import { Request, Response } from "express";
import Ad from "../models/Ad.js";
import { asyncHandler } from "./userController.js";

// @desc    Create new ad
// @route   POST /api/ads
// @access  Private/s-Admin
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
    status: "Active",
  });

  res.status(201).json({ success: true, data: ad });
});

// @desc    Get all ads (for management/insights)
// @route   GET /api/ads
// @access  Private/s-Admin
export const getAds = asyncHandler(async (req: Request, res: Response) => {
  const ads = await Ad.find().sort("-createdAt");
  res.json({ success: true, data: ads });
});

// @desc    Get random active ad
// @route   GET /api/ads/random
// @access  Public
export const getRandomAd = asyncHandler(async (req: Request, res: Response) => {
  const count = await Ad.countDocuments({
    status: "Active",
    expiresAt: { $gt: new Date() },
  });

  if (count === 0) {
    return res.json({ success: true, data: null });
  }

  const random = Math.floor(Math.random() * count);
  const ad = await Ad.findOne({
    status: "Active",
    expiresAt: { $gt: new Date() },
  }).skip(random);

  // Increment impression
  if (ad) {
    ad.impressions = (ad.impressions || 0) + 1;
    await ad.save();
  }

  res.json({ success: true, data: ad });
});

// @desc    Update ad
// @route   PUT /api/ads/:id
// @access  Private/s-Admin
export const updateAd = asyncHandler(async (req: Request, res: Response) => {
  const { title, content, image, status, duration } = req.body;

  const ad = await Ad.findById(req.params.id);

  if (!ad) {
    res.status(404);
    throw new Error("Ad not found");
  }

  if (title) ad.title = title;
  if (content) ad.content = content;
  if (image) ad.image = image;
  if (status) ad.status = status;

  if (duration) {
    const durationMonths = parseInt(duration as string) || 1;
    ad.duration = durationMonths;
    // Optionally recalculate expiration from original creation time or update it from now?
    // Let's assume duration update extends it from NOW for simplicity, or just updates the field.
    const newExpiresAt = new Date(ad.createdAt);
    newExpiresAt.setMonth(newExpiresAt.getMonth() + durationMonths);
    ad.expiresAt = newExpiresAt;
  }

  const updatedAd = await ad.save();
  res.json({ success: true, data: updatedAd });
});

// @desc    Delete ad
// @route   DELETE /api/ads/:id
// @access  Private/s-Admin
export const deleteAd = asyncHandler(async (req: Request, res: Response) => {
  const ad = await Ad.findById(req.params.id);

  if (!ad) {
    res.status(404);
    throw new Error("Ad not found");
  }

  await Ad.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Ad removed" });
});
