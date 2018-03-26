
var mongoose = require = require("mongoose");
var Schema = mongoose.Schema;

var ReviewSchema = new Schema ({
    title: {
        type: String,
        required: true
    },
    

    link: {
        type: String,
        required: true
    },

    summary: {
        type: String
    },

    comments: {
        type: Schema.Types.ObjectId,
        ref: "Comments"
    }
});

var Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;