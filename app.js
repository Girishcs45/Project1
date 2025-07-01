const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require ("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const {listingSchema}=require("./schema.js");


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


function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    };
}

class ExpressError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}


app.get("/",(req,res) =>{
    res.send("Hii i am root");
}); 

const validateListings = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body, { allowUnknown: true });

    if(error){
        throw new ExpressError(`400: ${result.error}`, 400);
    }else{
        next();
    }
}

// index route
app.get("/listings" ,    
    wrapAsync (async(req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
})
);

// New route
app.get("/listings/new" ,(req,res)=>{
    res.render("listings/new.ejs")
})


// show route
app.get("/listings/:id",
    wrapAsync (async(req,res)=>{
      let {id}=req.params;
      const listing=await Listing.findById(id);
      res.render("listings/show.ejs", {listing});
    })
);

// Create route
app.post("/listings", validateListings,
    wrapAsync (async(req,res,next) =>{
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
   })
);

// edit route
app.get("/listings/:id/edit", 
    wrapAsync (async (req,res) =>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
})
);

// update route
app.put("/listings/:id", validateListings,
    wrapAsync (async (req,res) =>{
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})
);

// Delete route
app.delete("/listings/:id", 
    wrapAsync (async (req,res) =>{
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));


// app.get("/testListing",async (req,res) =>{
//     let sampleListing = new Listing({
//         title : "My new Villa",
//         description : "By the beach",
//         price : 1200,
//         location : "Calangute , Goa",
//         country : "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successfull testing");
// });

// app.all("*",(req,res,next) => {
//     next(new ExpressError(404,"Page Not Found!"));
// });

app.use((err,req,res, next) => {
   let {statusCode = 500, message = "Something went wrong!"} = err;
   res.render("error.ejs",{message});
});

app.listen(8080 , () =>{
    console.log("Server is listening!!");
});