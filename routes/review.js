const express = require("express");
const router = express.Router({mergeParams : true});
const {reviewSchema}=require("../schema.js");
const Review = require ("../models/review.js");
const Listing = require ("../models/listing.js");
const {isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

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
router.post("/", isLoggedIn,
    validateReview ,wrapAsync(reviewController.postreview));

// Delete Review route
router.delete("/:reviewId", 
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deletereview)
);

module.exports = router;