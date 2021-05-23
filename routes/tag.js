var express = require("express");
const TagController = require("../controllers/TagController");

var router = express.Router();
const { requireAdminAuth } = require("../middleware/authMiddleware");

router.post("/add", requireAdminAuth, TagController.add);
router.post("/update", requireAdminAuth, TagController.update);

router.get("/getTagById/:id", TagController.getTagById);
router.get("/getAllTagsByUserId/:id", TagController.getAllTagsByUserId);
router.get(
  "/getAllTagsWithStringInIt/:searchBy",
  TagController.getAllTagsWithStringInIt
);

router.get("/getAllTags", TagController.getAllTags);

module.exports = router;
