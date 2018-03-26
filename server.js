var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/scraper", {
  useMongoClient: true
});



app.get("/scrape", function(req, res) {
  
  // First, we grab the body of the html with request
  axios.get("https://kotaku.com/c/review/game-review").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    
    

    
    // Now, we grab every h2 within an Review tag, and do the following:
    $(".item__text").each(function(i, element) {
      var result = {};
      result.title = $(this)
        .children(".headline.entry-title")
        .text();
        
      result.link = $(this)
        .find(".headline.entry-title a")
        .attr("href"); 
         
      result.summary = $(this)
        .children("div .excerpt.entry-summary")
        .text();
        console.log(result.link);
      
        
        
      // Create a new Review using the `result` object built from scraping     
      db.Review
        .create(result)
        .then(function(dbReview) {
          // View the added result in the console
          // console.log("db");
          //console.log(dbReview);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });

    // If we were able to successfully scrape and save an Review, send a message to the client
    res.send("Scrape Complete");
  });
});


app.get("/reviews", function(req, res) {
  db.Review
  .find({})
  .then(function(dbReview) {
    res.json(dbReview);
  })
  .catch(function(err) {
    res.json(err);
  });
});

app.get("/reviews/:id", function(req, res) {
  db.Review
    .findOne({ _id: req.params.id })
    .populate("comments")
    .then(function(dbReview) {
      res.json(dbReview);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/reviews/:id", function(req, res) {
  db.Comments
  .create(req.body)
  .then(function(dbComments){
    return db.Review.findOneAndUpdate({ _id: req.params.id }, { comments: dbComments._id }, { new: true });
  })
  .then(function(dbReview) {
    res.json(dbReview);
  })
  .catch(function(err){
    res.json(err);
  });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
