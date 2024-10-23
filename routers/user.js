const express= require("express");
const wrapasync = require("../utils/wrapasync");
const router= express.Router();
const user= require("../models/user.js");
const passport = require("passport");
const { savedredirecturl } = require("../middleware.js");


///////controller file access
const usercontroller= require("../controllers/controlleruser.js");

router.route("/signup")
.get(usercontroller.signupfoamrender)
.post( wrapasync(usercontroller.signuppostrequest));


router.route("/login")
.get(usercontroller.loginfoamrender)
.post(savedredirecturl, passport.authenticate("local", {failureRedirect: "/login",
  failureFlash:true , }) ,
  usercontroller.logingrequest);

// //////signup foam render///
// router.get("/signup",usercontroller.signupfoamrender);
// ///signup post request for save the data in database
// router.post("/signup", wrapasync(usercontroller.signuppostrequest));

////////login foam render//
// router.get("/login",usercontroller.loginfoamrender);
// ///////////login request for user login and matching data given by user with data//
// /////but this code not a login login fuction done by passport /////

// router.post("/login", savedredirecturl, passport.authenticate("local", {failureRedirect: "/login",
//   failureFlash:true , }) ,
//   usercontroller.logingrequest);
///////logout ///////////
router.get("/logout", usercontroller.logout);



module.exports= router;