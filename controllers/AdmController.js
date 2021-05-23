const AdmFunctions = require("../helpers/AdmFunctions");
const data = require("../models/ID3Model");
const apiResponse = require("../helpers/apiResponse");
const _ = require("lodash");

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

const idTree = AdmFunctions.id3(data.examples, data.target, data.features);

exports.testId3 = [
  upload.none(),
  (req, res) => {
    const query = JSON.parse(req.body.query);
    let node = idTree;
    while (node.type !== "result") {
      if (node.type === "feature") {
        if (_.isNumber(query[node.name])) {
          let diff = 10000000,
            idx;
          for (let i = 0; i < node.vals.length; i++) {
            const currentDiff = Math.abs(node.vals[i].name - query[node.name]);
            if (diff > currentDiff) (diff = currentDiff), (idx = i);
          }

          node = node.vals[idx].child;
        } else {
          node = _.filter(node.vals, (a) => {
            return a.name === query[node.name];
          })[0].child;
        }
      }
    }

    return apiResponse.successResponseWithData(res, "test", node.val);
  },
];

exports.testBayes = [
  upload.none(),
  (req, res) => {
    let query = JSON.parse(req.body.query);
    console.log(query);
    const ans = AdmFunctions.bayes(
      data.examples,
      data.target,
      data.features,
      query
    );

    return apiResponse.successResponseWithData(res, "test", ans);
  },
];
