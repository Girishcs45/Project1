const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js")
const session = require("express-session");
const flash = require("connect-flash");


main().then(()=> { 
    console.log("connect to DB");
}).catch(err => console.log(err));


async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

app.set("view engine", "ejs");
app.set("views" , path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret :"mysupersecretcode",
    resave : false,
    saveUninitialized : true,
    cookie:{
        expires : Date.now() + 7 * 24  * 60 * 60 * 1000,
        maxAge: 7 * 24  * 60 * 60 * 1000,
        httpOnly : true,
    },
};

app.get("/",(req,res) =>{
    res.send("Hii i am root");
}); 

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next ) =>{
    res.locals.success=req.flash("success");
    next();
});


app.use("/listings", listings);
app.use("/listings/:id/reviews",reviews);

// app.all("*" , (req,res,next) => {
//     next(new ExpressError(404,"Page not found!"));
// });


app.use((err,req,res, next) => {
   let {statusCode = 500, message = "Something went wrong!"} = err;
   res.render("error.ejs",{message});
});

app.listen(8080 , () =>{
    console.log("Server is listening!!");
});