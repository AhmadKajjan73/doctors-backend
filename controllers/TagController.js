const Tag = require("../models/TagModel");
const User = require("../models/UserModel");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
//helper file to prepare responses.
const apiResponse = require("../helpers/apiResponse");

const bcrypt = require("bcrypt");
const crypto = require("crypto");
var multer = require("multer");

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

exports.add = [
  upload.none(),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Display sanitized values/errors messages.
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        const tagData = JSON.parse(req.body.tag);
        console.log(tagData);
        const tag = new Tag({
          name: tagData.name,
          addedBy: tagData.addedBy,
        });
        tag.save((err) => {
          if (err) return apiResponse.ErrorResponse(res, err.message);
          User.findOne({ _id: tag.addedBy }).then((user) => {
            console.log(user);
            const userInfo = {
              id: user._id,
              name: user.firstName + " " + user.lastName,
              profilePhoto: user.profilePhoto,
            };
            const tagInfo = {
              id: tag._id,
              name: tag.name,
              userInfo: userInfo,
            };
            return apiResponse.successResponseWithData(
              res,
              "tag added Successfully.",
              tagInfo
            );
          });
        });
      }
    } catch (err) {
      return apiResponse.ErrorResponse(res, err.message);
    }
  },
];

exports.update = [
  upload.none(),
  (req, res) => {
    try {
      const tagData = JSON.parse(req.body.tag);

      Tag.findByIdAndUpdate(
        tagData._id,
        {
          name: tagData.name,
          addedBy: tagData.addedBy,
        },
        {
          upsert: false,
        }
      )
        .populate("addedBy")
        .then((tagInfo) => {
          return apiResponse.successResponseWithData(
            res,
            "tag updated Successfully.",
            tagInfo
          );
        });
    } catch (err) {
      return apiResponse.ErrorResponse(res, err.message);
    }
  },
];

exports.getAllTagsWithStringInIt = [
  async (req, res) => {
    try {
      const tags = await Tag.find({
        name: { $regex: req.params.searchBy, $options: "i" },
      }).then((tags) => {
        return tags;
      });
      console.log(tags);
      return apiResponse.successResponseWithData(res, "sucessed", tags);
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
exports.getTagById = [
  async (req, res) => {
    try {
      const tag = await Tag.findOne({ _id: req.params.id }).then((tag) => {
        return tag;
      });
      const userInfo = await User.findOne({ _id: tag.addedBy }).then((user) => {
        return {
          id: user._id,
          name: user.firstName + " " + user.lastName,
          profilePhoto: user.profilePhoto,
        };
      });
      const tagData = {
        id: tag._id,
        name: tag.name,
        userInfo: userInfo,
      };
      return apiResponse.successResponseWithData(res, "sucessed", tagData);
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
exports.getAllTagsByUserId = [
  async (req, res) => {
    try {
      const tags = await Tag.find({ addedBy: req.params.id });
      console.log(tags);
      const userInfo = await User.findOne({ _id: req.params.id }).then(
        (user) => {
          return {
            id: user._id,
            name: user.firstName + " " + user.lastName,
            profilePhoto: user.profilePhoto,
          };
        }
      );
      const allData = { tagsData: tags, userInfo: userInfo };
      return apiResponse.successResponseWithData(res, "successed", allData);
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

exports.getAllTags = [
  async (req, res) => {
    try {
      const tags = await Tag.find();

      const allData = tags;
      return apiResponse.successResponseWithData(res, "successed", allData);
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
