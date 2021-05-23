var express = require("express");
const CommentController = require("../controllers/CommentController");
const {
  requireUserAuth,
  requireAdminAuth,
  requireAuth,
} = require("../middleware/authMiddleware");
var router = express.Router();

router.post("/add", requireAuth, CommentController.add);
router.post("/update", requireAuth, CommentController.updateComment);
router.post("/delete", requireAuth, CommentController.deleteComment);
module.exports = router;
