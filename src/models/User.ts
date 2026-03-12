import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
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
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

userSchema.pre("save", function () {
  if (this.role === "admin") {
    this.expireAt = null;
  } else {
    this.expireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }
});

export default mongoose.model("User", userSchema);
