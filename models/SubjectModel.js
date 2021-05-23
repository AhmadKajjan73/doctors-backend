var mongoose = require("mongoose");

const Schema = mongoose.Schema;

var SubjectSchema = new Schema(
  {
    title: { type: String, required: true },
    imageurl: { type: String, require: true },
    numberOfViewers: { type: Number, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    body: { type: String, required: true },
    tags: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
      required: true,
    },
  },
  { timestamps: true }
);

// Virtual for user's full name

module.exports = mongoose.model("Subject", SubjectSchema);
