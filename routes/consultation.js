var express = require("express");
const ConsultationController = require("../controllers/ConsultationController");
const {
  requireUserAuth,
  requireAdminAuth,
} = require("../middleware/authMiddleware");
var router = express.Router();

router.post("/add", requireUserAuth, ConsultationController.add);

router.post("/replayto", requireAdminAuth, ConsultationController.replayTo);

router.get(
  "/getAllConsultationOfUser/:id",
  requireUserAuth,
  ConsultationController.getAllConsultationOfUser
);
router.get(
  "/getAllConsultation/",
  requireAdminAuth,
  ConsultationController.getAllConsultation
);
module.exports = router;
