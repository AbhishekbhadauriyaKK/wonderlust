const  mongoose=require("mongoose");
const Schema= mongoose.Schema;
const review= require("./reviews.js");
const { ref, string } = require("joi");
const { url } = require("inspector");


const listingschema= new Schema({
    title: String,
    description: String,
    image:{
        url:String,
        filename:String,
        },        
    price:{
      type: Number,
      
    } ,
    location : String,
    country: String,
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "review",
      },
    ],

    owner:{
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    
});


listingschema.post("findOneAndDelete" , async(listing)=>{
  if(listing ) {
    await review.deleteMany({_id : {$in :listing.reviews}});
  };
});




const listing= mongoose.model("listing" ,listingschema);
module.exports=listing;