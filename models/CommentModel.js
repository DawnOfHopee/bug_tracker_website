const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      maxlength: 500,
    },
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "issue",
    },
    createdBy: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  { timestamps: true }
);

const CommentModel = mongoose.model("comment", commentSchema);

module.exports = CommentModel;
