const  express=require("express");
const app= express();
const mongoose=require("mongoose");
const listing = require("./models/listingschema");
const path=require("path");
const methodOverride= require("method-override");
const ejsmate= require("ejs-mate");
const wrapasync= require("./utils/wrapasync.js");
const expresserror=require("./utils/expresserror.js");
const {listingschemas}=require('./schema.js');
//const listing = require("./models/listingschema");

app.set("view engine", "ejs");
app.set("views",path.join(__dirname, "./views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname, "public")));

main().then(()=>{
    console.log("connected to DB")
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}



app.get("/listings", async (req, res)=>{
    const alllistings = await listing.find({});
    //console.log(alllistings);
    res.render("./listings/index.ejs",{ alllistings });
 //res.send("working");
})

const validatelistings= (req, res ,next)=>{
    let{error}= listingschemas.validate(req.body);

    if(error){
        let errmsg= error.details.map((el)=>el.message).join(",");
        throw new expresserror(400, errmsg);
    }else{
        next();
    }
}



////////////new route///////
app.get("/listings/new", (req, res)=>{
    res.render("./listings/new.ejs");
})

///////post request////////
/////////create new listing///////
app.post("/listings",validatelistings , wrapasync( async (req,res, next)=>{
   // let{title , description ,  image , price, location , country }= req.params;///////// object bna k ye step bach gya html code me listing name se object bna dia .
     //let listing= req.body.listing;/////////// baad me isi ko new listing me save krna tha to ek step bcha lia.
         
     const newlisting= new listing(req.body.listing);
  await newlisting.save();
  res.redirect("/listings");
})
);
////////////show route///////////

app.get("/listings/:id", wrapasync (async(req , res)=>{
    let {id}=req.params;
    const list= await listing.findById(id);
    res.render("./listings/show.ejs",{list});
})
);
/////////// edit your listing///////////
app.get("/listings/:id/edit" , wrapasync( async(req , res)=>{
    let {id}= req.params;
    const list = await listing.findById(id);
    res.render("./listings/edit.ejs", {list});
})
);


//////////////////UPDATE ROUTE/////////////


app.put("/listings/:id",  wrapasync( async(req , res)=>{
    let {id}= req.params;
   await listing.findByIdAndUpdate(id, {...req.body.listing});
  
    //await listing.findByIdAndUpdate(id, {$set: {...req.body.listing}});
   // console.log(listing.findById(id));
     res.redirect('/listings');
})
);

//////////DELETE ROUTE///////////
app.delete("/listings/:id",wrapasync( async (req , res)=>{
    let {id}= req.params;
    const deletedpost= await listing.findByIdAndDelete(id);
    console.log(deletedpost);
    res.redirect("/listings");
})
);

app.get("/" , (req , res)=>{
    res.send(" hi , i m root");
})


////////new routes for listing ///

// app.get("/testlisting" ,async(req , res)=>{
//     let samplelisting= new listing({
//         title: "my new villa",
//         discription:" by the beach",
//         price:1200,
//         location: "calangute , goa",
//         country:"India",
//     })
//     await samplelisting.save();
//     console.log("sample was saved");
//     res.send("sucess listing");
// })
app.all("*",(req , res, next)=>{
    next(new expresserror(404 , "page not found"));
})

app.use((err,req, res , next )=>{
    let{statuscode=500 , message="something went wrong"}=err;
             // res.status(statuscode).send(message);
   res.status(statuscode).render("./listings/error.ejs",{message});
});

app.listen(8080 ,()=>{
    console.log("server is listening on port 8080");
    
})