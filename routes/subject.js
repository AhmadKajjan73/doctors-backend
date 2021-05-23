var express = require("express");
const SubjectController = require("../controllers/SubjectController");
const { requireAdminAuth } = require("../middleware/authMiddleware");
var router = express.Router();

router.post("/add", requireAdminAuth, SubjectController.add);
router.post("/update", requireAdminAuth, SubjectController.updateSubject);
router.post("/delete", requireAdminAuth, SubjectController.deleteSubject);

router.get("/getSubjectById/:id", SubjectController.getSubjectById);
router.get(
  "/getSubjectByIdAfterAddingViewer/:id",
  SubjectController.getSubjectByIdAfterAddingViewer
);
router.get("/getSubjectsByTagId/:id", SubjectController.getSubjectsByTagId);
router.get(
  "/getSubjectsByAuthorId/:id",
  SubjectController.getSubjectsByAuthorId
);
router.get("/getAllSubjects/", SubjectController.getAllSubjects);

module.exports = router;
