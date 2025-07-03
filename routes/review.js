const express = require("express");
const router = express.Router();
const {reviewSchema}=require("../schema.js");
const Review = require ("../models/review.js");
const Listing = require ("../models/listing.js");

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

const validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body, { allowUnknown: true });

    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(`${errMsg}`, 400);
    }else{
        next();
    }
};



// review
// Post route
router.post("/", validateReview ,wrapAsync(async (req,res) =>{
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();  
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));

// Delete Review route
router.delete("/:reviewId", 
    wrapAsync(async (req,res) =>{
        let {id,reviewId} = req.params;
        await Listing.findByIdAndUpdate(id,{$pull:{reviews : reviewId}}); 
        await Review.findByIdAndDelete(reviewId);
        res.redirect(`/listings/${id}`);
    })
);

module.exports = router;