var express = require("express");
const AdmController = require("../controllers/AdmController");

var router = express.Router();

router.post("/testid3", AdmController.testId3);
router.post("/testbayes", AdmController.testBayes);

module.exports = router;
