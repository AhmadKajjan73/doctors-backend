const User = require("../models/UserModel");
const apiResponse = require("../helpers/apiResponse");
var Cookies = require("cookies");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
var multer = require("multer");
const jwt = require("jsonwebtoken");
const fs = require("fs");
require("dotenv").config();

const maxAge = 60 * 60 * 24;
const defaultUserImage = "default_user.jpg";

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, (err, raw) => {
      let ext;
      switch (file.mimetype) {
        case "image/jpeg":
          ext = ".jpeg";
          break;
        case "image/png":
          ext = ".png";
          break;
        case "image/jpg":
          ext = ".jpg";
          break;
      }

      cb(null, raw.toString("hex") + ext);
    });
  },
});

var upload = multer({ storage: storage });

exports.register = [
  upload.single("profilePhoto"),

  async (req, res) => {
    try {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Display sanitized values/errors messages.
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        const userData = JSON.parse(req.body.user);
        const existUser = await User.findOne({ email: userData.email });
        if (existUser) {
          if (existUser.profilePhoto !== defaultUserImage) {
            const path = "public/images/" + req.file.filename;
            fs.unlinkSync(path);
          }
          return apiResponse.ErrorResponse(res, "User is already exists");
        }
        let image = defaultUserImage;
        if (req.file && req.file.filename) image = req.file.filename;

        //hash input password
        bcrypt.hash(userData.password, 10, function (err, hash) {
          var user = new User({
            firstName: userData.firstName,
            lastName: userData.lastName,
            password: hash,
            phoneNumber: userData.phoneNumber,
            email: userData.email,
            age: userData.age,
            gender: userData.gender,
            usertype: userData.usertype,
            profilePhoto: image,
          });
          // Html email body
          // Send confirmation email

          // Save user.
          user.save(function (err) {
            if (err) {
              return apiResponse.ErrorResponse(res, err.name);
            }

            const userInfo = {
              id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              phoneNumber: user.phoneNumber,
              email: user.email,
              age: user.age,
              usertype: user.usertype,
              profilePhoto: user.profilePhoto,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
            };

            const token = jwt.sign(userInfo, process.env.JWT_SECRET, {
              expiresIn: maxAge,
            });

            res.cookie("id_token", token, {
              maxAge: maxAge * 1000,
              httpOnly: true,
              secure: true,
              sameSite: "none",
            });

            return apiResponse.successResponseWithData(
              res,
              "Registration Success.",
              userInfo
            );
          });
        });
      }
    } catch (err) {
      //throw error in json response with status 500.

      return apiResponse.ErrorResponse(res, err);
    }
  },
];

exports.login = [
  upload.none(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        const userData = JSON.parse(req.body.user);
        User.findOne({ email: userData.email }).then((user) => {
          if (user) {
            //Compare given password with db's hash.d
            bcrypt.compare(
              userData.password,
              user.password,
              function (err, same) {
                if (same) {
                  let userInfo = {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    age: user.age,
                    usertype: user.usertype,
                    profilePhoto: user.profilePhoto,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                  };
                  //Prepare JWT token for authentication
                  const token = jwt.sign(userInfo, process.env.JWT_SECRET, {
                    expiresIn: maxAge,
                  });
                  const cookies = new Cookies(req, res);
                  console.log(token);
                  const options = {
                    maxAge: maxAge * 1000,
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                  };

                  cookies.set("id_token", value, options);
                  return apiResponse.successResponseWithData(
                    res,
                    "Login Success.",
                    userInfo
                  );
                } else {
                  return apiResponse.unauthorizedResponse(
                    res,
                    "Email or Password wrong."
                  );
                }
              }
            );
          } else {
            return apiResponse.unauthorizedResponse(
              res,
              "Email or Password wrong."
            );
          }
        });
      }
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

exports.updateUserProfile = [
  body("email")
    .isEmail()
    .isLength({ min: 1 })
    .trim()
    .withMessage("Email must be specified."),
  body("password")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Password must be specified."),
  sanitizeBody("email").escape(),
  sanitizeBody("password").escape(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        User.findOne({ email: req.body.email }).then((user) => {
          if (user) {
            //Compare given password with db's hash.d
            bcrypt.compare(
              req.body.password,
              user.password,
              function (err, same) {
                if (same) {
                  let userData = {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    age: user.age,
                    usertype: user.usertype,
                    token: user.token,
                    profilePhoto: user.profilePhoto,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                  };
                  //Prepare JWT token for authentication
                  return apiResponse.successResponseWithData(
                    res,
                    "Login Success.",
                    userData
                  );
                } else {
                  return apiResponse.unauthorizedResponse(
                    res,
                    "Email or Password wrong."
                  );
                }
              }
            );
          } else {
            return apiResponse.unauthorizedResponse(
              res,
              "Email or Password wrong."
            );
          }
        });
      }
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

exports.logout = [
  (req, res) => {
    res.cookie("id_token", "", { maxAge: 1 });
    apiResponse.successResponse(res, "logged out successfully");
  },
];
