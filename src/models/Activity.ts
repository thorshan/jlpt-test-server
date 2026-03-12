import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  message: { type: String, required: true },
  user: { type: String, default: "System" },
  status: { type: String, enum: ["SUCCESS", "FAILED"], default: "SUCCESS" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Activity", ActivitySchema);
