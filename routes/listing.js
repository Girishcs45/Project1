const express = require("express");
const router = express.Router();
const {listingSchema}=require("../schema.js");
const {isLoggedIn} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


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

router.route("/")
.get(wrapAsync (listingController.index))
.post(isLoggedIn , validateListings,
    upload.single("listing[image.url]"),
    wrapAsync (listingController.create)
);


router.get("/new" , isLoggedIn ,listingController.rendernew);

router.route("/:id")
.get(
    wrapAsync (listingController.show)
)
.put(isLoggedIn , upload.single("listing[image.url]"),
    validateListings,
    wrapAsync (listingController.update)
)
.delete( isLoggedIn ,
    wrapAsync (listingController.delete)
);


// edit route
router.get("/:id/edit",isLoggedIn , 
    wrapAsync (listingController.edit)
);


module.exports = router;
 