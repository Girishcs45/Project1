const express = require("express");
const router = express.Router();
const {listingSchema}=require("../schema.js");
const {isLoggedIn} = require("../middleware.js");
const listingController = require("../controllers/listing.js");


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
    wrapAsync (listingController.index)
);

// New route
router.get("/new" , isLoggedIn ,listingController.rendernew);


// show route
router.get("/:id",
    wrapAsync (listingController.show)
);

// Create route
router.post("/",isLoggedIn , validateListings,
    wrapAsync (listingController.create)
);

// edit route
router.get("/:id/edit",isLoggedIn , 
    wrapAsync (listingController.edit)
);

// update route
router.put("/:id",isLoggedIn , validateListings,
    wrapAsync (listingController.update)
);

// Delete route
router.delete("/:id", isLoggedIn ,
    wrapAsync (listingController.delete));

module.exports = router;
