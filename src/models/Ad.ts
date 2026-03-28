import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required."],
    },
    image: {
      type: String,
      required: [true, "Image is required."],
    },
    duration: {
      type: Number,
      default: 1, // Duration in months
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index for automatic deletion via cleanup job or TTL
// If we want to use TTL: adSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// But we need to delete the file too, so we'll use a custom cleanup job instead.

export default mongoose.model("Ad", adSchema);
