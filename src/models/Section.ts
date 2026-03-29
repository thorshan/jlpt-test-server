import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    minPassedMark: { type: Number, default: 38 },
    duration: { type: Number, default: 30 },
    tag: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export default mongoose.model("Section", sectionSchema);
