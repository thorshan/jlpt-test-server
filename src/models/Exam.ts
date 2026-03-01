import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      enum: ["N1", "N2", "N3", "N4", "N5"],
      required: true,
    },
    title: { type: String, required: true },
    desc: { type: String },
    sections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Section" }],
    passingScore: { type: Number, default: 80 },
  },
  { timestamps: true },
);

export default mongoose.model("Exam", examSchema);
