require("dotenv").config();
var keys = require("./key.js");

// twitter setup
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);

// spotify setup
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

// Grab ref to 3rd & 4th args (to be used in switch control below)
var command = process.argv[2];
var command2 = process.argv[3];

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
        spotify.search ({ type: "track", query: command2, limit: 1 }, function(err, data) {
            if(err) {
                console.log("Something went wrong with spotify: " + err);
            }
            console.log(JSON.stringify(data.tracks.items[0].album.artists, null, 2));
        });
        
        break;
    case "movie-this":
        // 
        break;
    case "do-what-it-says":
        // 
        break;
    default:
        console.log("There has been an input error!");
}