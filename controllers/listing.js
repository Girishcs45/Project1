const Listing = require("../models/listing");

module.exports.index = async(req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
};

module.exports.rendernew = (req,res)=>{
    res.render("listings/new.ejs")
};

module.exports.show = async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({path: "reviews",populate:{path:"author"},})
    .populate("owner");
    res.render("listings/show.ejs", {listing});
};

module.exports.create = async(req,res,next) =>{
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};

module.exports.edit = async (req,res) =>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
};

module.exports.update = async (req,res) =>{
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing is Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.delete = async (req,res) =>{
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    console.log(deletedListing);
    res.redirect("/listings");
};