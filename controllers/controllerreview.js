const listing=require("../models/listingschema");
const review= require("../models/reviews");


module.exports.createreview=async (req , res)=>{
    let list= await listing.findById(req.params.id);
    let newreview= new review(req.body.review);
    newreview.author=req.user._id;
    //console.log(newreview);
   list.reviews.push(newreview);
    await newreview.save();
    await list.save();
    //console.log("review saved");
   // res.send("saved")
    res.redirect(`/listings/${list._id}`);
}



module.exports.deletereview=async (req , res)=>{
    let {id ,  reviewId}= req.params;
    await listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
    await review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
   // res.send("review deleted")
}