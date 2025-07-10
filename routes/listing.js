const express = require("express");
const router = express.Router();
const {listingSchema}=require("../schema.js");
const Listing = require ("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");


function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    };
};

class ExpressError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
};

const validateListings = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body, { allowUnknown: true });

    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(`${errMsg}`, 400);
    }else{
        next();
    }
};


// index route
router.get("/" ,    
    wrapAsync (async(req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
})
);

// New route
router.get("/new" , isLoggedIn ,(req,res)=>{
    res.render("listings/new.ejs")
})


// show route
router.get("/:id",
    wrapAsync (async(req,res)=>{
      let {id}=req.params;
      const listing=await Listing.findById(id).populate("reviews").populate("owner");
      res.render("listings/show.ejs", {listing});
    })
);

// Create route
router.post("/",isLoggedIn , validateListings,
    wrapAsync (async(req,res,next) =>{
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success","New Listing Created!");
        res.redirect("/listings");
   })
);

// edit route
router.get("/:id/edit",isLoggedIn , 
    wrapAsync (async (req,res) =>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
})
);

// update route
router.put("/:id",isLoggedIn , validateListings,
    wrapAsync (async (req,res) =>{
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing is Updated!");
    res.redirect(`/listings/${id}`);
})
);

// Delete route
router.delete("/:id", isLoggedIn ,
    wrapAsync (async (req,res) =>{
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    console.log(deletedListing);
    res.redirect("/listings");
}));

module.exports = router;
