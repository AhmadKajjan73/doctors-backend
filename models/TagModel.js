var mongoose = require("mongoose");

const Schema = mongoose.Schema;

var TagSchema = new Schema(
  {
    name: { type: String, required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Virtual for user's full name

module.exports = mongoose.model("Tag", TagSchema);
