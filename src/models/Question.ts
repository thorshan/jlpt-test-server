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
        "Kanji Reading",
        "Orthography",
        "Word Formation",
        "Paraphrases",
        "Contextually Defined Expression",
        "Usage",
        "Selecting Grammar Form",
        "Sentence Composition",
        "Text Grammar",
        "Short Passage",
        "Mid Passage",
        "Long Passage",
        "Integrated Reading Comprehension",
        "Thematic Comprehension",
        "Information Retrieval",
        "Text-Based Comprehension",
        "Keypoints Comprehension",
        "General Outline Comprehension",
        "Verbal Expression",
        "Quick Response",
        "Integrated Listening Comprehension",
      ],
    },
    category: {
      type: String,
      enum: ["Moji_Goi", "Grammar", "Reading", "Listening"],
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
