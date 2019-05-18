require("dotenv").config();

//variables to access keys.js
//variables for required packages
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require("axios");
var fs = require("fs");
var moment = require("moment")

//arguments to be entered by the user in liri
var appCommand = process.argv[2];
//console.log("appCommand: " + appCommand); 
//slice
var userSearch = process.argv.slice(3).join(" ");
//console.log("userSearch: " + userSearch); 

//switch statements 
function liriRun(appCommand, userSearch){
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
    }
};

//function for spotify api
function getSpotify(songName){
    var spotify = new Spotify(keys.spotify);

    if(!songName){
        songName = "The Sign";
    };

    spotify.search({ type: 'track', query: songName }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        //line break 
        console.log("============================");
        //return Artist(s)
        console.log("Artist(s) Name: " + data.tracks.item[0].album.artists[0].name + "\r\n");
        //return songs name
        console.log("Song Name: " + data.tracks.items[0].name + "\r\n");
        //return A preview link of the song from Spotify
        console.log("Song Preview Link: " + data.tracks.items[0].href + "\r\n");
        //return The album that the song is from
        console.log("Album: " + data.tracks.items[0].album.name + "\r\n");

        //append to random.txt
        var logSong = "Spotify log" + "\nArtist: " + data.tracks.items[0].album.artists[0].name;

        fs.appendFile("log.txt", logSong, function (err){
            if(err) throw err;
        });
    });
};
    
//function for bands in town api
function getBandsInTown(artist){
        var artist = userSearch;
        var bandQueryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

            axios.get(bandQueryURL).then(
                function (response){
                    //line break 
                    console.log("============================");

                    console.log("Name Of The Venue: " + response.data[0].venue.name + "\r\n");
                    console.log("Venue Location: " + response.data[0].venue.city + "\r\n");
                    console.log("Date of the event: " + moment(response.data[0].datetime).format("MM-DD-YYYY") + "\r\n");

                    var logConcert = "Concert Log" + "\nName of the musician: " + artist + "\nName of the venue: " + response.data[0].venue.name + 
                                      "\nVenue location: " + response.data[0].venue.city + "\n Date of event: " + moment(response.data[0].datetime).format("MM-DD-YYYY") + 
                                      "\n======End Concert Log Entry======" + "\n";
                    fs.appendFile("log.txt", logConcert, function (err) {
                        if (err) throw err;
                    });
                });
            
            }   


//function for omdb api
//---------Function to search OMDB API
function getOMDB(movie) {
    //console.log("Movie: " + movie);
    //If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
    if (!movie) {
        movie = "Mr. Nobody";
    }
    var movieQueryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    //console.log(movieQueryUrl);

    axios.request(movieQueryUrl).then(
        function (response) {
            // console.log(response.data);
            // adding a line break for clarity of when search results begin
            console.log("=============================");
            console.log("* Title: " + response.data.Title + "\r\n");
            console.log("* Year Released: " + response.data.Year + "\r\n");
            console.log("* IMDB Rating: " + response.data.imdbRating + "\r\n");
            console.log("* Rotten Tomatoes Rating: " + response.data.Ratings[1].Value + "\r\n");
            console.log("* Country Where Produced: " + response.data.Country + "\r\n");
            console.log("* Language: " + response.data.Language + "\r\n");
            console.log("* Plot: " + response.data.Plot + "\r\n");
            console.log("* Actors: " + response.data.Actors + "\r\n");
            
            //logResults(response);
            var logMovie = "Movie Log" + "\nMovie title: " + response.data.Title + "\nYear released: " 
                            + response.data.Year + "\nIMDB rating: " + response.data.imdbRating + "\nRotten Tomatoes rating: " + 
                            response.data.Ratings[1].Value + "\nCountry where produced: " + response.data.Country + "\nLanguage: " + 
                            response.data.Language + "\nPlot: " + response.data.Plot + "\nActors: " + response.data.Actors + 
                             + "\n";

            fs.appendFile("log.txt", logMovie, function (err) {
                if (err) throw err;
            });
        });
};

// Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
// FUNCTION RANDOM
function getRandom() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);

        } else {
            console.log(data);

            var randomData = data.split(",");
            liriRun(randomData[0], randomData[1]);
        }
        //console.log("\r\n" + "testing: " + randomData[0] + randomData[1]);

    });
};

// FUNCTION to log results from the other funtions
function logResults(data) {
fs.appendFile("log.txt", data, function (err) {
    if (err) throw err;
});
};


liriRun(appCommand, userSearch);
