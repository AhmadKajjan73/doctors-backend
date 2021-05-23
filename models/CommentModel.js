var mongoose = require("mongoose");

const Schema = mongoose.Schema;

var CommentSchema = new Schema(
  {
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    body: { type: String, required: true },
  },
  { timestamps: true }
);

// Virtual for user's full name

module.exports = mongoose.model("Comment", CommentSchema);
