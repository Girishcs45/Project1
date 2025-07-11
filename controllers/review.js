const Listing = require ("../models/listing");
const Review = require ("../models/review");


module.exports.postreview = async (req,res) =>{
    let newReview = new Review(req.body.review);
    let listing = await Listing.findById(req.params.id);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();  
    await listing.save();

    req.flash("success","New Review Created!");

    res.redirect(`/listings/${listing._id}`);
};

module.exports.deletereview = async (req,res) =>{
        let {id,reviewId} = req.params;
        await Listing.findByIdAndUpdate(id,{$pull:{reviews : reviewId}}); 
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","Review Deleted!");
        res.redirect(`/listings/${id}`);
    };