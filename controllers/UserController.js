const UserModel = require("../models/UserModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
//helper file to prepare responses.
const apiResponse = require("../helpers/apiResponse");
const utility = require("../helpers/utility");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require("../helpers/mailer");
const { constants } = require("../helpers/constants");
const ProductModel = require("../models/ProductModel");
const BidOfferModel=require("../models/BidOffer");

exports.register = [
	// Validate fields.
body("userName").isLength({ min: 1 }).trim().withMessage("First name must be specified.")
		.isAlphanumeric().withMessage("First name has non-alphanumeric characters.")
		.custom((value) => {
			return UserModel.findOne({userName : value}).then((user) => {
				if (user) {
					return Promise.reject("User Name already in use");
				}
			});
		}),
	body("password").isLength({ min: 6 }).trim().withMessage("Password must be 6 characters or greater."),
	// Sanitize fields.
	sanitizeBody("userName").escape(),
	sanitizeBody("password").escape(),
	// Process request after validation and sanitization.
	(req, res) => {
		try {
			// Extract the validation errors from a request.
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				// Display sanitized values/errors messages.
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				//hash input password
				bcrypt.hash(req.body.password,10,function(err, hash) {
					
					var user = new UserModel(
						{
							userName: req.body.userName,
							phoneNumber: req.body.phoneNumber,
							password: hash,
							login: false,
						}
					);
					// Html email body
					// Send confirmation email
						
						// Save user.
						user.save(function (err) {
							if (err) { return apiResponse.ErrorResponse(res, err); }
							let userData = {
								_id: user._id,
								userName: user.userName,
								phoneNumber: user.phoneNumber,
							};
							return apiResponse.successResponseWithData(res,"Registration Success.", userData);
						});
				});
			}
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}];

exports.login = [
	body("userName").isLength({ min: 1 }).trim().withMessage("userName must be specified."),
	body("password").isLength({ min: 1 }).trim().withMessage("Password must be specified."),
	sanitizeBody("userName").escape(),
	sanitizeBody("password").escape(),
	async(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				 UserModel.findOne({userName : req.body.userName}).then(user => {
					
					if (user) {
						//Compare given password with db's hash.d
						console.log(user);
						bcrypt.compare(req.body.password,user.password,function (err,same) {
							if(same){
											let userData = {
												_id: user._id,
												userName: user.userName,
												phoneNumber: user.phoneNumber,
												products: user.products,
											};
											//Prepare JWT token for authentication
											return apiResponse.successResponseWithData(res,"Login Success.", userData);
								}else{
									return apiResponse.unauthorizedResponse(res, "UserName or Password wrong.");
								}
						});
					}else{
						return apiResponse.unauthorizedResponse(res, "UserName or Password wrong.");
					}
				});
		
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];
