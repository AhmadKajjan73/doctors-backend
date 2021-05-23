var mongoose = require("mongoose");

const Schema = mongoose.Schema;

var ConsultationSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    question: { type: String, required: true },
    diseaseHistory: { type: String, required: true },
    replay: { type: String, require: false },
    replayedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    replayedAt: { type: Date, require: "false" },
  },
  { timestamps: true }
);

// Virtual for user's full name

module.exports = mongoose.model("Consultation", ConsultationSchema);
