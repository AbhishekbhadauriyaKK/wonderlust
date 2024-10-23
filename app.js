if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const  express=require("express");
const app= express();
const mongoose=require("mongoose");
const listing = require("./models/listingschema");
const path=require("path");
const methodOverride= require("method-override");
const ejsmate= require("ejs-mate");
const wrapasync= require("./utils/wrapasync.js");
const expresserror=require("./utils/expresserror.js");
const {listingschemas , reviewschema}=require('./schema.js');
const review = require("./models/reviews.js");
const listings= require("./routers/listings.js");
const reviews= require("./routers/review.js");
const session= require("express-session");
const flash=require("connect-flash");
const passport= require("passport");
const Localstrategy= require("passport-local");
const user=require("./models/user.js");
const userRouter= require("./routers/user.js");



app.set("view engine", "ejs");
app.set("views",path.join(__dirname, "./views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());


const sessionOption={
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true,
    },
}

app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new Localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

main().then(()=>{
    console.log("connected to DB")
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
} 


app.use((req, res, next) =>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.curruser= req.user;
    next();
})

app.use("/listings" , listings);
app.use("/listings/:id/reviews", reviews);
app.use("/" , userRouter);

// app.get("/demouser" , async(req , res)=>{
//     let fakeuser= new user({
//         email:'abc@gmail.com',
//         username: "delta",
//     });
//     let resitereduser= await user.register(fakeuser, "helloworld");
//     res.send(resitereduser);

// });



app.get("/" , (req , res)=>{
    res.redirect("/listings");
})


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