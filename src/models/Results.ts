import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    level: {
      type: String,
      enum: ["N1", "N2", "N3", "N4", "N5"],
      required: true,
    },
    sectionTotalScore: { type: Number },
    overAllScore: { type: Number },
    sectionScore: { type: Number },
    status: { type: Boolean, default: false },
    gradeJLPT: { type: String, enum: ["A", "B", "C"] },
    grade: { type: String, enum: ["A1", "A2", "B1", "B2", "C1"] },
  },
  { timestamps: true },
);

export default mongoose.model("Results", resultSchema);
