var fs = require("fs"); //reads and writes files
var request = require("request");
var keys = require("./keys.js");
var twitter = require("twitter");
var Spotify = require("node-spotify-api");
var liriCommand = process.argv[2];


if (liriCommand === 'movie-this') {

    movieThis();

}

else if (liriCommand === 'my-tweets') {

    myTweets();
}

else if (liriCommand === 'spotify-this-song') {

    spotifySong();
}

else if (liriCommand === 'do-what-it-says') {

    doWhatItSays();
}










///////////////////////////////  OMDB function //////////////////////////////////////////////////////////////////
function movieThis() {
    // Include the request npm package (Don't forget to run "npm install request" in this folder first!)
    var request = require("request");

    // Store all of the arguments in an array
    var nodeArgs = process.argv;


    // Create an empty variable for holding the movie name
    var movieName = "";

    // Loop through all the words in the node argument
    // And do a little for-loop magic to handle the inclusion of "+"s
    for (var i = 3; i < nodeArgs.length; i++) {

        if (i > 3 && i < nodeArgs.length) {

            movieName = movieName + "+" + nodeArgs[i];

        }

        else {

            movieName += nodeArgs[i];

        }
    }

    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {

            var thisMovie = JSON.parse(body)

            var movieInfo =
                "Title: " + thisMovie.Title + '\r\n' +
                "Year: " + thisMovie.Year + '\r\n' +
                "IMdB Rating: " + thisMovie.imdbRating + '\r\n' +
                "Rotton Tomatoes Rating: " + thisMovie.tomatoRating + '\r\n' +
                "Country: " + thisMovie.Country + '\r\n' +
                "Language: " + thisMovie.Language + '\r\n' +
                "Plot: " + thisMovie.Plot + '\r\n' +
                "Actors: " + thisMovie.Actors

            console.log(movieInfo);
        };



    });


}

////////////////////////////////Twitter Function//////////////////////////////////////////

function myTweets() {

    var client = new twitter({

        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret,
    });

    var params = {

        screen_name: 'WhatsAJimBob',
        limit: 20

    };

    client.get('statuses/user_timeline/', params, function(error, tweets, response) {
        if (!error) {

            for (var i = 0; i < tweets.length; i++) {

                var tweetResults = tweets[i].text + " " + tweets[i].created_at;

                console.log(tweetResults);

            }

        }

    });
}


/////////////////////////////////////Spotify Function//////////////////////////////////////////////
/////////Can only enter in single word song titles to work properly. Didnt have time to figure out similar for loop as the movie OMDB function for multiple word inputs////////////

function spotifySong(songName) {

    var spotify = new Spotify({

        id: 'b1b799e9eb854de89f355c74fb1d2b94',
        secret: 'f746edccdf5c4f20b7942091cec7de2d'
    })

    var songName = process.argv[3];

    if (!songName) {

        songName = "I Saw the Sign";
    }

    var params = songName;

    spotify.search({ type: 'track', query: params }, function(err, data) {

        if (!err) {

            var songInfo = data.tracks.items;
            for (var i = 0; i < 1; i++) {
                if (songInfo[i] != undefined) {
                    var spotifyResults =
                        "Artist: " + songInfo[i].artists[0].name + "\r\n" +
                        "Song: " + songInfo[i].name + "\r\n" +
                        "Preview Url: " + songInfo[i].preview_url + "\r\n" +
                        "Album the song is from: " + songInfo[i].album.name + "\r\n"

                    console.log(spotifyResults);

                }
            }
        }
    });
}



////////////////////////////do what it says function////////////////////////////
//////started to mess with do what it says function but ran out of time and energy lol/////
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (!error) {
            var doWhatItSaysResults = data.split(",");
            spotifySong(doWhatItSaysResults[0], doWhatItSaysResults[1]);
        }
        else {
            console.log("Error occurred" + error);
        }
    });
};
