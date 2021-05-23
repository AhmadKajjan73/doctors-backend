var mongoose = require("mongoose");

const Schema = mongoose.Schema;

var SubjectRateSchema = new Schema(
  {
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rate: { type: Number, required: true },
  },
  { timestamps: true }
);

// Virtual for user's full name

module.exports = mongoose.model("SubjectRate", SubjectRateSchema);
