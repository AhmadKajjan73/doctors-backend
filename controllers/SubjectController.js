const Subject = require("../models/SubjectModel");
const Tag = require("../models/TagModel");
const User = require("../models/UserModel");
const Comment = require("../models/CommentModel");

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
  upload.single("subjectMainPhoto"),
  async (req, res) => {
    try {
      const subjectData = JSON.parse(req.body.subject);
      let image = req.file.filename;
      const subject = new Subject({
        title: subjectData.title,
        imageurl: image,
        numberOfViewers: 0,
        authorId: subjectData.authorId,
        body: subjectData.body,
        tags: subjectData.tags,
      });
      subject.save((err) => {
        if (err) return apiResponse.ErrorResponse(res, err);
        const subjectInfo = {
          id: subject._id,
          title: subject.title,
          imageurl: subject.imageurl,
          numberOfViewers: subject.numberOfViewers,
          body: subject.body,
          tags: subject.tags,
          createdAt: subject.createdAt,
          updatedAt: subject.updatedAt,
        };
        return apiResponse.successResponseWithData(
          res,
          "Subject added successfully.",
          subjectInfo
        );
      });
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

exports.getSubjectsByTagId = [
  (req, res) => {
    try {
      Subject.find({ tags: req.params.id }).then((subjects) => {
        return apiResponse.successResponseWithData(
          res,
          "All subjects returned successfully.",
          subjects
        );
      });
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
exports.getSubjectsByAuthorId = [
  (req, res) => {
    try {
      Subject.find({ authorId: req.params.id }).then((subjects) => {
        return apiResponse.successResponseWithData(
          res,
          "All subjects returned successfully.",
          subjects
        );
      });
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
exports.getAllSubjects = [
  (req, res) => {
    try {
      Subject.find()
        .populate("tags authorId")
        .then((subjects) => {
          return apiResponse.successResponseWithData(
            res,
            "All subjects returned successfully.",
            subjects.sort((a, b) => {
              return b.numberOfViewers - a.numberOfViewers;
            })
          );
        });
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
exports.getSubjectById = [
  (req, res) => {
    try {
      Subject.findById(req.params.id)
        .populate("tags authorId")
        .then((subject) => {
          Comment.find({ subject: subject._id })
            .populate("author")
            .then((comments) => {
              comments.sort((a, b) => {
                return a.createdAt - b.createdAt;
              });
              const subjectData = {
                id: subject._id,
                title: subject.title,
                imageurl: subject.imageurl,
                numberOfViewers: subject.numberOfViewers,
                authorId: subject.authorId,
                body: subject.body,
                tags: subject.tags,
                createdAt: subject.createdAt,
                updatedAt: subject.updatedAt,
                comments,
              };
              return apiResponse.successResponseWithData(
                res,
                "All subjects returned successfully.",
                subjectData
              );
            });
        });
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
exports.getSubjectByIdAfterAddingViewer = [
  (req, res) => {
    try {
      Subject.findById(req.params.id).then((subject) => {
        Subject.findByIdAndUpdate(
          subject._id,
          {
            numberOfViewers: subject.numberOfViewers + 1,
          },
          { new: true }
        )
          .populate("tags authorId")
          .then((updatedSubject) => {
            Comment.find({ subject: updatedSubject._id })
              .populate("author")
              .then((comments) => {
                const subjectData = {
                  id: updatedSubject._id,
                  title: updatedSubject.title,
                  imageurl: updatedSubject.imageurl,
                  numberOfViewers: updatedSubject.numberOfViewers,
                  authorId: updatedSubject.authorId,
                  body: updatedSubject.body,
                  tags: updatedSubject.tags,
                  createdAt: updatedSubject.createdAt,
                  updatedAt: updatedSubject.updatedAt,
                  comments,
                };
                return apiResponse.successResponseWithData(
                  res,
                  "All subjects returned successfully.",
                  subjectData
                );
              });
          });
      });
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

exports.updateSubject = [
  upload.single("subjectMainPhoto"),

  async (req, res) => {
    try {
      const subjectData = JSON.parse(req.body.subject);
      if (subjectData.id && req.file) {
        const existSubject = await Subject.findById(subjectData.id);
        if (existSubject) {
          const path = "public/images/" + existSubject.imageurl;
          fs.unlinkSync(path);
        }
      }
      let image;
      if (req.file) image = req.file.filename;
      else image = subjectData.imageurl;
      console.log(image);
      Subject.findByIdAndUpdate(subjectData.id, {
        title: subjectData.title,
        imageurl: image,
        body: subjectData.body,
        tags: subjectData.tags,
      })
        .populate("authorId")
        .then((subject) => {
          return apiResponse.successResponseWithData(
            res,
            "Subject updated successfully.",
            subject
          );
        });
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

exports.deleteSubject = [
  upload.none(),

  async (req, res) => {
    try {
      const subjectData = JSON.parse(req.body.subject);

      if (subjectData.id) {
        const existSubject = await Subject.findById(subjectData.id);
        if (existSubject) {
          const path = "public/images/" + existSubject.imageurl;
          fs.unlinkSync(path);
        }
      }
      Subject.findByIdAndRemove(subjectData.id).then((subject) => {
        return apiResponse.successResponseWithData(
          res,
          "Subject deleted successfully.",
          subject
        );
      });
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
