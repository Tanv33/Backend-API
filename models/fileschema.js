import mongoose from "mongoose";

const files = mongoose.model("files", {
  userId: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  created: { type: Date, default: Date.now },
});

export default files;
