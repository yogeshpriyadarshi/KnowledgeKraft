const express = require("express");
const { userSignup, userProfile, userLogin, viewAllUser, userLogout } = require("../../controller/userController");
const { checkUser, checkAdmin } = require("../../middleware/authMiddleware");

const route = express.Router();

route.post("/signup", userSignup);

route.post("/login", userLogin);

route.post("/logout",userLogout);

route.get("/profile",checkUser, userProfile);

route.get("/viewAll",checkUser, checkAdmin,viewAllUser);


module.exports =route;
