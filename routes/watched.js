const axios = require("axios");
var mcache = require("memory-cache");
var fs = require("fs");
const watchedPath = "./data/real-data/watched.json";
require("dotenv").config();
var accents = require("remove-accents");

const watchedRoutes = (app, fs) => {
  // variables
  var cache = (duration) => {
    return (req, res, next) => {
      let key = "__express__" + req.originalUrl || req.url;
      let cachedBody = mcache.get(key);
      if (cachedBody) {
        console.log("USING THE CACHED BODY BIT WHOOP WHOOP");
        res.send(cachedBody);
        return;
      } else {
        console.log("HMMM DOING THAT BIT WITH SEND RESPONSE NOW...");
        res.sendResponse = res.send;
        res.send = (body) => {
          mcache.put(key, body, duration * 1000);
          res.sendResponse(body);
        };
        next();
      }
    };
  };

  // READ GENRES
  app.get("/watched/genres", (req, res) => {
    fs.readFile(watchedPath, "utf8", (err, data) => {
      if (err) {
        throw err;
      }
      var films = JSON.parse(data);
      var genreObj = [];
      for (let i = 0; i < films.movies.length; i++) {
        genreObj.push('{"genre": "' + films.movies[i].category + '"}');
      }
      var result = Array.from(
        new Set(genreObj.map((obj) => JSON.stringify(obj)))
      ).map((item) => JSON.parse(item));
      let jsonArray = JSON.parse(
        '{"genres": [' + result + '], "watched": true}'
      );

      return setTimeout(() => {
        renderThis("genre-menu", jsonArray, res);
      }, 1000);
    });
  });
  // READ GENRE FILM LIST
  app.get("/watched/genre/:genre", cache(10000), (req, res) => {
    var oneGenreFilms = [];
    var requestedGenre = req.params.genre;
    fs.readFile(watchedPath, "utf8", (err, data) => {
      if (err) {
        throw err;
      }
      var films = JSON.parse(data);
      for (let i = 0; i < films.movies.length; i++) {
        if (films.movies[i].category == requestedGenre) {
          console.log(films.movies[i]);
          oneGenreFilms.push(films.movies[i]);
        }
      }
    });
    setTimeout(() => {
      getAPIData(
        requestedGenre,
        JSON.parse('{"movies":' + JSON.stringify(oneGenreFilms) + "}"),
        res
      );
    }, 500);
  });

  // READ watched FILMS
  app.get("/watched/films", cache(10000), (req, res) => {
    fs.readFile(watchedPath, "utf8", (err, data) => {
      if (err) {
        throw err;
      }
      var films = JSON.parse(data);
      var responseData = [];
      for (let i = 0; i < films.movies.length; i++) {
        axios
          .get(
            "http://www.omdbapi.com/?apikey=" +
              process.env.MOVIE_DATA_KEY +
              "&t=" +
              films.movies[i].title +
              "&y=" +
              films.movies[i].year
          )
          .then((response) => {
            console.log("GETTING SOME SWEET SWEET DATA");
            responseData.push(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }

      return setTimeout(() => {
        renderThis("index", responseData, res);
      }, 1000);
    });
  });
};

function getAPIData(genre, basicFilmList, res) {
  var responseData = [];
  for (let i = 0; i < basicFilmList.movies.length; i++) {
    console.log(basicFilmList.movies[i].title);
    axios
      .get(
        "http://www.omdbapi.com/?apikey=" +
          process.env.MOVIE_DATA_KEY +
          "&t=" +
          basicFilmList.movies[i].title.split("&").join("%20%26%20") +
          "&y=" +
          basicFilmList.movies[i].year
      )
      .then((response) => {
        console.log(
          "http://www.omdbapi.com/?apikey=" +
            process.env.MOVIE_DATA_KEY +
            "&t=" +
            encodeURI(basicFilmList.movies[i].title) +
            "&y=" +
            basicFilmList.movies[i].year
        );
        console.log("GETTING SOME SWEET SWEET DATA");
        console.log(response.data);
        responseData.push(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return setTimeout(() => {
    renderTheGenreView("genre-display", responseData, genre, res);
  }, 500);
}

function renderThis(view, responseData, res) {
  //  console.log('responseData:', responseData);
  res.render(view, { data: responseData, watched: true });
}

function renderTheGenreView(view, responseData, genreData, res) {
  res.render(view, { data: responseData, genre: genreData, watched: true });
}

module.exports = watchedRoutes;
