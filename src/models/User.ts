import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
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
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("User", userSchema);
