var mongoose = require("mongoose");

const Schema = mongoose.Schema;

var UserRateSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rate: { type: Number, required: true },
  },
  { timestamps: true }
);

// Virtual for user's full name

module.exports = mongoose.model("UserRate", UserRateSchema);
