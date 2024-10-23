const user= require("../models/user");




module.exports.signupfoamrender=(req, res)=>{
    res.render("users/signup.ejs")
}


module.exports.signuppostrequest= async(req , res)=>{
    try{
        let {username , email , password}= req.body;
        const newuser= new user({email , username});
        const registereduser= await user.register(newuser, password);
        console.log(registereduser);
        req.login(registereduser , (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success" , "welcome to wonderlust!");
        res.redirect("/listings");
        })
        
    }catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
}




module.exports.loginfoamrender= (req , res)=>{
    res.render("users/login.ejs");
}



module.exports.logingrequest=async(req , res)=>{
    req.flash("success" ,"welcome to wonderlust! you are logged in !");
    let redirecturl= res.locals.redirecturl || "/listings" ;
      res.redirect(redirecturl);

}
module.exports.logout=(req , res , next)=>{

    req.logout((err) => {
        if(err){
          return  next(err);
        }
        req.flash("success" , "you are logout");
        res.redirect("/listings")
    });
}