import { Request, Response, NextFunction } from "express";
import RequestModel from "../models/Request.js";
import Activity from "../models/Activity.js";

export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export const createRequest = asyncHandler(async (req: Request, res: Response) => {
  const { resultId, email } = req.body;
  if (!resultId || !email) {
    return res.status(400).json({ success: false, message: "resultId and email are required" });
  }

  const newReq = await RequestModel.create({ resultId, email });

  await Activity.create({
    action: "CERT_REQUESTED",
    message: `A new certificate was requested for Result ID: ${resultId}`,
    status: "SUCCESS",
  });

  res.status(201).json({ success: true, data: newReq });
});

export const getRequests = asyncHandler(async (req: Request, res: Response) => {
  const reqs = await RequestModel.find().sort("-createdAt");
  res.status(200).json({ success: true, data: reqs });
});

export const updateRequest = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const updatedReq = await RequestModel.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!updatedReq) {
    return res.status(404).json({ success: false, message: "Request not found" });
  }

  await Activity.create({
    action: "CERT_REQUEST_UPDATED",
    message: `${req.user?.name} updated certificate request ${id} to ${status}`,
    status: "SUCCESS",
  });

  res.status(200).json({ success: true, data: updatedReq });
});

export const deleteRequest = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedReq = await RequestModel.findByIdAndDelete(id);

  if (!deletedReq) {
    return res.status(404).json({ success: false, message: "Request not found" });
  }

  await Activity.create({
    action: "CERT_REQUEST_DELETED",
    message: `${req.user?.name} deleted certificate request ${id}`,
    status: "SUCCESS",
  });

  res.status(200).json({ success: true, data: null, message: "Request deleted" });
});
