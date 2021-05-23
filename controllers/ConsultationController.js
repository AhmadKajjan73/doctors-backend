const Consultation = require("../models/ConsultationModel");

const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");

const apiResponse = require("../helpers/apiResponse");

/*
    title: { type: String, required: true },
    imageurl: { type: String, require: true },
    numberOfViewers: { type: Number, required: true },
    authorId: { type: String, required: true },
    body: { type: String, required: true },
    tags: [{ type: String, required: true }],
*/

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
  async (req, res) => {
    try {
      const consultationData = JSON.parse(req.body.consultation);

      const consultation = new Consultation({
        userId: consultationData.userId,
        question: consultationData.question,
        diseaseHistory: consultationData.diseaseHistory,
        replay: null,
        replayedBy: null,
      });
      consultation.save((err) => {
        if (err) return apiResponse.ErrorResponse(res, err);
        const consultationInfo = {
          id: consultation._id,
          question: consultation.question,
          diseaseHistory: consultation.diseaseHistory,
          replay: consultation.replay,
          replayedBy: consultation.replayedBy,
          createdAt: consultation.createdAt,
          updatedAt: consultation.updatedAt,
        };
        return apiResponse.successResponseWithData(
          res,
          "Consultation added successfully.",
          consultationInfo
        );
      });
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

exports.replayTo = [
  upload.none(),
  async (req, res) => {
    try {
      const replayData = JSON.parse(req.body.replay);
      console.log();
      Consultation.findByIdAndUpdate(
        replayData.id,
        {
          replay: replayData.replay,
          replayedBy: replayData.replayedBy,
          replayedAt: new Date(),
        },
        { new: false }
      ).then(() => {
        Consultation.find({})
          .populate("userId replayedBy")
          .then((consultations) => {
            return apiResponse.successResponseWithData(
              res,
              "All Consultation returned successfully.",
              consultations.sort((a, b) => {
                if (!a.replay && b.replay) return -1;
                if (a.replay && !b.replay) return 1;
                if (a.createdAt < b.createdAt) return 1;
                if (a.createdAt > b.createdAt) return -1;
                return 0;
              })
            );
          });
      });
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

exports.getAllConsultationOfUser = [
  upload.none(),
  (req, res) => {
    try {
      Consultation.find({ userId: req.params.id })
        .populate("userId replayedBy")
        .then((consultations) => {
          return apiResponse.successResponseWithData(
            res,
            "All Consultation returned successfully.",
            consultations.sort((a, b) => {
              return a.createdAt - b.createdAt;
            })
          );
        });
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

exports.getAllConsultation = [
  upload.none(),
  (req, res) => {
    try {
      Consultation.find({})
        .populate("userId replayedBy")
        .then((consultations) => {
          return apiResponse.successResponseWithData(
            res,
            "All Consultation returned successfully.",
            consultations.sort((a, b) => {
              if (!a.replay && b.replay) return -1;
              if (a.replay && !b.replay) return 1;
              if (a.createdAt > b.createdAt) return 1;
              if (a.createdAt < b.createdAt) return -1;
              return 0;
            })
          );
        });
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
