const dataPath = "./data/real-data/movies.json";
var fs = require("fs");

const randomiseRoutes = (app, fs) => {
  app.get("/randomise", (req, res) => {
    res.render("randomise");
  });

  app.get("/random-movie-submit", (req, res) => {
    var oneGenreFilms = [];
    var requestedGenre = req.query.genre;
    fs.readFile(dataPath, "utf8", (err, data) => {
      if (err) {
        throw err;
      }
      var films = JSON.parse(data);
      for (let i = 0; i < films.movies.length; i++) {
        if (films.movies[i].category == requestedGenre) {
          oneGenreFilms.push(films.movies[i]);
        }
      }
      const randomFilm =
        oneGenreFilms[Math.floor(Math.random() * oneGenreFilms.length)];
      setTimeout(() => {
        return res.redirect(
          "/film/title/" +
            randomFilm.title +
            "/year/" +
            randomFilm.year +
            "/plot"
        );
      }, 1000);
    });
  });

  app.get("/random", (req, res) => {
    fs.readFile(dataPath, "utf8", (err, data) => {
      if (err) {
        throw err;
      }
      var allFilms = JSON.parse(data).movies;
      const randomFilm = allFilms[Math.floor(Math.random() * allFilms.length)];
      setTimeout(() => {
        return res.redirect(
          "/film/title/" +
            randomFilm.title +
            "/year/" +
            randomFilm.year +
            "/plot"
        );
      }, 1000);
    });
  });
};
module.exports = randomiseRoutes;
