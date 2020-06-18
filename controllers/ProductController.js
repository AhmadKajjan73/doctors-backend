const Product = require("../models/ProductModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
var mongoose = require("mongoose");
const BidOffer = require("../models/BidOffer");
mongoose.set("useFindAndModify", false);

// Book Schema
function ProductData(data) {
	this.id = data._id;
	this.productName= data.productName;
	this.initialPrice = data.initialPrice;
	this.isSold = data.isSold;
	this.user = data.user;
	this.bidOffers = data.bidOffers;
	this.maxOfferedPrice=data.maxOfferedPrice;
}

/**
 * Book List.
 * 
 * @returns {Object}
 */
exports.prodcutList = [
	function (req, res) {
		try {
			console.log(req.params.id);
			Product.find({productName:{$regex : ".*"+req.params.search+".*"},isSold:false,user:{$ne: req.params.id}}).populate("user","userName").then( async(products)=>{
				if(products.length > 0){
					for(var element in products){
						console.log(element);
						const bidForOneproduct=await BidOffer.find({product:products[element]._id}).sort('-offeredPrice').populate("user","userName").populate("product","productName").then(resp=>{
							console.log(resp);
							products[element].bidOffers=resp;
							if(products[element].bidOffers!==[])
								products[element].maxOfferedPrice=products[element].bidOffers[0].offeredPrice;		
						});
					}
					return apiResponse.successResponseWithData(res, "Operation success", products);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", []);
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];/*
ProductModel.find({user:user._id}).then(products=>{
	user.products=products;
	 user.products.forEach( async function(element){
		const bidForOneproduct=await BidOfferModel.find({product:element._id}).populate("user","userName").then(resp=>{
			console.log(resp);
			element.bidOffers=resp;
		});
	});*/
exports.prodcutListForUser = [
	 function (req, res) {
		try {
			Product.find({user:req.params.id}).populate("user").then(async (products)=>{
				if(products.length > 0){
					for(var element in products){
						const bidForOneproduct= await BidOffer.find({product:products[element]._id}).sort('-offeredPrice').populate("user","userName").populate("product","productName").then(resp=>{
						console.log(resp);
							products[element].bidOffers=resp;	
							if(products[element].bidOffers!==[])
								products[element].maxOfferedPrice=products[element].bidOffers[0].offeredPrice;
						});
						console.log(products[element].bidOffers);
					}
					return apiResponse.successResponseWithData(res, "Operation success", products);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", []);
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];



exports.prodcutDetail = [
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, "Operation success", {});
		}
		try {
			Product.findOne({_id: req.params.id}).then((product)=>{                
				if(product !== null){
					const x=BidOffer.find({product:element._Id}).then(item=>{
						element.bidOffers=item;});
					let productData = new ProductData(product);
					return apiResponse.successResponseWithData(res, "Operation success", productData);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", {});
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

exports.productStore = [
	body("productName", "productName must not be empty.").isLength({ min: 1 }).trim(),
	body("initialPrice", "initialPrice must not be empty.").isLength({ min: 1 }).trim(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var product = new Product(
				{ productName: req.body.productName,
					user: req.body.user,
					initialPrice: req.body.initialPrice,
					maxOfferedPrice:req.body.initialPrice,
					isSold: false
				});
			console.log(product);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				//Save book.
				product.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let productData = new ProductData(product);
					return apiResponse.successResponseWithData(res,"product add Success.", productData);
				});
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

exports.productSold = [
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, "Operation success", {});
		}
		try {
			Product.findOneAndUpdate({_id: req.params.id},{isSold:true}).then((product)=>{                
				if(product !== null){
					productData=new ProductData(product);
					return apiResponse.successResponseWithData(res, "Operation success", productData);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", {});
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];
