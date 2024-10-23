const express= require("express");
const router= express.Router();
const listing = require("../models/listingschema");
const wrapasync= require("../utils/wrapasync.js");
const {isloggedin, isowner , validatelistings}= require("../middleware.js");
const multer= require('multer');
const {storage}= require("../cloudconfig.js");
const upload= multer({ storage });
// const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })





//////////////controller connnection///////////
const listingcontroller= require("../controllers/controllerlisting.js");
const { route } = require("./user.js");


router.route("/")
.get(wrapasync(listingcontroller.index))
.post(isloggedin,
     upload.single("listing[image]"),
    validatelistings , wrapasync(listingcontroller.createlisting));
        
// .post(upload.single("listing[image]"), (req , res)=>{
//     res.send(req.file);
// })


////////////new listing create form///////

router.get("/new", isloggedin, listingcontroller.rendernewform);


router.route("/:id")
.get(wrapasync (listingcontroller.showlisting))
.put(isloggedin ,isowner, upload.single("listing[image]"), wrapasync(listingcontroller.updatelisting))
.delete(isloggedin, isowner,  wrapasync(listingcontroller.deletelisting));

//router.get("/",  wrapasync(listingcontroller.index));



/////////create new listing post request for saving the listing///////
// router.post("/",validatelistings , wrapasync(listingcontroller.createlisting)
// );
// ////////////show route for show indivisual listings information///////////

//  router.get("/:id", wrapasync (listingcontroller.showlisting)
//  );
/////////// edit your listing foam///////////
router.get("/:id/edit" ,isloggedin ,isowner, wrapasync(listingcontroller.editlisting)
);


// ///////////////edit listing update route for updating the edited information/////////////


// router.put("/:id", isloggedin ,isowner, wrapasync(listingcontroller.updatelisting)
// );

//////////DELETE ROUTE///////////
// router.delete("/:id", isloggedin, isowner,  wrapasync(listingcontroller.deletelisting)
// );


module.exports= router;