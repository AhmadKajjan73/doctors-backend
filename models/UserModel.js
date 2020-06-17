var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var UserSchema = new mongoose.Schema({
	userName: {type: String, required: true},
	phoneNumber: {type: String, required: true},
	password: {type: String, required: true},
	login: {type: Boolean, required: true, default: 0},
	products:[{
		type:Schema.Types.ObjectId,
		ref:"Product"
	}]
}, {timestamps: true});

// Virtual for user's full name

module.exports = mongoose.model("User", UserSchema);