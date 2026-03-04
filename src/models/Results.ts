import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    level: {
      type: String,
      enum: ["N1", "N2", "N3", "N4", "N5"],
      required: true,
    },
    // Detailed breakdown per section
    sectionDetails: [
      {
        sectionTitle: String,
        earnedPoints: Number,
        totalPoints: Number,
        gradeJLPT: { type: String, enum: ["A", "B", "C"] },
        passed: { type: Boolean, default: false }, // Did they hit the minPassedMark?
      },
    ],
    // Overall Stats
    totalEarnedPoints: { type: Number, required: true },
    totalPossiblePoints: { type: Number, required: true }, // The 180 (or 170) points total

    // Final Status: True only if (totalPoints >= passingScore) AND (all sections passed)
    status: {
      type: Boolean,
      default: false,
    },

    // Grades
    gradeJLPT: {
      type: String,
      enum: ["A", "B", "C"],
      description: "Overall JLPT grade",
    },
    grade: {
      type: String,
      enum: ["A1", "A2", "B1", "B2", "C1"],
      description: "Overall CEFR-style proficiency grade",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Results", resultSchema);
