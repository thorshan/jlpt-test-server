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
    dob: {
      type: Date,
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
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    token: {
      type: String,
      unique: false,
    },
    association: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collabs",
    },
    finishedExams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Results",
      },
    ],
    expireAt: {
      type: Date,
      default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      index: { expires: 0 },
    },
    lastNameChanged: {
      type: Date,
    },
    lastLevelChanged: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
