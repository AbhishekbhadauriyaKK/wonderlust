const express= require("express");
const router= express.Router({mergeParams: true});
const wrapasync= require("../utils/wrapasync.js");
const expresserror=require("../utils/expresserror.js");
const listing = require("../models/listingschema");
const {reviewschema}=require('../schema.js');
const review = require("../models/reviews.js");
const { isloggedin, isreviewauthor, validatereview } = require("../middleware.js");

const reviewcontroller= require("../controllers/controllerreview.js");


router.post("/" ,isloggedin, validatereview,  wrapasync(reviewcontroller.createreview));

router.delete("/:reviewId", isloggedin, isreviewauthor, wrapasync(reviewcontroller.deletereview));

module.exports=router;