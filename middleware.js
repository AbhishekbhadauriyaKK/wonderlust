const express= require("express");
const router= express.Router({mergeParams: true});
const listing= require("./models/listingschema");
const Review= require("./models/reviews.js");
const {reviewschema}=require('./schema.js');
const expresserror=require("./utils/expresserror.js");
const {listingschemas}=require('./schema.js');
const review = require("./models/reviews.js");









module.exports.isloggedin=(req , res, next)=>{
    if(!req.isAuthenticated()){
      req.session.redirecturl= req.originalUrl;
      req.flash("error" , "you need to login");
       return res.redirect("/login");
    }
    next();

}

module.exports.savedredirecturl=(req , res , next)=>{
  if(req.session.redirecturl){
    res.locals.redirecturl= req.session.redirecturl;
  }
  next();
}
// 67161f1d7c0fbc4ecdee88c9
// 67161f1d7c0fbc4ecdee88c9


module.exports.isowner= async (req , res , next)=>{
    let{id}= req.params;
    //console.log(id);
    let list= await listing.findById(id);
    if(!list.owner.equals(res.locals.curruser._id)){
       req.flash("error" ,"you are not a owner of this listing");
       console.log("dontmatched");
      return res.redirect(`/listings/${id}`);
    }
    //console.log("list.owner same");
    next();
}




module.exports.isreviewauthor= async(req, res, next)=>{
      let{id, reviewId}= req.params;
      let review= await Review.findById(reviewId);
      if(!review.author.equals(res.locals.curruser._id)){
        req.flash("error", "you are not a author of this review");
        return res.redirect(`/listings/${id}`);
      }
      next();
}



module.exports.validatelistings=(req, res , next)=>{
  let{error}= listingschemas.validate(req.body);
  if(error){
      let errmsg= error.details.map((el)=>el.message).join(",");
      throw new expresserror(400, errmsg);
  }else{
      next();
  }
};




module.exports.validatereview= (req, res ,next)=>{
  let {error}= reviewschema.validate(req.body);

  if(error){
      let errmsg= error.details.map((el)=>el.message).join(",");
      throw new expresserror(400, errmsg);
  }else{
      next();
  }
}