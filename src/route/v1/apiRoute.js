const express = require("express");

const route = express.Router();

route.use("/user",require("./userRoute"));




module.exports = route;