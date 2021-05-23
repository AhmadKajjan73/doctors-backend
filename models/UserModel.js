var mongoose = require("mongoose");

const Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    usertype: { type: Number, required: true },
    profilePhoto: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Virtual for user's full name

module.exports = mongoose.model("User", UserSchema);
