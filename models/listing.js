const mongoose =require("mongoose");
const Schema = mongoose.Schema;
const ListingSchema  = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : String,
    image : {
       filename: { type: String },
       url: {
         type: String,
         default: "https://www.homebazaar.com/knowledge/wp-content/uploads/2022/07/Sea-Facing-House.jpg",
         set: function (v) {
        // If value is null, undefined, or an empty string (trimmed), return default
        if (!v || v.trim() === "") {
            return "https://www.homebazaar.com/knowledge/wp-content/uploads/2022/07/Sea-Facing-House.jpg";
        }
        return v;
    }
}

    },

    price: {
       type: Number,
       required: true,
       min: 0
    },
    location : String,
    country : String,
    reviews :[
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        }
    ]
});

const Listing = mongoose.model("Listing",ListingSchema);
module.exports = Listing;