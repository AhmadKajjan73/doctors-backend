var express = require("express");
const ProductController = require("../controllers/ProductController");

var router = express.Router();

router.get("/search/:id/:search", ProductController.prodcutList);
router.get("/userproducts/:id", ProductController.prodcutListForUser);
router.get("/:id", ProductController.prodcutDetail);
router.post("/store", ProductController.productStore);
router.get("/sold/:id", ProductController.productSold);


module.exports = router;    