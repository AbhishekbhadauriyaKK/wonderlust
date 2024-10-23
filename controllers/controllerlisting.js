const listing= require("../models/listingschema");

module.exports.index=async (req, res)=>{
    const alllistings = await listing.find({});
    //console.log(alllistings);
    res.render("./listings/index.ejs",{ alllistings });
 //res.send("working");
};




///////////////new///////

module.exports.rendernewform=(req, res)=>{
    res.render("./listings/new.ejs");
};

////create listing////
module.exports.createlisting= async (req,res, next)=>{
    // let{title , description ,  image , price, location , country }= req.params;///////// object bna k ye step bach gya html code me listing name se object bna dia .
      //let listing= req.body.listing;/////////// baad me isi ko new listing me save krna tha to ek step bcha lia.
      let url= req.file.url;
      let filename= req.file.display_name;
      //console.log(url ,"..", filename);
      const newlisting= new listing(req.body.listing);
      newlisting.owner=req.user._id;
      newlisting.image={url, filename};
   await newlisting.save();
   req.flash("success" , 'new listing created');
   res.redirect("/listings");
 };

 //////////show route/////
 module.exports.showlisting=async(req , res)=>{
    let {id}=req.params;
    const list= await listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner");

    if(!list){
        req.flash("error", "Listing you requested does not exist");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{list});
};


///////////edti listting/
module.exports.editlisting=async(req , res)=>{
    let {id}= req.params;
    const list = await listing.findById(id);
    if(!list){
        req.flash("error", "Listing you requested does not exist");
        res.redirect("/listings");
    }
      console.log("editlisting route");
    let originalimageurl=list.image.url;
    console.log(originalimageurl,"originalimageurl");
    originalimageurl= originalimageurl.replace("/upload", "/upload/h_300,w_250");
    
    res.render("./listings/edit.ejs", {list , originalimageurl});
}


////////////updatelisting////
module.exports.updatelisting=async(req , res)=>{
    let {id}= req.params;
  let list= await listing.findByIdAndUpdate(id, {...req.body.listing});
   if(typeof req.file !== "undefined"){
    let url= req.file.url;
    let filename= req.file.display_name;
    list.image= {url , filename};
    await list.save();
   }
  
    //await listing.findByIdAndUpdate(id, {$set: {...req.body.listing}});
   // console.log(listing.findById(id));
   req.flash("success", "Listing is edited");
     res.redirect(`/listings/${id}`);
}

////////delete listing./////////
module.exports.deletelisting=async (req , res)=>{
    let {id}= req.params;
    const deletedpost= await listing.findByIdAndDelete(id);
    console.log(deletedpost);
     req.flash("success" , "Listing is Deleted");
    res.redirect("/listings");
}