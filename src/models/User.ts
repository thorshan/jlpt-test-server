import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
    },
    level: {
      type: String,
      default: "N5",
    },
    token: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

// --- THE AUTO-DELETE LOGIC ---
// 1 week = 60 seconds * 60 minutes * 24 hours * 7 days = 604800 seconds
userSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

export default mongoose.model("User", userSchema);
