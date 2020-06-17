var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var BidOfferSchema = new Schema({
    offeredPrice: {type: Number, required: true},
    user: { type: Schema.ObjectId, ref: "User", required: true },
    product: { type: Schema.ObjectId, ref: "Product", required: true }
}, {timestamps: true});

module.exports = mongoose.model("BidOffer", BidOfferSchema);