var express = require("express");
const BidOfferController = require("../controllers/BidOfferController");

var router = express.Router();

router.get("/maxBidOffer/:product", BidOfferController.maxBidOffer);
router.post("/bidfor", BidOfferController.bidFor);
//router.get("/getbidforproduct/:product",BidOfferController.getBidList);
module.exports = router;