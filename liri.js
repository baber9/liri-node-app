
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

// Grab ref to 3rd & 4th args (to be used in switch control below)
var command = process.argv[2];
var command2 = "";

for (var i = 3; i < process.argv.length; i++) {
    command2 += process.argv[i]
    if (i < process.argv.length -1) {
        command2 += " ";
    }
}

switch (command) {
    case "my-tweets":
        var params = {screen_name: command2};
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (!error) {
                for (i = 0; i < 20; i++) {
                    console.log("-----------------------------");
                    console.log(tweets[i].created_at + ":");
                    console.log(command2 + " said: " + '"' + tweets[i].text + '"');
                    console.log("-----------------------------");
                }
            }
        });
        // console.log(JSON.stringify(client, null, 2));
        break;
    case "spotify-this-song":
        var responseMessage = "";  

        if (command2 === "") {
            command2 = "The Sign";
            responseMessage = "Your didn't include a song, so here's the results for 'The Sign' by Ace of Base";
        } else {
            responseMessage = "Your search for '" + command2 + "' returned the following...";
        }

        spotify.search ({ type: "track", query: command2, limit: 1 }, function(err, data) {
            if(err) {
                console.log("Spotify Error: " + err);
            }
            console.log("---------------------------------");
            console.log(responseMessage);
            console.log("Artist: " + data.tracks.items[0].artists[0].name);  //Artist
            console.log("Song: " + data.tracks.items[0].name);             // Song
            console.log("Album: " + data.tracks.items[0].album.name);       // Album
            console.log("Preview URL: " + data.tracks.items[0].external_urls.spotify);  // Track URL
            console.log("---------------------------------");
        });
        
        break;
    case "movie-this":
        
        if (command2 === "") {
            command2 = "Mr. Nobody";
        }
        
        var movieQueryURL = "http://www.omdbapi.com/?t=" + command2 + "&y=&plot=short&apikey=trilogy";
        
        request(movieQueryURL, (err, resp, body) => {
            if (!err && resp.statusCode === 200) {
                console.log(JSON.stringify(resp, null, 2));
            } else {
                console.log("OMDB Error: " + err);
            }
        });
        break;
    case "do-what-it-says":
        // 
        break;
    default:
        console.log("There has been an input error!");
}