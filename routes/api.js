var express = require("express");
var userRouter = require("./user");
var tagRouter = require("./tag");
var admRouter = require("./adm");
var subjectRouter = require("./subject");
var conulationRouter = require("./consultation");
var commentRouter = require("./comment");
const { checkUser } = require("../middleware/authMiddleware");

var app = express();

app.use("/user/", userRouter);
app.use("/tag/", tagRouter);
app.use("/subject/", subjectRouter);
app.use("/consultation/", conulationRouter);
app.use("/comment/", commentRouter);
app.use("/adm/", admRouter);
app.get("/getCurrentUser", checkUser);
module.exports = app;
