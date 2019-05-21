require("dotenv").config();

const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const axios = require("axios");
const fs = require("fs");
const moment = require("moment");
const command = process.argv[2];

// movie-this 
function getMovie(movie) {
    if (movie === undefined ) {
        movie = "Mr. Nobody";
    }
    var movieQueryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    axios.request(movieQueryUrl).then(function (response) {
            console.log("=============================");
            console.log("* Title: " + response.data.Title + "\r\n");
            console.log("* Year Released: " + response.data.Year + "\r\n");
            console.log("* IMDB Rating: " + response.data.imdbRating + "\r\n");
            console.log("* Rotten Tomatoes Rating: " + response.data.Ratings[1].Value + "\r\n");
            console.log("* Country Where Produced: " + response.data.Country + "\r\n");
            console.log("* Language: " + response.data.Language + "\r\n");
            console.log("* Plot: " + response.data.Plot + "\r\n");
            console.log("* Actors: " + response.data.Actors + "\r\n");
            
            // Append to log.txt file
            var movieData = [
                           "\nMovie title: " + response.data.Title,
                           "\nYear released: " + response.data.Year,
                           "\nIMDB rating: " + response.data.imdbRating,
                           "\nRotten Tomatoes rating: " + response.data.Ratings[1].Value,
                           "\nCountry where produced: " + response.data.Country,
                           "\nLanguage: " + response.data.Language,
                           "\nPlot: " + response.data.Plot,
                           "\nActors: " + response.data.Actors
                            ]   

            fs.appendFile("log.txt", movieData, function (err) {
                if (err) throw err;
            });
        });
};

//concert-this 
function getConcert(artist) {

            var bandQueryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

            
            axios.get(bandQueryURL).then(
                function (response) {
                    console.log("=============================");
                    console.log("Name of the venue: " + response.data[0].venue.name + "\r\n");
                    console.log("Venue Location: " + response.data[0].venue.city + "\r\n");
                    console.log("Date of event: " + moment(response.data[0].datetime).format("MM-DD-YYYY") + "\r\n");

                    // Append to log.txt file
                    var concertData = [ 
                                    "\nName of the musician: " + artist,
                                    "\nName of the venue: " + response.data[0].venue.name,
                                    "\nVenue location: " + response.data[0].venue.city,
                                    "\n Date of event: " + moment(response.data[0].datetime).format("MM-DD-YYYY")
                                    ]

                    fs.appendFile("log.txt", concertData, function (err) {
                        if (err) throw err;
                    });
                });
        };

//spotify-this-song 
function getSong(songName) {
    var spotify = new Spotify(keys.spotify);
    if (songName === undefined ) {
        songName = "The Sign";
    };

    spotify.search({ type: 'track', query: songName }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("=============================");
        console.log("Artist(s) Name: " + data.tracks.items[0].album.artists[0].name + "\r\n");
        console.log("Song Name: " + data.tracks.items[0].name + "\r\n");
        console.log("Song Preview Link: " + data.tracks.items[0].href + "\r\n");
        console.log("Album: " + data.tracks.items[0].album.name + "\r\n");

        // Append to log.txt file
        var songData = [
                      "\nArtist: " + data.tracks.items[0].album.artists[0].name,
                      "\nSong Name: " + data.tracks.items[0].name,
                       "\n Preview Link: " + data.tracks.items[0].href, 
                        "\nAlbum Name: " + data.tracks.items[0].album.name
                    ]

        fs.appendFile("log.txt", songData, function (err) {
            if (err) throw err;
        });
    });
};

// do-what-it-says
function doWhatItSays() {
            fs.readFile("random.txt", "utf8", function (error, data) {
                if (error) {
                    return console.log(error);
                } else {
                    console.log(data);
                }
            });
        };

    function logResults(data) {
        fs.appendFile("log.txt", data, function (err) {
            if (err) throw err;
        });
    };

    //switch commannds
    switch (command) {
        case "spotify-this-song":
            getSong();
            break;

        case "concert-this":
            getConcert();
            break;

        case "movie-this":
            getMovie();
            break;

        case "do-what-it-says":
            doWhatItSays();
            break;
    }