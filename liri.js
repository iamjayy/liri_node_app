require("dotenv").config();

//variables to access keys.js
//variables for required packages
const keys = require("./keys.js");
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
const axios = require("axios");
const fs = require("fs");


//arguments to be entered by the user in liri
const appCommand = process.argv[2];
//console.log("appCommand: " + appCommand); 
//slice
const userSearch = process.argv.slice(3).join(" ");
//console.log("userSearch: " + userSearch); 

// divider will be used as a spacer between the tv data we print in log.txt
var divider = "\n------------------------------------------------------------\n\n";

//switch statements
this.liriApp = function(appCommand, userSearch){
    switch (appCommand){
        case "spotify-this-song":
        getSpotify(userSearch);
        break;

        case "concert-this":
        getBandsInTown(userSearch);
        break;

        case "movie-this":
        getOMDB(userSearch);
        break;

        case "do-what-it-says":
        getRandom();
        break;

        //if left blank then return message to user
        default:
        console.log("Enter one of the following commands: 'spotify-this-song', 'concert-this', 'movie-this', 'do-what-it-says' ")
    };
};


//function for spotify api
this.getSpotify = function(songName){
    if(!songName){
        songName = "The Sign";
    }
    spotify.search({ type: 'track', query: songName }, function(err, data) {
     if (err) {
      return console.log('Error occurred: ' + err);
     };

     var jsonData = data.tracks.item[0];
     
     for (i=0; i< response.artist; i++) {
        var spotifyData = [
            //line break 
           console.log("============================"),
           "Artist(s) Name: " + jsonData.album.artists[0].name,
           "Song Name: " + jsonData.name,
           "Song Preview Link: " + jsonData.href,
           "Album: " + jsonData.album.name
           ].join("\n\n");
   
           // Append artistData and the divider to log.txt, print showData to the console
           fs.appendFile("log.txt", spotifyData + divider, function (err) {
               if (err) throw err;
               console.log(spotifyData);
           });
     }

    });
};
    
//function for bands in town api

this.getBandsInTown = function(artist){
    var artist = userSearch;
    var jsonData = response.data[0]

    var bandQueryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

    axios.get(bandQueryURL).then(function(response){

        var artistData = [
          //line break 
          console.log("============================"),
          "Name of the venue: " + jsonData.venue.name,
          "Venue Location: " + jsonData.venue.city,
          "Date of the event: " + moment(jsonData.datetime).format("MM-DD-YYYY"),
        ].join("\n\n");

        // Append artistData and the divider to log.txt, print showData to the console
        fs.appendFile("log.txt", artistData + divider, function (err) {
            if (err) throw err;
            console.log(artistData);
        });
    });
};


//function for omdb api

this.getOMDB = function(movie){
    if(!movie){
        movie = "Mr. Nobody";
    }
    var movieQueryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    axios.request(movieQueryUrl).then(function(response){
        // adding a line break 
        console.log("=============================");
        var jsonData = response.data;

        var movieData = [
            "Title: " + jsonData.Title,
            "Year Released: " + jsonData.Year,
            "IMDB Rating: " + jsonData.imdbRating,
            "Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value,
            "Country Where Prodcued: " + jsonData.Country,
            "Language: " + jsonData.Language,
            "Plot: " + jsonData.Plot,
            "Actors: " + jsonData.Actors
        ].join("\n\n");

        // Append movieData and the divider to log.txt, print showData to the console
      fs.appendFile("log.txt", movieData + divider, function(err) {
        if (err) throw err;
        console.log(movieData);
    });
})
};


// FUNCTION RANDOM
this.getRandom = function(){
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);

        } else {
            console.log(data);

            var randomData = data.split(",");
            liriApp(randomData[0], randomData[1]);
        }
        //console.log("\r\n" + "testing: " + randomData[0] + randomData[1]);
    });
}

// FUNCTION to log results from the other funtions
function logResults(data) {
fs.appendFile("log.txt", data, function (err) {
    if (err) throw err;
});
};

liriApp(appCommand, userSearch);
