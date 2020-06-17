const BidOffer = require("../models/BidOffer");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// Book Schema
function BidOfferData(data) {
	this.id = data._id;
	this.product= data.product;
	this.offeredPrice = data.offeredPrice;
	this.user = data.user;
}


exports.maxBidOffer =[
	function (req, res) {
		try {
			BidOffer.find({product:req.params.product}).sort(offeredPrice,1).run(function(error,maxOffer){
				console.log(maxOffer);
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}];

	exports.bidFor = [
		(req, res) => {
			try {
				const errors = validationResult(req);
				var bidfor = new BidOffer(
					{ 
						user: req.body.user,
						product:req.body.product,
						offeredPrice: req.body.offeredPrice,
					});
				console.log(bidfor);
				if (!errors.isEmpty()) {
					return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
				}
				else {
					bidfor.save(function (err) {
						if (err) { return apiResponse.ErrorResponse(res, err); }
						let bidforData = new BidOfferData(bidfor);
						return apiResponse.successResponseWithData(res,"product add Success.", bidforData);
					});
				}
			} catch (err) {
				//throw error in json response with status 500. 
				return apiResponse.ErrorResponse(res, err);
			}
		}
	];

	/*
	exports.getBidList = [
		function (req, res) {
		   try {
			   BidOffer.find({product:req.params.product}).populate("product").then((offers)=>{
				   if(offers.length > 0){
					   return apiResponse.successResponseWithData(res, "Operation success", offers);
				   }else{
					   return apiResponse.successResponseWithData(res, "Operation success", []);
				   }
			   });
		   } catch (err) {
			   //throw error in json response with status 500. 
			   return apiResponse.ErrorResponse(res, err);
		   }
	   }
   ];*/
   