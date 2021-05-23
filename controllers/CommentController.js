const Comment = require("../models/CommentModel");
const User = require("../models/UserModel");
const Subject = require("../models/SubjectModel");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
//helper file to prepare responses.
const apiResponse = require("../helpers/apiResponse");

const bcrypt = require("bcrypt");
const crypto = require("crypto");
var multer = require("multer");
const jwt = require("jsonwebtoken");
const fs = require("fs");
require("dotenv").config();

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
      const commentData = JSON.parse(req.body.comment);

      const comment = new Comment({
        subject: commentData.subject,
        body: commentData.body,
        author: commentData.author,
      });
      comment.save((err) => {
        if (err) {
          console.log(err);
          return apiResponse.ErrorResponse(res, err);
        }

        return apiResponse.successResponse(res, "Comment added Successfully.");
      });
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
exports.updateComment = [
  upload.none(),
  async (req, res) => {
    const comment = JSON.parse(req.body.comment);
    try {
      Comment.findByIdAndUpdate(comment.id, {
        body: comment.body,
      }).then((comment) => {
        return apiResponse.successResponse(
          res,
          "Comment updated successfully."
        );
      });
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

exports.deleteComment = [
  upload.none(),
  async (req, res) => {
    const comment = JSON.parse(req.body.comment);

    try {
      Comment.findByIdAndRemove(comment._id).then((comment) => {
        return apiResponse.successResponse(
          res,
          "Comment deleted successfully."
        );
      });
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
