import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    resultId: { type: String, required: true },
    email: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "SENT"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Request", requestSchema);
