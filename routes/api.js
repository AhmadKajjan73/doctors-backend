var express = require("express");
var userRouter = require("./user");
var productRouter = require("./product");
var bidOfferRouter=require("./bidOffer");
var app = express();

app.use("/user/", userRouter);
app.use("/product/", productRouter);
app.use("/bidoffer/",bidOfferRouter);
module.exports = app;