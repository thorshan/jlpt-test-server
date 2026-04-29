import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
      unique: false,
    },
    role: {
      type: String,
      enum: ["user", "admin", "s-admin"],
      default: "user",
    },
    level: {
      type: String,
      default: "N5",
    },
    token: {
      type: String,
      unique: true,
    },
    expireAt: {
      type: Date,
      default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
