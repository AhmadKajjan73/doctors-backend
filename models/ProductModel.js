var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
	productName: {type: String, required: true},
	initialPrice: {type: Number, required: true},
	maxOfferedPrice:{type:Number,required:false},
	isSold: {type: Boolean, required: true},
	user: { type: Schema.ObjectId, ref: "User", required: true },
	bidOffers:[{
		type:Schema.Types.ObjectId,
		ref:"BidOffer"
	}]
}, {timestamps: true});

module.exports = mongoose.model("Product", ProductSchema);