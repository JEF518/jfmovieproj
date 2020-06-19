const axios = require('axios');
var mcache = require('memory-cache');
var fs = require('fs');
const dataPath = "./data/real-data/movies.json";
require('dotenv').config();


const filmRoutes = (app, fs) => {
    // variables
    var cache = (duration) => {
        return (req, res, next) => {
            let key = '__express__' + req.originalUrl || req.url
            let cachedBody = mcache.get(key)
            if (cachedBody) {
                console.log('USING THE CACHED BODY BIT WHOOP WHOOP');
                res.send(cachedBody)
                return
            } else {
                console.log('HMMM DOING THAT BIT WITH SEND RESPONSE NOW...');
                res.sendResponse = res.send
                res.send = (body) => {
                    mcache.put(key, body, duration * 1000);
                    res.sendResponse(body)
                }
                next()
            }
        }
    }
    app.get("/", (req, res) => {
        res.render("home");
    });

    // READ
    app.get("/films", cache(10000), (req, res) => {
        fs.readFile(dataPath, "utf8", (err, data) => {
            if (err) {
                throw err;
            }
            var films = JSON.parse(data);
            var responseData = [];
            for (let i = 0; i < films.movies.length; i++) {
                axios.get("http://www.omdbapi.com/?apikey=" + process.env.MOVIE_DATA_KEY + "&t=" + films.movies[i].title + "&y=" + films.movies[i].year)
                    .then(response => {
                        console.log("GETTING SOME SWEET SWEET DATA");
                        //    console.log(response.data);
                        responseData.push(response.data);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            };

            return setTimeout(() => { renderThis('index', responseData, res) }, 1000);
        });
    });
    // READ GENRES
    app.get("/genres", (req, res) => {
        fs.readFile(dataPath, "utf8", (err, data) => {
            if (err) {
                throw err;
            }
            var films = JSON.parse(data);
            var genreObj = []
            for (let i = 0; i < films.movies.length; i++) {
                genreObj.push('{"genre": "' + films.movies[i].category + '"}');
            };
            var result = Array.from(new Set(genreObj.map(obj => JSON.stringify(obj)))).map(item => JSON.parse(item));
            let jsonArray = JSON.parse('{"genres": [' + result + ']}');

            return setTimeout(() => { renderThis('genre-menu', jsonArray, res) }, 1000);
        });
    });
    // READ GENRE FILM LIST
    app.get('/genre/:genre', cache(10000), (req, res) => {
        var oneGenreFilms = []
        var requestedGenre = req.params.genre;
        fs.readFile(dataPath, "utf8", (err, data) => {
            if (err) {
                throw err;
            }
            var films = JSON.parse(data);
            for (let i = 0; i < films.movies.length; i++) {
                if (films.movies[i].category == requestedGenre) {
                    oneGenreFilms.push(films.movies[i]);
                }
            };
        });
        setTimeout(() => { getAPIData(requestedGenre, JSON.parse('{"movies":' + JSON.stringify(oneGenreFilms) + '}'), res) }, 500)
    });

    // READ SINGLE FILM 
    app.get('/film/title/:title/year/:year/:plot?', cache(10000), (req, res) => {
        console.log(req.params.year);
        if (req.params.year != null) {
            var queryString = req.params.title + "&y=" + req.params.year;
        }
        else {
            var queryString = req.params.title;
        }
        axios.get("http://www.omdbapi.com/?apikey=" + process.env.MOVIE_DATA_KEY + "&t=" + queryString + "&plot=" + req.params.plot)
            .then(response => {
                console.log("GETTING SOME DATA");
                let filmData = response.data;
                console.log('title:', req.params.title);
                console.log('year: ', req.params.year);
                const googleReq = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=" + req.params.title + req.params.year + "trailer&type=video&key=" + process.env.TRAILER_DATA_KEY;
                console.log(googleReq);
                axios.get(googleReq
                ).then(response => {
                    filmData["trailer"] = response.data.items[0].id.videoId;
                }).then(setTimeout(() => { renderThis('single-film', filmData, res) }, 1500))
                    .catch(error => {
                        console.log("ERROR LOGGED:");
                        console.log(error);
                    });

            })
            .catch(error => {
                console.log(error);
            });
    });
    // READ SINGLE FILM TRAILER 
    app.get('/filmtrailer/:title/:year', (req, res) => {
        let title = req.params.title;
        let year = req.params.year;
        axios.get("https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=" + title + year + "&type=video&key=" + process.env.TRAILER_DATA_KEY
        ).then(response => {
            const trailerData = '{"trailer" : "' + response.data.items[0].id.videoId + '"}';
            let parsedTrailer = JSON.parse(trailerData);
            setTimeout(() => { renderThis('vid-test', parsedTrailer, res) }, 1000)
        })
            .catch(error => {
                console.log("ERROR LOGGED:");
                console.log(error);
            });
    });
};
function getAPIData(genre, basicFilmList, res) {
    var responseData = [];
    for (let i = 0; i < basicFilmList.movies.length; i++) {
        axios.get("http://www.omdbapi.com/?apikey=" + process.env.MOVIE_DATA_KEY + "&t=" + basicFilmList.movies[i].title + "&y=" + basicFilmList.movies[i].year)
            .then(response => {
                console.log("GETTING SOME SWEET SWEET DATA");
                responseData.push(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    };
    return setTimeout(() => { renderTheGenreView('genre-display', responseData, genre, res) }, 500);

}

function renderThis(view, responseData, res) {
    //  console.log('responseData:', responseData);
    res.render(view, { data: responseData })
}

function renderTheGenreView(view, responseData, genreData, res) {
    res.render(view, { data: responseData, genre: genreData })
}

module.exports = filmRoutes;