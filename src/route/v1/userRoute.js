const express = require("express");
const { userSignup, userProfile, userLogin } = require("../../controller/userController");
const { checkUser } = require("../../middleware/authMiddleware");

const route = express.Router();

route.post("/signup", userSignup);

route.post("/login", userLogin);

route.get("/profile",checkUser, userProfile);


module.exports =route;
