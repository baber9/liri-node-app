
// spotify/twitter keys
require("dotenv").config();
var keys = require("./key.js");

// request used for OMDB API
var request = require('request');

// twitter setup
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);

// spotify setup
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

// fs setup - module included with node.js
var fs = require('fs');

// Grab ref to 3rd arg (to be used in switch control below)
var command = process.argv[2];
var command2 = "";
var responseMessage = "";

// Build string for last argument (arg doesn't require quotes)
for (var i = 3; i < process.argv.length; i++) {
    command2 += process.argv[i]
    if (i < process.argv.length -1) {
        command2 += " ";
    }
}

// Switch statement on command presented
switch (command) {

    case "my-tweets":

        // Pulls last 20 tweets of user submitted screen_name and builds response string
        client.get('statuses/user_timeline', {screen_name: command2}, (error, tweets, response) => {
            if (!error) {
                responseMessage += `These are the last 20 tweets for ${command2}...\n`;
                for (i = 0; i < 20; i++) {
                    responseMessage += "-----------------------------\n";
                    responseMessage += tweets[i].created_at + ": \n";
                    responseMessage += command2 + " said: " + '"' + tweets[i].text + '"' + "\n";
                }
                responseMessage += "-----------------------------";

                // call logData to log string to log.txt
                logData(responseMessage);
                // call displayData to console.log string
                displayData(responseMessage);
            }
        });
        break;

    case "spotify-this-song":

        // begin building response string
        responseMessage += "---------------------------------\n";
        // if user doesn't put in a track, make it "The Sign"
        if (command2 === "") {
            command2 = "The Sign";
            responseMessage += "Your didn't include a song, so here's the results for 'The Sign' possibly by Ace of Base (or not)...\n";
        } else {
            responseMessage += "Your spotify search for the track '" + command2 + "' returned the following...\n";
        }

        // call Spotify this to handle the spotify query and continue building response string
        spotifyThis(responseMessage, command2);
        break;

    case "movie-this":
        
        // Begin building response string
        responseMessage += "---------------------------------\n";

        // if user doesn't put in movie, make it "Mr. Nobody"
        if (command2 === "") {
            command2 = "Mr. Nobody";
            responseMessage += "Your didn't include a movie, so here's the results for 'Mr. Nobody'...\n";
        } else {
            responseMessage += `Your movie search for '${command2}' returned the following...\n`
        }
        
        // build query string for omdbapi
        var movieQueryURL = "http://www.omdbapi.com/?t=" + command2 + "&y=&plot=short&apikey=trilogy";
        
        // run query using 'request' module
        request(movieQueryURL, (err, resp, body) => {
            if (!err && resp.statusCode === 200) {
                // continue building response string
                responseMessage += `Movie Title: ${JSON.parse(resp.body).Title}\n`;
                responseMessage += `Release Year: ${JSON.parse(resp.body).Year}\n`;
                responseMessage += `IMDB Rating: ${JSON.parse(resp.body).imdbRating}\n`;
                responseMessage += `Rotten Tomatoes Rating: ${JSON.parse(resp.body).Ratings[1].Value}\n`;
                responseMessage += `Country of Production: ${JSON.parse(resp.body).Country}\n`;
                responseMessage += `Languages Available: ${JSON.parse(resp.body).Language}\n`;
                responseMessage += `Plot: ${JSON.parse(resp.body).Plot}\n`;
                responseMessage += `Actors: ${JSON.parse(resp.body).Actors}\n`;
                responseMessage += "---------------------------------";

                // call logData to log string to log.txt
                logData(responseMessage);
                // call displayData to console.log string
                displayData(responseMessage);

            } else {
                console.log("OMDB Error: " + err);
            }
        });
        break;
    
    case "do-what-it-says":
        // use fs.readFile to pull text from random.txt
        fs.readFile("random.txt", (err, data) => {
            // build response string
            responseMessage += "---------------------------------\n";
            responseMessage += `From random.txt, your spotify search for ${data} returned the following...\n`;
            // call spotifyThis using 'data' from random.txt
            spotifyThis(responseMessage, data);
        })
        break;

        // this should never run
    default:
        console.log("You broke the internet.  Thanks Obama!");
}

// FUNCTION to run spotify searches and build response string
function spotifyThis (responseMessage, command2) {
    spotify.search ({ type: "track", query: command2, limit: 10 }, (err, data) => {
        if(err) {
            console.log("Spotify Error: " + err);
        }
        responseMessage += "Artist: " + data.tracks.items[0].artists[0].name + "\n";  
        responseMessage += "Song: " + data.tracks.items[0].name + "\n";             
        responseMessage += "Album: " + data.tracks.items[0].album.name + "\n";       
        responseMessage += "Preview URL: " + data.tracks.items[0].external_urls.spotify + "\n";  
        responseMessage += "---------------------------------";

        displayData(responseMessage);
        logData(responseMessage);
    });
}

// FUNCTION to log all queries to log.txt
function logData (str) {
    fs.appendFile("log.txt", str, "utf8", (err) => {
        if (err) {
            console.log("Error: " + err);
        }
    })
}

// FUNCTION to console log all queries
function displayData (str) {
    console.log(str);
}