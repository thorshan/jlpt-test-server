import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    refText: { type: String },
    text: { type: String },
    options: {
      type: [String],
      validate: {
        validator: function (v: any) {
          return v.length >= 2;
        },
        message: "A question must have at least 2 options.",
      },
      required: true,
    },
    correctOptionIndex: {
      type: Number,
      required: true,
      min: 0,
    },
    module: {
      type: String,
      enum: [
        "Module 1",
        "Module 2",
        "Module 3",
        "Module 4",
        "Module 5",
        "Module 6",
      ],
    },
    category: {
      type: String,
      enum: ["Vocabulary", "Grammar", "Kanji", "Reading", "Listening"],
    },
    point: { type: Number, default: 1 },
    refImage: {
      type: String,
    },
    refAudio: {
      type: String,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tags: { type: [String], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model("Question", questionSchema);
